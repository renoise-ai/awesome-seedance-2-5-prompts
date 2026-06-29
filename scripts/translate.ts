import 'dotenv/config';
import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = resolve(__dirname, '..', 'data', 'prompts');

const TARGET_LOCALES = ['zh-CN', 'ja', 'pt-BR', 'es'] as const;
type Locale = typeof TARGET_LOCALES[number];

const LOCALE_NAMES: Record<Locale, string> = {
  'zh-CN': 'Simplified Chinese',
  'ja': 'Japanese',
  'pt-BR': 'Brazilian Portuguese',
  'es': 'Spanish',
};

// --- LLM API Config ---
// Supports two modes:
// 1. ANTHROPIC_API_KEY (direct Anthropic API)
// 2. ANTHROPIC_BASE_URL + ANTHROPIC_AUTH_TOKEN (gateway, e.g. Colorist Gateway)

interface TranslationResult {
  title: string;
  content: string;
  description?: string;
  tips?: string;
}

function getApiConfig(): { url: string; headers: Record<string, string> } {
  const baseUrl = process.env.ANTHROPIC_BASE_URL;
  const authToken = process.env.ANTHROPIC_AUTH_TOKEN;
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (baseUrl && authToken) {
    // Gateway mode (Colorist Gateway etc.)
    return {
      url: `${baseUrl}/v1/messages`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
        'anthropic-version': '2023-06-01',
      },
    };
  }

  if (apiKey) {
    // Direct Anthropic API
    return {
      url: 'https://api.anthropic.com/v1/messages',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
    };
  }

  throw new Error(
    'No API credentials found. Set either:\n' +
    '  - ANTHROPIC_API_KEY (direct API)\n' +
    '  - ANTHROPIC_BASE_URL + ANTHROPIC_AUTH_TOKEN (gateway)',
  );
}

async function translateWithClaude(
  text: { title: string; content: string; description?: string; tips?: string },
  targetLocale: Locale,
): Promise<TranslationResult> {
  const config = getApiConfig();
  const langName = LOCALE_NAMES[targetLocale];

  const fieldsToTranslate: Record<string, string> = { title: text.title, content: text.content };
  if (text.description) fieldsToTranslate.description = text.description;
  if (text.tips) fieldsToTranslate.tips = text.tips;

  const res = await fetch(config.url, {
    method: 'POST',
    headers: config.headers,
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 4096,
      messages: [{
        role: 'user',
        content: `Translate the following JSON fields into ${langName} (${targetLocale}).
This is an AI video generation prompt. Rules:
- "content" is a prompt for Seedance 2.5 video generation model — translate naturally, keep technical terms
- "title" and "description" should be localized naturally, not word-by-word
- "tips" should be practical and natural in the target language
- Keep brand names (Seedance, Renoise) unchanged
- Return ONLY valid JSON, no markdown fences, no explanation

Input:
${JSON.stringify(fieldsToTranslate, null, 2)}`,
      }],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Claude API error ${res.status}: ${err}`);
  }

  const data = await res.json() as { content: Array<{ text: string }> };
  const rawText = data.content[0].text.trim();

  // Strip markdown code fences if present
  const jsonStr = rawText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();

  try {
    return JSON.parse(jsonStr) as TranslationResult;
  } catch {
    throw new Error(`Failed to parse LLM response as JSON: ${jsonStr.slice(0, 200)}`);
  }
}

interface PromptData {
  id: string;
  title: string;
  content: string;
  description?: string;
  tips?: string;
  translations?: Record<string, TranslationResult>;
  [key: string]: unknown;
}

async function main() {
  const forceAll = process.argv.includes('--force');
  const specificLocale = process.argv.find(a => TARGET_LOCALES.includes(a as Locale)) as Locale | undefined;

  const files = readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
  console.log(`\n📦 Found ${files.length} prompt files`);

  const localesToTranslate = specificLocale ? [specificLocale] : [...TARGET_LOCALES];
  console.log(`🌍 Target languages: ${localesToTranslate.map(l => LOCALE_NAMES[l]).join(', ')}`);

  let translated = 0;
  let skipped = 0;

  for (const file of files) {
    const filePath = resolve(DATA_DIR, file);
    const data: PromptData = JSON.parse(readFileSync(filePath, 'utf-8'));

    if (!data.translations) data.translations = {};

    const missingLocales = localesToTranslate.filter(
      locale => forceAll || !data.translations![locale],
    );

    if (missingLocales.length === 0) {
      skipped++;
      continue;
    }

    console.log(`\n🔄 ${file} — translating ${missingLocales.length} languages...`);

    for (const locale of missingLocales) {
      try {
        console.log(`   → ${LOCALE_NAMES[locale]}...`);
        const result = await translateWithClaude(
          { title: data.title, content: data.content, description: data.description, tips: data.tips },
          locale,
        );
        data.translations[locale] = result;
        translated++;
        console.log(`   ✅ ${LOCALE_NAMES[locale]}`);
      } catch (err) {
        console.error(`   ❌ ${LOCALE_NAMES[locale]}: ${(err as Error).message}`);
      }
    }

    // Write back
    writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
  }

  console.log(`\n📊 Done: ${translated} translated, ${skipped} already up-to-date`);
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
