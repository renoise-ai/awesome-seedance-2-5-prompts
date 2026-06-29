import { getPrompts, getTips } from "@/lib/prompts";
import GalleryClient from "@/components/GalleryClient";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [prompts, tips] = await Promise.all([getPrompts(), getTips()]);

  return <GalleryClient prompts={prompts} tips={tips} />;
}
