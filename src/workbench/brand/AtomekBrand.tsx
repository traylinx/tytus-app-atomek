import markAcid from './assets/atomek-mark-acid-256.png';
import markCream from './assets/atomek-mark-cream-256.png';
import iconVoid from './assets/atomek-icon-void-256.png';
import wordmark from './assets/atomek-wordmark-acid-on-void.svg';

export const ATOMEK_BRAND_ASSETS = {
  markAcid,
  markCream,
  iconVoid,
  wordmark,
} as const;

type AtomekBrandMarkProps = {
  size?: number;
  variant?: 'acid' | 'cream' | 'icon';
  className?: string;
};

export function AtomekBrandMark({ size = 28, variant = 'acid', className }: AtomekBrandMarkProps) {
  const src = variant === 'icon' ? iconVoid : variant === 'cream' ? markCream : markAcid;
  return (
    <img
      src={src}
      alt="Atomek"
      className={className}
      width={size}
      height={size}
      draggable={false}
      style={{ width: size, height: size }}
    />
  );
}

export function AtomekWordmark({ className }: { className?: string }) {
  return <img src={wordmark} alt="ATOMEK" className={className} draggable={false} />;
}
