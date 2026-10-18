#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HOST = "www.bomgichul.com";
const ORIGIN = `https://${HOST}`;
const ENDPOINT = "https://searchadvisor.naver.com/indexnow";
// Public ownership-verification token, intentionally served by the website.
const KEY = "9abda0c95758ad2649d9a4ac5d9c5b6d";
const KEY_LOCATION = `${ORIGIN}/${KEY}.txt`;
const PROJECT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MAX_URLS = 10_000;

function usage() {
  console.log(`Usage: node scripts/indexnow.mjs --file <url-list.txt> [--submit]

One complete HTTPS URL per line. Blank lines and lines starting with # are ignored.
Only ${HOST} is accepted. Default: dry-run, prints JSON without network access.
Use --submit only after deploying the key file and the listed new/changed pages.
This command never discovers URLs or reads a sitemap.`);
}

function parseArguments(args) {
  let filename;
  let submit = false;
  for (let i = 0; i < args.length; i += 1) {
    if (args[i] === "--file") {
      if (filename || !args[i + 1] || args[i + 1].startsWith("--")) {
        throw new Error("Provide exactly one --file <url-list.txt> argument.");
      }
      filename = args[++i];
    } else if (args[i] === "--submit") {
      if (submit) throw new Error("--submit was supplied more than once.");
      submit = true;
    } else {
      throw new Error(`Unknown argument: ${args[i]}`);
    }
  }
  if (!filename) throw new Error("--file <url-list.txt> is required.");
  return { filename, submit };
}

function parseUrls(contents) {
  const urls = new Set();
  let supplied = 0;
  for (const [index, line] of contents.split(/\r?\n/).entries()) {
    const value = line.trim();
    if (!value || value.startsWith("#")) continue;
    const fail = (message) => { throw new Error(`Line ${index + 1}: ${message}`); };
    if (/[\s\\]/u.test(value)) fail("URL must not contain whitespace or backslashes.");
    if (/%(?![\da-f]{2})/iu.test(value)) fail("URL has an invalid percent escape.");
    let url;
    try { url = new URL(value); } catch { fail("Expected a complete absolute URL."); }
    if (url.origin !== ORIGIN || url.username || url.password) {
      fail(`Only HTTPS URLs on ${HOST}, without credentials or custom ports, are allowed.`);
    }
    if (url.hash || value.includes("#")) fail("Remove the fragment; submit the page URL only.");
    supplied += 1;
    urls.add(url.href.replace(/%[\da-f]{2}/giu, (escape) => escape.toUpperCase()));
    if (urls.size > MAX_URLS) fail(`A single request may contain at most ${MAX_URLS} unique URLs.`);
  }
  if (!urls.size) throw new Error("The file contains no URLs.");
  return { urlList: [...urls], supplied };
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 1 && (args[0] === "--help" || args[0] === "-h")) {
    usage();
    return;
  }
  const { filename, submit } = parseArguments(args);
  const localKey = (await readFile(path.join(PROJECT_ROOT, "public", `${KEY}.txt`), "utf8")).trim();
  if (localKey !== KEY || !/^[a-f\d-]{8,128}$/iu.test(localKey)) {
    throw new Error("The local public verification file does not match the configured key.");
  }
  const { urlList, supplied } = parseUrls(await readFile(path.resolve(filename), "utf8"));
  const payload = { host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList };
  console.error(`${submit ? "SUBMIT" : "DRY-RUN"}: ${urlList.length} URLs; ${supplied - urlList.length} duplicates removed.`);

  if (!submit) {
    console.log(JSON.stringify(payload, null, 2));
    console.error("Nothing sent. Review the URLs, deploy their changes and the key file, then explicitly add --submit.");
    return;
  }

  // Do not POST until the canonical site's public verification file is deployed.
  const keyResponse = await fetch(KEY_LOCATION, {
    redirect: "error",
    signal: AbortSignal.timeout(20_000),
  });
  if (keyResponse.status !== 200 || (await keyResponse.text()).trim() !== KEY) {
    throw new Error("The deployed key file is unavailable or does not match. Nothing was submitted.");
  }

  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(payload),
    redirect: "error",
    signal: AbortSignal.timeout(30_000),
  });
  const responseText = (await response.text()).trim();
  console.log(`IndexNow HTTP ${response.status}`);
  if (responseText) console.log(responseText.slice(0, 2000));
  if (response.status === 200) {
    console.log("Naver received the notification. This does not confirm crawling or indexing.");
  } else if (response.status === 202) {
    console.log("Naver received the URLs; ownership-key verification is pending. Indexing is not confirmed.");
  } else {
    throw new Error("Submission was not accepted. No automatic retry was attempted; inspect the response before retrying.");
  }
}

main().catch((error) => {
  console.error(`IndexNow: ${error.message}`);
  process.exitCode = 1;
});
