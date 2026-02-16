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
      /* eslint-disable-next-line @next/next/no-img-element */
      <img
        src={src}
        alt={alt}
        className={className}
        style={{ width, height, ...style }}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={{ width, height, ...style }}
    />
  );
}
