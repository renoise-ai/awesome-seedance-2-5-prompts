import { readdirSync, readFileSync } from 'fs';
import { resolve } from 'path';

const DATA_DIR = resolve(import.meta.dirname!, '..', 'data', 'prompts');

interface PromptData {
  id: string;
  title: string;
  content: string;
  translatedContent?: string;
  description?: string;
  language: string;
  author?: { name: string; link?: string };
  sourceLink?: string;
  sourcePublishedAt?: string;
  thumbnail: string;
  videoUrl?: string;
  referenceImages?: string[];
  featured?: boolean;
  tags?: string[];
  tips?: string;
}

const REQUIRED_FIELDS = ['id', 'title', 'content', 'language', 'thumbnail'] as const;
const VALID_LANGUAGES = ['en', 'zh', 'ja', 'ko', 'es', 'fr', 'de', 'pt', 'it', 'tr', 'th', 'vi', 'hi'];

function validate(): void {
  const files = readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));

  if (files.length === 0) {
    console.log('⚠️  No prompt files found in data/prompts/');
    return;
  }

  let errors = 0;
  let valid = 0;
  const ids = new Set<string>();

  for (const file of files) {
    const path = resolve(DATA_DIR, file);
    let data: PromptData;

    try {
      data = JSON.parse(readFileSync(path, 'utf-8'));
    } catch (e) {
      console.error(`❌ ${file}: Invalid JSON — ${(e as Error).message}`);
      errors++;
      continue;
    }

    // Check required fields
    for (const field of REQUIRED_FIELDS) {
      if (!data[field]) {
        console.error(`❌ ${file}: Missing required field "${field}"`);
        errors++;
      }
    }

    // Check duplicate ID
    if (data.id) {
      if (ids.has(data.id)) {
        console.error(`❌ ${file}: Duplicate id "${data.id}"`);
        errors++;
      }
      ids.add(data.id);
    }

    // Check language
    if (data.language && !VALID_LANGUAGES.includes(data.language)) {
      console.error(`❌ ${file}: Invalid language "${data.language}" — must be one of: ${VALID_LANGUAGES.join(', ')}`);
      errors++;
    }

    // Check URLs
    if (data.thumbnail && !data.thumbnail.startsWith('http')) {
      console.error(`❌ ${file}: thumbnail must be a valid URL`);
      errors++;
    }
    if (data.videoUrl && !data.videoUrl.startsWith('http')) {
      console.error(`❌ ${file}: videoUrl must be a valid URL`);
      errors++;
    }

    if (errors === 0) {
      valid++;
    }
  }

  console.log(`\n📊 Validation complete: ${valid} valid, ${errors} errors, ${files.length} total files`);

  if (errors > 0) {
    process.exit(1);
  }
}

validate();
