"use client";

interface VideoPlayerProps {
  src: string;
  poster?: string;
  className?: string;
}

export default function VideoPlayer({ src, poster, className = "" }: VideoPlayerProps) {
  return (
    <div className={`overflow-hidden rounded-[20px] bg-black ${className}`}>
      <video
        src={src}
        poster={poster}
        controls
        playsInline
        preload="metadata"
        className="h-full w-full"
      >
        Your browser does not support video playback.
      </video>
    </div>
  );
}
