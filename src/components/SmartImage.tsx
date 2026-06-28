import { useState, type ReactNode } from "react";

// One funnel for every image: skeleton shimmer + lazy + async decode + fade-in + graceful fallback.
export const SmartImage = ({
  src,
  alt = "",
  fallback,
  className = "",
  imgClassName = "",
  eager = false,
  overlay,
}: {
  src: string;
  alt?: string;
  fallback?: string;
  className?: string;
  imgClassName?: string;
  eager?: boolean;
  overlay?: ReactNode;
}) => {
  const [loaded, setLoaded] = useState(false);
  const [err, setErr] = useState(false);
  return (
    <div className={`relative overflow-hidden bg-ink-200 ${className}`}>
      {!loaded && <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-ink-200 to-ink-100" />}
      <img
        src={err && fallback ? fallback : src}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={eager ? "high" : undefined}
        onLoad={() => setLoaded(true)}
        onError={() => {
          if (fallback && !err) setErr(true);
          setLoaded(true);
        }}
        className={`w-full h-full object-cover photo-grade transition-opacity duration-700 ${loaded ? "opacity-100" : "opacity-0"} ${imgClassName}`}
      />
      {overlay}
    </div>
  );
};
