import { writeFileSync, readdirSync, unlinkSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

const UPSTREAM_URL = process.env.UPSTREAM_DATA_URL?.trim();
if (!UPSTREAM_URL) {
  console.error("Missing UPSTREAM_DATA_URL environment variable.");
  process.exit(1);
}

const DATA_DIR = join(import.meta.dirname ?? process.cwd(), "..", "data");
const PROMPTS_DIR = join(DATA_DIR, "prompts");
const TIPS_DIR = join(DATA_DIR, "tips");

type UpstreamRow = Record<string, unknown>;

interface SchemaTranslation {
  title: string;
  content: string;
  description: string;
  tips?: string;
}

interface SchemaPrompt {
  id: string;
  title: string;
  content: string;
  description: string;
  language: string;
  author: { name: string; link?: string };
  sourceLink?: string;
  sourcePublishedAt?: string;
  thumbnail?: string;
  videoUrl?: string;
  featured: boolean;
  tags: string[];
  tips?: string;
  translations?: Record<string, SchemaTranslation>;
}

function slugify(text: string, fallbackId: string, maxLen = 55): string {
  const slug = text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  if (!slug || slug.length < 3) {
    return `item-${fallbackId.slice(-8)}`;
  }

  if (slug.length <= maxLen) return slug;
  const cut = slug.slice(0, maxLen);
  const lastDash = cut.lastIndexOf("-");
  return lastDash > 20 ? cut.slice(0, lastDash) : cut;
}

function parseDate(raw: string): string | undefined {
  if (!raw) return undefined;
  try {
    const d = new Date(raw);
    if (isNaN(d.getTime())) return undefined;
    return d.toISOString().slice(0, 10);
  } catch {
    return undefined;
  }
}

function parseTags(raw: string): string[] {
  if (!raw) return [];
  try {
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.filter((t: unknown) => typeof t === "string" && t) : [];
  } catch {
    return raw
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }
}

function parseTranslations(
  raw: string,
  title: string,
  description: string,
): Record<string, SchemaTranslation> | undefined {
  if (!raw) return undefined;
  let parsed: Record<string, string>;
  try {
    parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
  } catch {
    return undefined;
  }
  if (!parsed || typeof parsed !== "object") return undefined;

  const result: Record<string, SchemaTranslation> = {};
  for (const [locale, translatedContent] of Object.entries(parsed)) {
    if (typeof translatedContent !== "string") continue;
    const cleanContent = translatedContent.replace(/^---\n/, "");
    const lines = cleanContent.split("\n").filter((l) => l.trim());
    const translatedTitle = lines[0]?.slice(0, 60) || title;
    const translatedDesc =
      cleanContent.length > 200 ? cleanContent.slice(0, 200) + "..." : cleanContent;

    result[locale] = {
      title: translatedTitle,
      content: cleanContent,
      description: translatedDesc,
    };
  }

  return Object.keys(result).length > 0 ? result : undefined;
}

function str(val: unknown): string {
  return typeof val === "string" ? val : "";
}

function findVideoUrl(row: UpstreamRow): string | undefined {
  for (const key of Object.keys(row)) {
    if (/video.*url/i.test(key) && key !== "videoUrl" && str(row[key])) {
      return str(row[key]);
    }
  }
  return str(row.videoUrl) || undefined;
}

function toSchemaPrompt(row: UpstreamRow): SchemaPrompt {
  const content = str(row.content);
  const text = str(row.text);
  const rowId = str(row.id);
  const titleRaw = content || text || rowId;
  const title =
    titleRaw.length > 60 ? titleRaw.slice(0, 60).trimEnd() + "..." : titleRaw;
  const id = slugify(titleRaw, rowId);
  const description = text;
  const videoUrl = findVideoUrl(row);
  const authorHandle = str(row.authorHandle);

  return {
    id,
    title,
    content: content || text,
    description,
    language: str(row.language) || "en",
    author: {
      name: str(row.authorName) || authorHandle || "Unknown",
      ...(authorHandle ? { link: `https://x.com/${authorHandle}` } : {}),
    },
    sourceLink: str(row.url) || undefined,
    sourcePublishedAt: parseDate(str(row.createdAt)),
    thumbnail: str(row.videoThumbnail) || undefined,
    videoUrl,
    featured: Boolean(row.featured),
    tags: parseTags(row.tags as string),
    ...(content !== text && text ? { tips: text } : {}),
    translations: parseTranslations(
      row.translations as string,
      title,
      description,
    ),
  };
}

function removeUndefined(obj: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined),
  );
}

async function fetchAll(endpoint: string): Promise<UpstreamRow[]> {
  const url = `${UPSTREAM_URL}${endpoint}`;
  console.log(`Fetching ${url} ...`);
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    console.error(`  Failed: HTTP ${res.status}`);
    return [];
  }
  const payload = (await res.json()) as unknown;
  const arr = Array.isArray(payload)
    ? payload
    : Array.isArray((payload as { data?: unknown }).data)
      ? (payload as { data: UpstreamRow[] }).data
      : [];
  console.log(`  Got ${arr.length} items`);
  return arr as UpstreamRow[];
}

function syncDir(dir: string, items: SchemaPrompt[]) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

  const newFiles = new Set<string>();
  let written = 0;
  let skipped = 0;

  for (const item of items) {
    const filename = `${item.id}.json`;
    newFiles.add(filename);
    const filepath = join(dir, filename);
    const cleaned = removeUndefined(item as unknown as Record<string, unknown>);
    writeFileSync(filepath, JSON.stringify(cleaned, null, 2) + "\n");
    written++;
  }

  const existing = readdirSync(dir).filter((f) => f.endsWith(".json"));
  for (const file of existing) {
    if (file === "example.json") continue;
    if (!newFiles.has(file)) {
      unlinkSync(join(dir, file));
      skipped++;
    }
  }

  console.log(
    `  ${dir}: wrote ${written}, removed ${skipped} stale files`,
  );
}

async function main() {
  console.log("=== Upstream Data Sync ===\n");

  const [rawPrompts, rawTips] = await Promise.all([
    fetchAll("/api/public/prompts"),
    fetchAll("/api/public/tips"),
  ]);

  const prompts = rawPrompts.map(toSchemaPrompt);
  const tips = rawTips.map(toSchemaPrompt);

  const promptIds = new Set<string>();
  const dedupedPrompts: SchemaPrompt[] = [];
  for (const p of prompts) {
    if (promptIds.has(p.id)) {
      p.id = `${p.id}-${promptIds.size}`;
    }
    promptIds.add(p.id);
    dedupedPrompts.push(p);
  }

  const tipIds = new Set<string>();
  const dedupedTips: SchemaPrompt[] = [];
  for (const t of tips) {
    if (tipIds.has(t.id)) {
      t.id = `${t.id}-${tipIds.size}`;
    }
    tipIds.add(t.id);
    dedupedTips.push(t);
  }

  syncDir(PROMPTS_DIR, dedupedPrompts);
  syncDir(TIPS_DIR, dedupedTips);

  console.log(
    `\nDone: ${dedupedPrompts.length} prompts, ${dedupedTips.length} tips`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
