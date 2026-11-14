import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Check, Copy } from 'lucide-react';
import {
  ECO_STORY_CONTENT,
  SITE_BRAND,
  VISIT_INFO_ROWS,
} from '../data/editorialContent';

interface EcoAndVisitSectionProps {
  onOfficialLinkClick?: () => void;
}

export function EcoAndVisitSection({
  onOfficialLinkClick,
}: EcoAndVisitSectionProps) {
  const [copiedAddress, setCopiedAddress] = useState(false);

  const handleCopyAddress = async () => {
    const addressRow = VISIT_INFO_ROWS.find((r) => r.id === 'address');
    if (!addressRow) return;
    try {
      await navigator.clipboard.writeText(addressRow.value);
      setCopiedAddress(true);
      window.setTimeout(() => setCopiedAddress(false), 2200);
    } catch {
      setCopiedAddress(false);
    }
  };

  return (
    <>
      {/* 05. ECO STORY SECTION */}
      <section
        id="eco-story"
        aria-labelledby="eco-story-heading"
        className="border-y border-[#E7EAE6] bg-[#F5F4EF] py-16 sm:py-20 lg:py-24"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7 space-y-6"
            >
              <div className="space-y-2.5">
                <p className="text-xs font-bold tracking-widest text-[#234B38]">
                  {ECO_STORY_CONTENT.sectionLabel}
                </p>
                <h2
                  id="eco-story-heading"
                  className="font-serif text-2xl text-[#234B38] sm:text-3xl lg:text-4xl"
                  style={{ textWrap: 'balance' }}
                >
                  <span className="font-light">겨울 숲의 </span>
                  <span className="font-bold">생태 이야기</span>
                </h2>
                <p className="text-sm font-semibold text-[#234B38] underline decoration-[#A8BBA8] underline-offset-4">
                  {ECO_STORY_CONTENT.subtitle}
                </p>
              </div>

              <p className="max-w-prose text-base font-light leading-[1.25] text-[#303630] sm:text-[17px] first-letter:float-left first-letter:mr-2.5 first-letter:mt-0.5 first-letter:font-serif first-letter:text-[2.6rem] first-letter:font-bold first-letter:leading-[0.95] first-letter:text-[#234B38]">
                {ECO_STORY_CONTENT.body}
              </p>
            </motion.div>

            {/* Botanical Margin Notes */}
            <div className="lg:col-span-5 flex flex-col justify-center gap-4">
              {ECO_STORY_CONTENT.marginNotes.map((note) => (
                <div
                  key={note.term}
                  className="rounded-lg border border-[#E7EAE6] bg-white p-5"
                >
                  <h3 className="font-serif text-base font-bold text-[#234B38]">
                    {note.term}
                  </h3>
                  <p className="mt-2 text-sm font-light leading-relaxed text-[#5A625A]">
                    {note.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 06. VISIT INFORMATION SECTION */}
      <section
        id="visit"
        aria-labelledby="visit-heading"
        className="bg-white py-16 sm:py-20 lg:py-24"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 border-b border-[#E7EAE6] pb-8 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl space-y-3">
              <p className="text-xs font-bold tracking-widest text-[#234B38]">
                06. Visit Information
              </p>
              <h2
                id="visit-heading"
                className="font-serif text-2xl text-[#234B38] sm:text-3xl lg:text-4xl"
                style={{ textWrap: 'balance' }}
              >
                <span className="font-light">위치 및 </span>
                <span className="font-bold">방문 정보</span>
              </h2>
            </div>

            <p className="text-xs font-light text-[#5A625A]">
              {SITE_BRAND.lastPolicyReview}
            </p>
          </div>

          <dl className="mt-4 divide-y divide-[#E7EAE6]">
            {VISIT_INFO_ROWS.map((row) => (
              <div
                key={row.id}
                className="grid grid-cols-1 gap-2 py-5 sm:grid-cols-12 sm:gap-6"
              >
                <dt className="text-sm font-bold text-[#234B38] sm:col-span-3">
                  {row.label}
                </dt>

                <dd className="sm:col-span-9 space-y-1.5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    {row.id === 'contact' ? (
                      <a
                        href={SITE_BRAND.officialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={onOfficialLinkClick}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#234B38] underline decoration-[#A8BBA8] underline-offset-4 hover:decoration-[#234B38] sm:text-base"
                      >
                        <span>아침고요수목원 공식 홈페이지 바로가기</span>
                        <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                      </a>
                    ) : (
                      <span
                        className={`text-sm sm:text-base ${
                          row.verificationStatus === 'pending_verification' &&
                          row.value.includes('확인 필요')
                            ? 'font-semibold text-[#7A5418]'
                            : 'font-normal text-[#303630]'
                        }`}
                      >
                        {row.value}
                      </span>
                    )}

                    {row.id === 'address' ? (
                      <button
                        type="button"
                        onClick={handleCopyAddress}
                        className="inline-flex min-h-[36px] items-center gap-1.5 rounded-md border border-[#E7EAE6] bg-[#F5F4EF] px-3 py-1.5 text-xs font-medium text-[#303630] hover:bg-[#E7EAE6] transition-colors whitespace-nowrap shrink-0"
                      >
                        {copiedAddress ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-[#234B38]" aria-hidden="true" />
                            <span>주소 복사됨</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5 text-[#5A625A]" aria-hidden="true" />
                            <span>주소 복사</span>
                          </>
                        )}
                      </button>
                    ) : null}
                  </div>

                  {row.note ? (
                    <p className="text-xs font-light leading-relaxed text-[#5A625A]">
                      {row.note}
                    </p>
                  ) : null}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}
