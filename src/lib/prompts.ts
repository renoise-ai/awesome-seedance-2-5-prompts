import type { Prompt, PromptTranslation } from "@/types/prompt";

const DEFAULT_LANGUAGE = "en";

function getYouBaseBaseUrl(): string {
  const baseUrl = process.env.YOUBASE_URL?.trim();
  if (!baseUrl) {
    throw new Error("Missing YOUBASE_URL. Please set it in your environment.");
  }
  return baseUrl.replace(/\/+$/, "");
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
  const thumbnail = asString(row.thumbnail ?? row.videoThumbnail ?? row.video_thumbnail) || undefined;
  const rawYoubaseVideoUrl = asString(row.youbaseVideoUrl);
  const videoId = rawYoubaseVideoUrl.match(/\/videos\/play\/(\d+)/)?.[1];
  const videoUrl = videoId ? `/api/video/${videoId}` : asString(row.videoUrl ?? row.video_url) || undefined;
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

async function fetchFromYouBase(endpointPath: string): Promise<Prompt[]> {
  const baseUrl = getYouBaseBaseUrl();
  const res = await fetch(`${baseUrl}${endpointPath}`, {
    cache: "no-store",
    headers: {
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    console.error(`Failed to fetch ${endpointPath} from YouBase: ${res.status}`);
    return [];
  }

  const payload = (await res.json()) as unknown;
  const list = parseListPayload(payload);

  return list
    .map((item, index) => normalizePrompt(item, index))
    .filter((item): item is Prompt => Boolean(item));
}

export async function getPrompts(): Promise<Prompt[]> {
  const prompts = await fetchFromYouBase("/api/public/prompts");
  return sortPrompts(prompts);
}

export async function getPromptById(id: string): Promise<Prompt | null> {
  const prompts = await getPrompts();
  return prompts.find((p) => p.id === id) || null;
}

export async function getTips(): Promise<Prompt[]> {
  const tips = await fetchFromYouBase("/api/public/tips");
  return sortPrompts(tips);
}
