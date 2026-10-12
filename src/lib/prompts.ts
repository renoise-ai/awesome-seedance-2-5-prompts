import type { Prompt, PromptTranslation } from "@/types/prompt";

const DEFAULT_LANGUAGE = "en";

/**
 * Seedance version this gallery serves. The `seedance` table upstream is shared
 * between 2.0 and 2.5, so every read must scope itself with `?model=` or the
 * two collections bleed into each other. The repo is the discriminator — the
 * 2.0 gallery lives in its own repo with this set to "seedance-2.0".
 */
const MODEL = "seedance-2.5";

/** Upstream caps `limit` at 100 per page. */
const PAGE_SIZE = 100;

/**
 * Ceiling on how much of the collection a single page renders. 2.5 is well
 * under it today, but the collection grows with every scrape, and this matches
 * the number the renoise.ai showcase publishes so the two surfaces agree.
 * Items arrive sorted by likes, so this keeps the strongest ones.
 */
const MAX_ITEMS = 200;

function getApiBaseUrl(): string {
  const baseUrl = process.env.PROMPTS_LIB_URL?.trim() || process.env.YOUBASE_URL?.trim();
  if (!baseUrl) {
    throw new Error("Missing PROMPTS_LIB_URL. Please set it in your environment.");
  }
  return baseUrl.replace(/\/+$/, "");
}

/**
 * Turn an `s3://assets/<path>` storage URI into a path under the upstream media
 * proxy. Returns "" when the URI is absent or not a storage URI.
 */
function storagePath(value: unknown): string {
  const uri = asString(value);
  return uri.startsWith("s3://assets/") ? uri.slice("s3://assets/".length) : "";
}

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function parseTags(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((tag) => asString(tag)).filter(Boolean);
  }

  if (typeof value !== "string") return [];
  const raw = value.trim();
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed)) {
      return parsed.map((tag) => asString(tag)).filter(Boolean);
    }
  } catch {
    // Continue with comma split when tags is not JSON.
  }

  return raw
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function parseTranslations(value: unknown): Record<string, PromptTranslation> | undefined {
  let obj: unknown = value;

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return undefined;
    try {
      obj = JSON.parse(trimmed);
    } catch {
      return undefined;
    }
  }

  if (!obj || typeof obj !== "object" || Array.isArray(obj)) return undefined;

  const result: Record<string, PromptTranslation> = {};
  for (const [locale, entry] of Object.entries(obj as Record<string, unknown>)) {
    if (typeof entry === "string") {
      result[locale] = { title: "", content: entry, description: "" };
    } else if (entry && typeof entry === "object" && !Array.isArray(entry)) {
      const e = entry as Record<string, unknown>;
      result[locale] = {
        title: asString(e.title),
        content: asString(e.content ?? e.text ?? e.prompt),
        description: asString(e.description ?? e.desc),
        tips: asString(e.tips ?? e.tip) || undefined,
      };
    }
  }

  return Object.keys(result).length > 0 ? result : undefined;
}

function parseAuthor(value: unknown, fallbackName: string, fallbackLink: string): Prompt["author"] {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const author = value as { name?: unknown; link?: unknown };
    const name = asString(author.name) || fallbackName;
    const link = asString(author.link) || fallbackLink;
    return link ? { name, link } : { name };
  }

  const textName = asString(value) || fallbackName;
  return fallbackLink ? { name: textName, link: fallbackLink } : { name: textName };
}

