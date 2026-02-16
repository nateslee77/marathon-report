import Image from 'next/image';

interface PlayerAvatarProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  style?: React.CSSProperties;
}

export function PlayerAvatar({ src, alt, width, height, className, style }: PlayerAvatarProps) {
  const isGif = src.endsWith('.gif');

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
