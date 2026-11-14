import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import {
  ABOUT_CONTENT,
  HERO_CONTENT,
  WINTER_GARDEN_ITEMS,
} from '../data/editorialContent';
import { EditorialImage } from './EditorialImage';

export function AboutAndGardenSection() {
  return (
    <>
      {/* 01. ABOUT SECTION */}
      <section
        id="about"
        aria-labelledby="about-heading"
        className="bg-[#F5F4EF] py-16 sm:py-20 lg:py-24"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
            {/* Main Editorial Prose (70%) */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-8 space-y-6"
            >
              <p className="text-xs font-bold tracking-widest text-[#234B38]">
                {ABOUT_CONTENT.sectionLabel}
              </p>

              <h2
                id="about-heading"
                className="font-serif text-2xl leading-snug text-[#234B38] sm:text-3xl lg:text-4xl"
              >
                {ABOUT_CONTENT.titleLines.map((line, index) => (
                  <span
                    key={index}
                    className={`block ${index === 0 ? 'font-light' : 'font-bold'}`}
                  >
                    {line}
                  </span>
                ))}
              </h2>

              <p className="max-w-prose text-base font-medium leading-[1.75] text-[#234B38] sm:text-lg">
                {ABOUT_CONTENT.lead}
              </p>

              <div className="max-w-prose space-y-4 text-sm font-light leading-[1.8] text-[#303630] sm:text-base">
                {ABOUT_CONTENT.paragraphs.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </motion.div>

            {/* Editorial Margin Note & Pull Quote (30%) */}
            <motion.aside
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-4 flex flex-col justify-between gap-8"
            >
              <blockquote className="border-y border-[#D4DCD3] py-6">
                <p className="font-serif text-xl leading-relaxed text-[#234B38]">
                  <span className="block font-light italic">
                    “{ABOUT_CONTENT.pullQuoteLines[0]}
                  </span>
                  <span className="mt-1 block font-bold">
                    {ABOUT_CONTENT.pullQuoteLines[1]}”
                  </span>
                </p>
                <footer className="mt-3 text-xs font-light text-[#5A625A]">
                  {HERO_CONTENT.subQuote}
                </footer>
              </blockquote>

              <div className="rounded-lg border border-[#E7EAE6] bg-white p-5">
                <p className="text-xs font-bold text-[#234B38]">
                  이용 안내 및 콘텐츠 원칙
                </p>
                <p className="mt-2 text-xs font-light leading-relaxed text-[#5A625A]">
                  {ABOUT_CONTENT.policyNotice}
                </p>
              </div>
            </motion.aside>
          </div>
        </div>
      </section>

      {/* 02. WINTER GARDEN SECTION */}
      <section
        id="winter-garden"
        aria-labelledby="winter-garden-heading"
        className="bg-white py-16 sm:py-20 lg:py-24"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 border-b border-[#E7EAE6] pb-8 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl space-y-3">
              <p className="text-xs font-bold tracking-widest text-[#234B38]">
                02. Winter Garden
              </p>
              <h2
                id="winter-garden-heading"
                className="font-serif text-2xl leading-snug text-[#234B38] sm:text-3xl lg:text-4xl"
              >
                <span className="block font-light">겨울 정원에서</span>
                <span className="block font-bold">만나는 네 가지 풍경</span>
              </h2>
            </div>
            <p className="max-w-sm text-sm font-light leading-relaxed text-[#5A625A]">
              계절의 속도에 맞춰 천천히 걸으며 만나는 <strong className="font-semibold text-[#234B38]">겨울 수목원의 주요 관람 포인트</strong>입니다.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2">
            {WINTER_GARDEN_ITEMS.map((item, index) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.05,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group flex flex-col"
              >
                <EditorialImage
                  src={item.image}
                  alt={item.alt}
                  caption={`${item.figureIndex} — ${item.imageNote}`}
                  aspectClassName="aspect-[4/3]"
                />

                <div className="mt-5 flex flex-1 flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#5A625A]">
                      <span className="font-semibold text-[#234B38] underline decoration-[#A8BBA8] underline-offset-4">
                        {item.subtitle}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span
                        className={
                          item.verificationStatus === 'pending_verification'
                            ? 'font-medium text-[#7A5418]'
                            : 'font-light text-[#234B38]'
                        }
                      >
                        {item.scheduleLabel}
                      </span>
                    </div>

                    <h3 className="font-serif text-xl font-bold text-[#303630] group-hover:text-[#234B38] transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-sm font-light leading-relaxed text-[#5A625A] sm:text-base">
                      {item.description}
                    </p>
                  </div>

                  {item.officialUrl ? (
                    <div className="pt-1">
                      <a
                        href={item.officialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-[36px] items-center gap-1.5 text-xs font-medium text-[#234B38] underline decoration-[#A8BBA8] underline-offset-4 hover:decoration-[#234B38] transition-colors"
                      >
                        <span>공식 홈페이지에서 상세 확인</span>
                        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </a>
                    </div>
                  ) : null}
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
