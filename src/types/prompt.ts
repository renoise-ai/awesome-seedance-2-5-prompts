export interface PromptAuthor {
  name: string;
  link?: string;
}

export interface PromptTranslation {
  title: string;
  content: string;
  description: string;
  tips?: string;
}

export interface Prompt {
  id: string;
  title: string;
  content: string;
  description: string;
  language: string;
  author: PromptAuthor;
  sourceLink?: string;
  sourcePublishedAt?: string;
  thumbnail?: string;
  videoUrl?: string;
  referenceImages?: string[];
  featured?: boolean;
  tags: string[];
  tips?: string;
  translations?: Record<string, PromptTranslation>;
}
