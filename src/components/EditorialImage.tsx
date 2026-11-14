import { useState } from 'react';
import { MountainSnow } from 'lucide-react';

interface EditorialImageProps {
  src: string;
  alt: string;
  caption?: string;
  aspectClassName?: string;
  className?: string;
  priority?: boolean;
}

export function EditorialImage({
  src,
  alt,
  caption,
  aspectClassName = 'aspect-[4/3]',
  className = '',
  priority = false,
}: EditorialImageProps) {
  const [hasError, setHasError] = useState(false);

  return (
    <figure className={`m-0 ${className}`}>
      <div
        className={`relative w-full overflow-hidden bg-[#F5F4EF] border border-[#E7EAE6] ${aspectClassName}`}
      >
        {!hasError ? (
          <img
            src={src}
            alt={alt}
            loading={priority ? 'eager' : 'lazy'}
            referrerPolicy="no-referrer"
            onError={() => setHasError(true)}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        ) : (
          <div
            role="img"
            aria-label={alt}
            className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-[#F5F4EF] via-[#E7EAE6] to-[#DDE5DC] px-6 text-center text-[#303630]"
          >
            <MountainSnow className="h-8 w-8 text-[#234B38]" aria-hidden="true" />
            <div className="space-y-1">
              <p className="font-serif text-sm font-medium text-[#234B38]">
                이미지를 불러오는 중입니다
              </p>
              <p className="max-w-xs text-xs leading-relaxed text-[#5A625A]">
                {alt}
              </p>
            </div>
          </div>
        )}
      </div>
      {caption ? (
        <figcaption className="mt-2.5 text-xs leading-relaxed text-[#5A625A]">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
