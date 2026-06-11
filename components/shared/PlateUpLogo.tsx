import Image from 'next/image';
import Link from 'next/link';

type PlateUpLogoProps = {
  /** Size class for the logo symbol height — defaults to 'md' */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Whether the logo should link to the homepage */
  href?: string | null;
  /** Additional className for the wrapper */
  className?: string;
  /** Text colour class — defaults to primary */
  textColorClass?: string;
};

const sizeMap = {
  sm: { img: 22, text: 'text-lg' },
  md: { img: 28, text: 'text-2xl' },
  lg: { img: 34, text: 'text-3xl' },
  xl: { img: 42, text: 'text-4xl' },
};

export function PlateUpLogo({
  size = 'md',
  href = '/',
  className = '',
  textColorClass = 'text-[var(--color-primary)]',
}: PlateUpLogoProps) {
  const { img, text } = sizeMap[size];

  const inner = (
    <span
      className={`inline-flex items-center gap-1 ${className}`}
      aria-label="PlateUp"
    >
      {/* Logo symbol */}
      <span className="flex-shrink-0 select-none" aria-hidden="true">
        <Image
          src="/plateup-logo.svg"
          alt=""
          width={img}
          height={img}
          className="object-contain"
          priority
        />
      </span>

      {/* Wordmark */}
      <span className={`font-bold tracking-tight leading-none ${text} ${textColorClass}`}>
        PlateUp
      </span>
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] rounded-sm">
        {inner}
      </Link>
    );
  }

  return inner;
}
