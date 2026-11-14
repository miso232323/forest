import { useState } from 'react';
import { ArrowRight, MapPin } from 'lucide-react';
import { HERO_CONTENT, SITE_BRAND } from '../data/editorialContent';

interface HeroSectionProps {
  onPrimaryCtaClick?: () => void;
  onVisitCtaClick?: () => void;
}

export function HeroSection({
  onPrimaryCtaClick,
  onVisitCtaClick,
}: HeroSectionProps) {
  const [heroImgError, setHeroImgError] = useState(false);

  return (
    <section id="top" aria-label="겨울 여행 가이드 소개" className="bg-white">
      <div className="mx-auto max-w-6xl px-4 pt-6 pb-8 sm:px-6 lg:px-8 lg:pt-10 lg:pb-12">
        {/* Main Editorial Framed Hero Visual */}
        <div className="relative overflow-hidden rounded-lg border border-[#E7EAE6] bg-[#1E2E24] aspect-[4/5] sm:aspect-[16/10] lg:aspect-[16/9]">
          {!heroImgError ? (
            <img
              src={HERO_CONTENT.image}
              alt={HERO_CONTENT.alt}
              referrerPolicy="no-referrer"
              onError={() => setHeroImgError(true)}
              className="h-full w-full object-cover object-center motion-safe:animate-[subtleZoom_18s_ease-out_forwards]"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-[#234B38] via-[#2F5944] to-[#193628]" />
          )}

          {/* Measured Contrast Scrim (>= 4.5:1 text readability) */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-[#0F1E16]/85 via-[#0F1E16]/45 to-[#0F1E16]/15"
          />

          {/* Editorial Content Overlay */}
          <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 lg:p-14">
            <div className="max-w-2xl space-y-4">
              <p className="text-xs font-medium tracking-widest text-[#E7EAE6]">
                {HERO_CONTENT.eyebrow}
              </p>

              <h1
                className="font-serif font-semibold leading-[1.2] text-white"
                style={{
                  fontSize: 'clamp(2.15rem, 4.5vw, 3.75rem)',
                }}
              >
                {HERO_CONTENT.headlineLines.map((line, index) => (
                  <span key={index} className="block">
                    {line}
                  </span>
                ))}
              </h1>

              <p className="max-w-2xl text-sm leading-relaxed text-white/90 sm:text-base lg:text-lg">
                {HERO_CONTENT.bodyLines.map((line, index) => (
                  <span key={index} className="block">
                    {line}
                  </span>
                ))}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="#winter-garden"
                  onClick={onPrimaryCtaClick}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-md bg-[#234B38] px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-[#193628] transition-colors duration-150 whitespace-nowrap shrink-0"
                >
                  <span>{HERO_CONTENT.primaryCta}</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>

                <a
                  href="#visit"
                  onClick={onVisitCtaClick}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-md border border-white/50 bg-white/10 px-5 py-3 text-sm font-medium text-white backdrop-blur-xs hover:bg-white/20 transition-colors duration-150 whitespace-nowrap shrink-0"
                >
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                  <span>{HERO_CONTENT.secondaryCta}</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Quiet Figure Caption + Operational Utility Strip */}
        <div className="mt-4 flex flex-col gap-3 border-b border-[#E7EAE6] pb-4 text-xs text-[#5A625A] sm:flex-row sm:items-center sm:justify-between">
          <p>{HERO_CONTENT.imageCaption}</p>
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>{SITE_BRAND.subtitle}</span>
            <span aria-hidden="true">·</span>
            <span>경기도 가평군 상면</span>
            <span aria-hidden="true">·</span>
            <span>{SITE_BRAND.lastPolicyReview}</span>
          </p>
        </div>
      </div>
    </section>
  );
}
