import Image from 'next/image';
import Link from 'next/link';

type PlateUpLogoProps = {
  /** Size class for the logo symbol height — defaults to 'responsive' */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'responsive';
  /** Whether the logo should link to the homepage */
  href?: string | null;
  /** Additional className for the wrapper */
  className?: string;
  /** Text colour class — defaults to primary */
  textColorClass?: string;
};

const sizeMap = {
  sm: { imgClass: 'h-[1.375rem] w-auto', text: 'text-lg' },
  md: { imgClass: 'h-[1.75rem] w-auto', text: 'text-2xl' },
  lg: { imgClass: 'h-[2.125rem] w-auto', text: 'text-3xl' },
  xl: { imgClass: 'h-[2.625rem] w-auto', text: 'text-4xl' },
  responsive: { 
    imgClass: 'h-[2rem] md:h-[2.25rem] lg:h-[2.5rem] w-auto', 
    text: 'text-2xl md:text-3xl lg:text-4xl' 
  },
};

export function PlateUpLogo({
  size = 'responsive',
  href = '/',
  className = '',
  textColorClass = 'text-[var(--color-primary)]',
}: PlateUpLogoProps) {
  const { imgClass, text } = sizeMap[size];

  const inner = (
    <span
      className={`inline-flex items-center gap-1.5 ${className}`}
      aria-label="PlateUp"
    >
      {/* Logo symbol */}
      <span className="flex-shrink-0 select-none flex items-center justify-center" aria-hidden="true">
        <Image
          src="/icon.png"
          alt=""
          width={512}
          height={512}
          className={`${imgClass} object-contain`}
          priority
        />
      </span>

      {/* Wordmark */}
      <span className={`font-bold tracking-tight leading-none flex items-center ${text} ${textColorClass}`}>
        PlateUp
      </span>
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] rounded-sm transition-opacity hover:opacity-90">
        {inner}
      </Link>
    );
  }

  return inner;
}
