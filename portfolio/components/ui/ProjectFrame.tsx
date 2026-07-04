"use client";

import { useState } from "react";
import { ImageIcon } from "lucide-react";

interface ProjectFrameProps {
  src?: string;
  alt: string;
  ratio?: string;
  className?: string;
}

/**
 * Browser-chrome frame for a project preview. The image is rendered ONLY once it
 * successfully loads — if `src` is empty or the file is missing, a clean empty
 * media frame shows instead (a faint icon, no fake "coming soon" text). Drop a
 * real screenshot at the path and it appears automatically.
 */
export function ProjectFrame({
  src,
  alt,
  ratio = "16 / 10",
  className = "",
}: ProjectFrameProps) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(src) && !failed;

  return (
    <div
      className={`overflow-hidden rounded-xl border border-line bg-surface shadow-[var(--shadow-card)] ${className}`}
    >
      <div className="flex h-9 items-center gap-1.5 border-b border-line bg-bg px-4">
        <span className="h-2.5 w-2.5 rounded-full bg-line" />
        <span className="h-2.5 w-2.5 rounded-full bg-line" />
        <span className="h-2.5 w-2.5 rounded-full bg-line" />
      </div>
      <div className="relative bg-muted-surface" style={{ aspectRatio: ratio }}>
        {/* Empty media frame — visible until/unless a real image loads. */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
            loaded ? "opacity-0" : "opacity-100"
          }`}
        >
          <ImageIcon size={22} className="text-line" strokeWidth={1.5} />
        </div>
        {showImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={alt}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
              loaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setLoaded(true)}
            onError={() => setFailed(true)}
          />
        )}
      </div>
    </div>
  );
}
