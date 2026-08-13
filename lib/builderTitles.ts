/**
 * Deterministic role/stack -> builder title mapping.
 *
 * Matching is keyword-based against the free-text "role" field, so users
 * can type loosely ("backend dev", "Back-End Engineer", "SRE") and still
 * land on a sensible, non-cringe title. Falls back to a generic but still
 * technical title when nothing matches.
 */

type TitleRule = {
  keywords: string[];
  title: string;
};

const RULES: TitleRule[] = [
  { keywords: ["frontend", "front-end", "front end", "ui engineer"], title: "INTERFACE ALCHEMIST" },
  { keywords: ["backend", "back-end", "back end"], title: "SYSTEMS ARCHITECT" },
  { keywords: ["ai", "ml", "machine learning", "llm"], title: "MODEL TAMER" },
  { keywords: ["design", "ux", "ui/ux", "product design"], title: "PIXEL CARTOGRAPHER" },
  { keywords: ["full stack", "fullstack", "full-stack"], title: "FULL-STACK FUGITIVE" },
  { keywords: ["devops", "sre", "platform", "infra"], title: "INFRASTRUCTURE WITCH" },
  { keywords: ["security", "pentest", "appsec", "infosec"], title: "DIGITAL GHOST" },
  { keywords: ["data engineer", "data eng", "etl"], title: "PIPELINE CARTOGRAPHER" },
  { keywords: ["data scientist", "data science", "analytics"], title: "SIGNAL HUNTER" },
  { keywords: ["mobile", "android", "ios", "flutter"], title: "POCKET RUNTIME" },
  { keywords: ["blockchain", "web3", "smart contract", "solidity"], title: "LEDGER SMITH" },
  { keywords: ["embedded", "firmware", "iot", "hardware"], title: "SIGNAL WELDER" },
  { keywords: ["qa", "quality", "test engineer", "sdet"], title: "CHAOS AUDITOR" },
  { keywords: ["founder", "ceo", "pm", "product manager"], title: "ROADMAP OUTLAW" },
  { keywords: ["game", "unity", "unreal"], title: "WORLD RENDERER" },
  { keywords: ["cloud", "aws", "gcp", "azure"], title: "REGION NOMAD" },
];

const FALLBACK_TITLES = [
  "PROTOCOL DRIFTER",
  "STACK RUNNER",
  "BUILD-TIME ROGUE",
  "COMPILER WHISPERER",
  "RUNTIME NOMAD",
];

function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getBuilderTitle(roleInput: string): string {
  const normalized = roleInput.trim().toLowerCase();
  if (!normalized) return FALLBACK_TITLES[0] ?? "STACK RUNNER";

  for (const rule of RULES) {
    if (rule.keywords.some((k) => normalized.includes(k))) {
      return rule.title;
    }
  }

  const idx = hashString(normalized) % FALLBACK_TITLES.length;
  return FALLBACK_TITLES[idx] ?? "STACK RUNNER";
}

/** Deterministic 6-digit builder number derived from name + role, so the
 * same input always produces the same collectible ID. */
export function getBuilderNumber(name: string, role: string): string {
  const seed = hashString(`${name.toLowerCase()}::${role.toLowerCase()}`);
  return String(seed % 1000000).padStart(6, "0");
}

/** Chooses which of the poster composition variants to use, based on role.
 * See lib/canvasRender.ts for what each variant changes visually. */
export function getCompositionVariant(role: string): "grid" | "data" | "editorial" | "systems" {
  const normalized = role.trim().toLowerCase();
  if (normalized.includes("frontend") || normalized.includes("front-end") || normalized.includes("front end")) {
    return "grid";
  }
  if (normalized.includes("ai") || normalized.includes("ml") || normalized.includes("data")) {
    return "data";
  }
  if (normalized.includes("design") || normalized.includes("ux")) {
    return "editorial";
  }
  return "systems";
}
