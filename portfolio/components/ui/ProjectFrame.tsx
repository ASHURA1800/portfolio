"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
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
 * media frame shows instead (a faint icon, no fake "coming soon" text).
 *
 * On desktop (fine pointer, motion allowed) the image gets a 2–3% parallax drift
 * as the frame scrolls. A slight scale keeps object-cover gap-free during drift.
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

  const frameRef = useRef<HTMLDivElement>(null);
  const imgWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const frame = frameRef.current;
    const wrap = imgWrapRef.current;
    if (!frame || !wrap) return;

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = frame.getBoundingClientRect();
      const vh = window.innerHeight;
      // -1 (frame below) → 1 (frame above); 0 at vertical center.
      const rel = (rect.top + rect.height / 2 - vh / 2) / (vh / 2 + rect.height / 2);
      const shift = Math.max(-1, Math.min(1, rel)) * 3; // ±3%
      wrap.style.transform = `translateY(${shift}%) scale(1.06)`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [showImage]);

  return (
    <div
      ref={frameRef}
      className={`hover-lift overflow-hidden rounded-xl border border-line bg-card shadow-[var(--shadow-card)] ${className}`}
    >
      <div className="flex h-9 items-center gap-1.5 border-b border-line bg-bg px-4">
        <span className="h-2.5 w-2.5 rounded-full bg-line" />
        <span className="h-2.5 w-2.5 rounded-full bg-line" />
        <span className="h-2.5 w-2.5 rounded-full bg-line" />
      </div>
      <div className="relative overflow-hidden bg-muted-surface" style={{ aspectRatio: ratio }}>
        {/* Empty media frame — visible until/unless a real image loads. */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
            loaded ? "opacity-0" : "opacity-100"
          }`}
        >
          <ImageIcon size={22} className="text-line" strokeWidth={1.5} />
        </div>
        {showImage && (
          <div
            ref={imgWrapRef}
            className={`absolute inset-0 will-change-transform transition-opacity duration-300 ${
              loaded ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={src as string}
              alt={alt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              onLoad={() => setLoaded(true)}
              onError={() => setFailed(true)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
