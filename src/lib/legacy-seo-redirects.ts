/**
 * Public URLs that were published before the 2026-09 concept consolidation.
 *
 * Keep these explicit instead of redirecting every missing slug to a hub: a
 * blanket redirect would turn genuine 404s into soft 404s. Each destination is
 * the current page that contains the old page's material.
 */
const LEGACY_PUBLIC_SERVICE_CONCEPT_SLUGS: Record<string, Record<string, string>> = {
  gyoyukhak: {
    "gyk-edu-thought": "gy-gyoyuk-cheolhak",
    "gyk-peters": "gy-gyoyuk-cheolhak",
    "gyk-piaget-vygotsky": "gy-baldal-iron",
    "gyk-instruct-design": "gy-gyosu-seolgye",
    "gyk-leadership-policy": "gy-jidoseong-donggi",
    "gyk-edu-finance": "gy-gyoyuk-jaejeong",
    "gyk-edu-sociology": "gy-gyoyuk-sahoehak",
  },
  bokji: {
    "bokji-guembeop": "bk-gaenyeom-yeoksa",
    "bokji-gilbert-teureol": "bk-jeongchaek-bunya",
    "bokji-baucher": "bk-jeongchaek-bunya",
    "bokji-leadership": "bk-jojik-gihoek",
    "bokji-biestek": "bk-silcheon-gachi",
    "bokji-gangjeom": "bk-silcheon-model",
    "bokji-sajeong": "bk-silcheon-gwajeong",
    "bokji-noin-siseol": "bk-bunyaron-adong-noin",
    "bokji-bradshaw": "bk-jeongchaek-gwajeong",
    "bokji-jeongchaek-model": "bk-jeongchaek-gwajeong",
  },
  gyojeonghak: {
    "gjh-restorative": "hb-hoebokjeok-sabeop",
    "gjh-progressive": "gj-buryu-cheou",
    "gjh-prison-labor": "gj-jakeop-gwihyu",
    "gjh-uncharged": "hj-migyeol-suyongja",
    "gjh-probation": "bg-bohogwanchal",
    "gjh-juvenile-disposition": "sn-bohocheobun",
  },
  gukjebeop: {
    "ilaw-jurisdiction": "il-gwalhalgwon",
    "ilaw-sea1": "il-sea-gison-yeonghae",
    "ilaw-sea2": "il-sea-eez-daeryukbung",
    "ilaw-human": "il-gaein-inkwon",
    "ilaw-diplomat": "il-diplo-teukgwon",
    "ilaw-wto": "il-wto-cheje",
  },
  nodongbeop: {
    "labor-chwieopgyuchik": "labor-chwieopgyuchik-jakseong",
    "labor-geunrogamdok": "labor-geunrogamdokgwan",
  },
  sobang: {
    "fire-inhwa-balhwa": "sb-yeonso-hyeongtae",
    "fire-moc-wiheomdo": "sb-yeonso-jogeon",
    "fire-hwajae-gangdo": "sb-hwajae-iron",
    "fire-sohwa-bangbeop": "sb-sohwa-iron",
    "fire-siseol-bunryu": "sb-sobang-siseol",
  },
  sobangbeop: {
    "firelaw-yongsu": "sbg-sobangryeok-jangbi",
  },
  sebeop: {
    "tax-bulbok": "gib-bulbok",
  },
};

export function getLegacySeoRedirect(pathname: string): string | null {
  if (pathname === "/history/concepts/simhwa") return "/history/concepts";

  const match = pathname.match(
    /^\/public-service\/concepts\/([^/]+)\/([^/]+)\/?$/,
  );
  if (!match) return null;

  const [, subject, oldSlug] = match;
  const newSlug = LEGACY_PUBLIC_SERVICE_CONCEPT_SLUGS[subject]?.[oldSlug];
  return newSlug ? `/public-service/concepts/${subject}/${newSlug}` : null;
}
