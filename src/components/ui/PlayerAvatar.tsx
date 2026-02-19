import Image from 'next/image';
import { FACTIONS } from '@/lib/factions';

interface PlayerAvatarProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  style?: React.CSSProperties;
}

function getFactionBg(src: string): string | null {
  const faction = FACTIONS.find((f) => f.avatarSrc === src);
  return faction ? faction.secondaryColor : null;
}

export function PlayerAvatar({ src, alt, width, height, className, style }: PlayerAvatarProps) {
  const isGif = src.endsWith('.gif');
  const factionBg = getFactionBg(src);

  if (isGif) {
    return (
      <div
        className={className}
        style={{
          width,
          height,
          overflow: 'hidden',
          flexShrink: 0,
          ...style,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
      </div>
    );
  }

  if (factionBg) {
    const padding = Math.round(width * 0.12);
    return (
      <div
        className={className}
        style={{
          width,
          height,
          background: factionBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding,
          flexShrink: 0,
          overflow: 'hidden',
          ...style,
        }}
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          quality={90}
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      </div>
    );
  }

  // Use a larger intrinsic size so Next.js fetches a higher-quality source
  const intrinsic = Math.max(width, height, 128);

  return (
    <Image
      src={src}
      alt={alt}
      width={intrinsic}
      height={intrinsic}
      quality={90}
      className={className}
      style={{ width, height, ...style }}
    />
  );
}
