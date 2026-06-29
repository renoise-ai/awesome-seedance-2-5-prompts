# Contributing to Awesome Seedance 2.5 Prompts

> ⚠️ **Note:** This repository currently hosts the **official Seedance 2.5 preview/sample set** published by ByteDance / Volcano Ark. Seedance 2.5 is still rolling out and is **not yet generally available**. Community prompt submissions will open once Seedance 2.5 reaches general availability — the guidelines below describe the format we'll use then.

Thanks for your interest in contributing! Here's how prompts are structured in this collection.

## For Data Pipeline (Automated)

If you're using the crawl → clean → upload pipeline:

1. Each prompt should be a separate JSON file in `data/prompts/`
2. File name format: `{id}.json` (e.g., `cinematic-sunset-ocean-001.json`)
3. Follow the schema in `data/schema.json`

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique identifier (e.g., `cinematic-sunset-001`) |
| `title` | string | Prompt title |
| `content` | string | The actual prompt text |
| `language` | string | Original language (`en`, `zh`, `ja`, etc.) |
| `thumbnail` | string | Video thumbnail URL |

### Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `translatedContent` | string | Translated prompt text |
| `description` | string | Brief description (max 200 chars) |
| `author` | object | `{ "name": "...", "link": "..." }` |
| `sourceLink` | string | Link to original post |
| `sourcePublishedAt` | string | Date (YYYY-MM-DD) |
| `videoUrl` | string | Video URL (linked, not uploaded) |
| `referenceImages` | string[] | Reference image URLs |
| `featured` | boolean | Whether this is a featured prompt |
| `tags` | string[] | Tags for categorization |
| `tips` | string | Usage tips and tricks |

### Example

```json
{
  "id": "cinematic-sunset-ocean-001",
  "title": "Cinematic Sunset Over Ocean Waves",
  "content": "A breathtaking cinematic shot of golden sunset light...",
  "description": "Cinematic ocean sunset with slow dolly movement",
  "language": "en",
  "author": { "name": "Creator Name", "link": "https://x.com/creator" },
  "sourceLink": "https://x.com/creator/status/123",
  "sourcePublishedAt": "2026-02-24",
  "thumbnail": "https://example.com/thumb.jpg",
  "videoUrl": "https://example.com/video.mp4",
  "tags": ["cinematic", "nature", "ocean"],
  "tips": "Try adjusting the camera movement for different effects."
}
```

## For Manual Contributions

1. Fork the repository
2. Create a new JSON file in `data/prompts/`
3. Validate: `pnpm run validate`
4. Submit a Pull Request

## Validation

Before submitting, run the validator to check your data:

```bash
pnpm install
pnpm run validate
```

## Code of Conduct

- Only submit prompts you have the right to share
- Respect original authors — always include attribution
- No NSFW or harmful content