function normalizePrompt(raw: unknown, index: number): Prompt | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;

  const row = raw as Record<string, unknown>;

  const id = asString(row.id ?? row.slug ?? row.promptId ?? row.prompt_id) || `row-${index + 1}`;
  const title = asString(row.title ?? row.text ?? row.name) || id;
  const content = asString(row.content ?? row.prompt ?? row.text);
  const description = asString(row.description ?? row.desc);
  const language = asString(row.language) || DEFAULT_LANGUAGE;
  const sourceLink = asString(row.sourceLink ?? row.source_link ?? row.url) || undefined;
  const sourcePublishedAt = asString(row.sourcePublishedAt ?? row.source_published_at ?? row.createdAt ?? row.created_at) || undefined;
  // Poster: our own R2 cover first, then the Twitter thumbnail (pbs.twimg.com
  // serves cross-origin fine).
  const coverPath = storagePath(row.cover_storage_uri);
  const thumbnail =
    (coverPath && `/api/video/${coverPath}`) ||
    asString(row.thumbnail ?? row.videoThumbnail ?? row.video_thumbnail) ||
    undefined;

  // Video: only our own R2 copy is embeddable. `video_url` points at
  // video.twimg.com, which 403s on a Referer check from any non-Twitter origin,
  // so it is never surfaced as a playable source.
  const videoPath = storagePath(row.video_storage_uri);
  const videoUrl = videoPath ? `/api/video/${videoPath}` : undefined;
  const tags = parseTags(row.tags);
  const tips = asString(row.tips ?? row.tip) || undefined;
  const featured = Boolean(row.featured);

  const authorName = asString(row.authorName ?? row.author_name) || "Unknown";
  const authorLink = asString(row.authorLink ?? row.author_link ?? row.authorUrl ?? row.author_url);
  const author = parseAuthor(row.author, authorName, authorLink);

  const translations = parseTranslations(row.translations);
  const referenceImages = Array.isArray(row.referenceImages)
    ? row.referenceImages.map((item) => asString(item)).filter(Boolean)
    : undefined;

  return {
    id,
    title,
    content,
    description,
    language,
    author,
    sourceLink,
    sourcePublishedAt,
    thumbnail,
    videoUrl,
    referenceImages,
    featured,
    tags,
    tips,
    translations,
  };
}

function sortPrompts(items: Prompt[]): Prompt[] {
  return items.sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    const dateA = a.sourcePublishedAt || "";
    const dateB = b.sourcePublishedAt || "";
    return dateB.localeCompare(dateA);
  });
}

function parseListPayload(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload;
  if (payload && typeof payload === "object" && Array.isArray((payload as { data?: unknown }).data)) {
    return (payload as { data: unknown[] }).data;
  }
  return [];
}

function hasMore(payload: unknown): boolean {
  return Boolean(
    payload && typeof payload === "object" && (payload as { has_more?: unknown }).has_more,
  );
}

/**
 * Read one item type from the prompts-lib API, walking `offset` until the
 * upstream runs out or MAX_ITEMS is reached. A failed page ends the walk and
 * keeps whatever was collected, so a partial gallery beats a blank one.
 */
async function fetchItems(type: "prompt" | "tip"): Promise<Prompt[]> {
  const baseUrl = getApiBaseUrl();
  const items: Prompt[] = [];

  for (let offset = 0; items.length < MAX_ITEMS; offset += PAGE_SIZE) {
    const params = new URLSearchParams({
      type,
      model: MODEL,
      sort: "likes",
      order: "desc",
      limit: String(PAGE_SIZE),
      offset: String(offset),
    });
    const url = `${baseUrl}/api/public/items?${params}`;

    let payload: unknown;
    try {
      const res = await fetch(url, {
        cache: "no-store",
        headers: { Accept: "application/json" },
      });
      if (!res.ok) {
        console.error(`Failed to fetch ${type} items: ${res.status}`);
        break;
      }
      payload = await res.json();
    } catch (error) {
      console.error(`Failed to fetch ${type} items:`, error);
      break;
    }

    const list = parseListPayload(payload);
    if (list.length === 0) break;

    for (const raw of list) {
      const item = normalizePrompt(raw, items.length);
      if (item) items.push(item);
      if (items.length >= MAX_ITEMS) break;
    }

    if (!hasMore(payload)) break;
  }

  return items;
}

export async function getPrompts(): Promise<Prompt[]> {
  const prompts = await fetchItems("prompt");
  return sortPrompts(prompts);
}

export async function getPromptById(id: string): Promise<Prompt | null> {
  const prompts = await getPrompts();
  return prompts.find((p) => p.id === id) || null;
}

export async function getTips(): Promise<Prompt[]> {
  const tips = await fetchItems("tip");
  return sortPrompts(tips);
}
