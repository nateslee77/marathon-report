"use client";

import * as React from "react";

type TiltShineCardProps = {
  children: React.ReactNode;
  className?: string;
  maxTiltDeg?: number;
  shineSize?: number;
  disabled?: boolean;
};

export function TiltShineCard({
  children,
  className = "",
  maxTiltDeg = 12,
  shineSize = 300,
  disabled = false,
}: TiltShineCardProps) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [style, setStyle] = React.useState<React.CSSProperties>({});
  const frame = React.useRef<number | null>(null);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;

    const dx = px - 0.5;
    const dy = py - 0.5;

    const rotY = dx * (maxTiltDeg * 2);
    const rotX = -dy * (maxTiltDeg * 2);

    const sx = px * 100;
    const sy = py * 100;

    const shadowX = dx * 30;
    const shadowY = dy * 30;

    if (frame.current) cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      setStyle({
        transform: `perspective(900px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateZ(0)`,
        ["--sx" as string]: `${sx}%`,
        ["--sy" as string]: `${sy}%`,
        ["--ss" as string]: `${shineSize}px`,
        ["--shadow-x" as string]: `${shadowX.toFixed(1)}px`,
        ["--shadow-y" as string]: `${shadowY.toFixed(1)}px`,
      } as React.CSSProperties);
    });
  };

  const onLeave = () => {
    if (disabled) return;
    if (frame.current) cancelAnimationFrame(frame.current);
    setStyle({
      transform: "perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0)",
      ["--sx" as string]: "50%",
      ["--sy" as string]: "50%",
      ["--shadow-x" as string]: "0px",
      ["--shadow-y" as string]: "0px",
    } as React.CSSProperties);
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={[
        "group relative",
        disabled ? "" : "transition-transform duration-200 ease-out will-change-transform",
        className,
      ].join(" ")}
      style={disabled ? {} : style}
    >
      {/* Card surface */}
      <div
        className="relative overflow-hidden transition-shadow duration-200"
        style={{
          background: 'linear-gradient(180deg, rgba(22,22,22,0.95) 0%, rgba(10,10,10,0.98) 100%)',
          border: '1px solid rgba(194,255,11,0.15)',
          boxShadow: disabled
            ? '0 4px 20px rgba(0,0,0,0.4)'
            : [
                'inset 0 1px 0 rgba(255,255,255,0.06)',
                'inset 0 -1px 0 rgba(0,0,0,0.3)',
                `var(--shadow-x, 0px) var(--shadow-y, 0px) 30px rgba(0,0,0,0.6)`,
                '0 4px 40px rgba(0,0,0,0.5)',
                '0 0 60px rgba(194,255,11,0.03)',
              ].join(', '),
        }}
      >
        {/* Content */}
        <div className="relative">{children}</div>

        {!disabled && (
          <>
            {/* Main radial shine — follows cursor */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
              style={{
                zIndex: 10,
                background:
                  "radial-gradient(var(--ss, 300px) circle at var(--sx, 50%) var(--sy, 50%), rgba(194,255,11,0.18), rgba(194,255,11,0.04) 40%, rgba(194,255,11,0) 70%)",
                mixBlendMode: "screen",
              }}
            />

            {/* Secondary white hotspot — tighter, brighter */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
              style={{
                zIndex: 11,
                background:
                  "radial-gradient(120px circle at var(--sx, 50%) var(--sy, 50%), rgba(255,255,255,0.07), rgba(255,255,255,0) 60%)",
                mixBlendMode: "screen",
              }}
            />

            {/* Specular sweep — diagonal gloss */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
              style={{
                zIndex: 10,
                background:
                  "linear-gradient(135deg, rgba(194,255,11,0.06), rgba(255,255,255,0) 30%, rgba(194,255,11,0.04) 50%, rgba(255,255,255,0) 70%, rgba(194,255,11,0.03))",
              }}
            />

            {/* Edge highlight — top border glow on hover */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{
                zIndex: 10,
                boxShadow: 'inset 0 1px 1px rgba(194,255,11,0.1), inset 0 0 15px rgba(194,255,11,0.02)',
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}
