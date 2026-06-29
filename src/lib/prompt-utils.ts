import type { Prompt, PromptTranslation } from "@/types/prompt";
import type { Locale } from "./i18n";

export function getLocalized<K extends keyof PromptTranslation>(
  prompt: Prompt,
  field: K,
  locale: Locale,
): string {
  const tr = prompt.translations?.[locale];
  if (tr) {
    const value = tr[field];
    if (value) return value;
    if (field === "title" && tr.content) return tr.content;
  }
  return (prompt[field as keyof Prompt] as string) || "";
}

export function getAllTags(prompts: Prompt[]): string[] {
  const tagSet = new Set<string>();
  for (const p of prompts) {
    for (const tag of p.tags) {
      tagSet.add(tag);
    }
  }
  return Array.from(tagSet).sort();
}
