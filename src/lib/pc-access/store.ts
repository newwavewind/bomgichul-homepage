import 'server-only';
import { createHash, sign } from 'node:crypto';
import { PC_SUBJECTS, type PcSubject } from './catalog';

export type Store = 'ios' | 'android';
const APP = 'com.sanghyun.police';
const PLAY_AUD = 'https://oauth2.googleapis.com/token';

export function storeVerificationConfigured(platform?: Store): boolean {
  const ios = Boolean(process.env.POLICE_APPLE_IAP_ISSUER_ID && process.env.POLICE_APPLE_IAP_KEY_ID &&
    process.env.POLICE_APPLE_IAP_PRIVATE_KEY);
  const android = Boolean(process.env.POLICE_PLAY_SERVICE_ACCOUNT_JSON);
  if (platform === 'ios') return ios;
  if (platform === 'android') return android;
  return ios || android;
}

export function isStoreProof(platform: unknown, proof: unknown): proof is string {
  return typeof proof === 'string' && (
    platform === 'ios' ? /^\d{1,24}$/.test(proof) :
    platform === 'android' && /^[a-zA-Z0-9._:~+/=-]{15,2048}$/.test(proof)
  );
}

export function digest(value: string) {
  return createHash('sha256').update(value).digest('hex');
}

function required(key: string) {
  const value = process.env[key];
  if (!value) throw new Error('Store verification is unavailable');
  return value;
}

function jwt(header: object, claims: object, privateKey: string, ec = false) {
  const encode = (value: object) => Buffer.from(JSON.stringify(value)).toString('base64url');
  const input = `${encode(header)}.${encode(claims)}`;
  const key = privateKey.replace(/\\n/g, '\n');
  return `${input}.${sign('sha256', Buffer.from(input), ec ? { key, dsaEncoding: 'ieee-p1363' } : key).toString('base64url')}`;
}

const storeFetch = (url: string, options: RequestInit = {}) =>
  fetch(url, { ...options, cache: 'no-store', signal: AbortSignal.timeout(8000) });

async function applePurchase(proof: string, productId: string) {
  const iat = Math.floor(Date.now() / 1000);
  const bearer = jwt(
    { alg: 'ES256', kid: required('POLICE_APPLE_IAP_KEY_ID'), typ: 'JWT' },
    { iss: required('POLICE_APPLE_IAP_ISSUER_ID'), iat, exp: iat + 300, aud: 'appstoreconnect-v1', bid: APP },
    required('POLICE_APPLE_IAP_PRIVATE_KEY'), true,
  );
  // Only the production App Store Server API is accepted. The payload comes from
  // Apple's authenticated HTTPS response, never from the app or QR.
  const response = await storeFetch(`https://api.storekit.apple.com/inApps/v1/transactions/${proof}`, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error('App Store verification unavailable');
  const { signedTransactionInfo } = await response.json();
  const encoded = typeof signedTransactionInfo === 'string' && signedTransactionInfo.split('.')[1];
  if (!encoded) throw new Error('Missing App Store transaction');
  const tx = JSON.parse(Buffer.from(encoded, 'base64url').toString());
  if (tx.bundleId !== APP || tx.productId !== productId || tx.transactionId !== proof ||
      tx.environment !== 'Production' || tx.type !== 'Non-Consumable' ||
      tx.inAppOwnershipType !== 'PURCHASED' || tx.revocationDate ||
      !/^\d{1,24}$/.test(tx.originalTransactionId || '')) return null;
  return tx.originalTransactionId as string;
}

let playToken: { value: string; expires: number } | undefined;
let playTokenRequest: Promise<string> | undefined;

async function getPlayToken() {
  if (playToken && playToken.expires > Date.now()) return playToken.value;
  if (playTokenRequest) return playTokenRequest;
  playTokenRequest = (async () => {
    const account = JSON.parse(required('POLICE_PLAY_SERVICE_ACCOUNT_JSON'));
    const iat = Math.floor(Date.now() / 1000);
    const assertion = jwt({ alg: 'RS256', typ: 'JWT' }, {
      iss: account.client_email, scope: 'https://www.googleapis.com/auth/androidpublisher',
      aud: PLAY_AUD, iat, exp: iat + 1800,
    }, account.private_key);
    const response = await storeFetch(PLAY_AUD, {
      method: 'POST',
      body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion }),
    });
    if (!response.ok) throw new Error('Google Play verification unavailable');
    const token = await response.json();
    if (!token.access_token) throw new Error('Missing Google Play access token');
    playToken = { value: token.access_token, expires: Date.now() + Math.max(0, (Number(token.expires_in) - 60) * 1000) };
    return playToken.value;
  })();
  try { return await playTokenRequest; } finally { playTokenRequest = undefined; }
}

async function googlePurchase(proof: string, productId: string) {
  const bearer = await getPlayToken();
  const response = await storeFetch(
    `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${APP}/purchases/productsv2/tokens/${encodeURIComponent(proof)}`,
    { headers: { Authorization: `Bearer ${bearer}` } },
  );
  if (response.status === 404 || response.status === 410) return null;
  if (!response.ok) throw new Error('Google Play verification unavailable');
  const purchase = await response.json();
  if (purchase.testPurchaseContext || purchase.purchaseStateContext?.purchaseState !== 'PURCHASED' ||
      !purchase.orderId || !purchase.productLineItem?.some((item: { productId: string }) => item.productId === productId)) return null;
  return proof;
}

export async function verifyStorePurchase(platform: Store, proof: string, subject: PcSubject) {
  const productId = PC_SUBJECTS[subject].productId;
  const id = await (platform === 'ios' ? applePurchase(proof, productId) : googlePurchase(proof, productId));
  return id ? { key: digest(`${APP}:${platform}:${id}`), platform, proof } : null;
}
