import { useState } from 'react';
import { motion } from 'motion/react';
import {
  BatteryCharging,
  Footprints,
  Layers,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import {
  EXPERIENCE_ITEMS,
  WINTER_TIPS,
  type WinterTipItem,
} from '../data/editorialContent';

type ExperienceFilter = 'all' | 'permanent' | 'seasonal';

interface ExperienceAndTipsSectionProps {
  onExperienceSelect?: (title: string) => void;
}

function TipIcon({ iconKey }: { iconKey: WinterTipItem['iconKey'] }) {
  switch (iconKey) {
    case 'footprints':
      return <Footprints className="h-6 w-6 text-[#234B38]" aria-hidden="true" />;
    case 'layers':
      return <Layers className="h-6 w-6 text-[#234B38]" aria-hidden="true" />;
    case 'sparkles':
      return <ShieldCheck className="h-6 w-6 text-[#234B38]" aria-hidden="true" />;
    case 'battery':
      return (
        <BatteryCharging className="h-6 w-6 text-[#234B38]" aria-hidden="true" />
      );
  }
}

export function ExperienceAndTipsSection({
  onExperienceSelect,
}: ExperienceAndTipsSectionProps) {
  const [filter, setFilter] = useState<ExperienceFilter>('all');
  const [selectedExpId, setSelectedExpId] = useState<string | null>(null);

  const filteredExperiences = EXPERIENCE_ITEMS.filter((item) =>
    filter === 'all' ? true : item.category === filter
  );

  return (
    <>
      {/* 03. EXPERIENCE SECTION */}
      <section
        id="experience"
        aria-labelledby="experience-heading"
        className="border-t border-[#E7EAE6] bg-[#F5F4EF] py-16 sm:py-20 lg:py-24"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 border-b border-[#D9DFD7] pb-8 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl space-y-3">
              <p className="text-xs font-medium tracking-widest text-[#234B38]">
                03. Experience
              </p>
              <h2
                id="experience-heading"
                className="font-serif text-2xl font-semibold text-[#234B38] sm:text-3xl lg:text-4xl"
                style={{ textWrap: 'balance' }}
              >
                겨울 체험 및 계절 프로그램 안내
              </h2>
              <p className="text-sm leading-relaxed text-[#5A625A]">
                상시 관람 코스와 연도별 일정 확인이 필요한 계절 프로그램을 구분해 안내합니다.
              </p>
            </div>

            {/* Interactive Segmented Filter Tabs */}
            <div
              role="group"
              aria-label="프로그램 유형 필터"
              className="inline-flex items-center gap-1 self-start rounded-lg border border-[#D9DFD7] bg-white p-1"
            >
              {(
                [
                  { id: 'all', label: '전체' },
                  { id: 'permanent', label: '상시 관람' },
                  { id: 'seasonal', label: '계절 · 확인 필요' },
                ] as const
              ).map((tab) => {
                const isActive = filter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setFilter(tab.id)}
                    aria-pressed={isActive}
                    className={`min-h-[36px] rounded-md px-3.5 py-1.5 text-xs font-medium transition-colors duration-150 whitespace-nowrap shrink-0 ${
                      isActive
                        ? 'bg-[#234B38] text-white'
                        : 'text-[#303630] hover:bg-[#F5F4EF]'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-8 divide-y divide-[#D9DFD7] border-b border-[#D9DFD7]">
            {filteredExperiences.map((item) => {
              const isExpanded = selectedExpId === item.id;
              return (
                <article key={item.id} className="py-7">
                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
                    <div className="lg:col-span-5 space-y-2">
                      <div className="flex items-center gap-2 text-xs text-[#5A625A]">
                        <span className="font-medium text-[#234B38]">
                          {item.categoryLabel}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>
                          {item.verificationStatus === 'verified'
                            ? '상시 안내 확인'
                            : '공식 공지 확인 필요'}
                        </span>
                      </div>

                      <h3 className="font-serif text-xl font-semibold text-[#303630]">
                        {item.title}
                      </h3>

                      <p className="text-sm leading-relaxed text-[#5A625A]">
                        {item.summary}
                      </p>
                    </div>

                    <dl className="lg:col-span-5 grid grid-cols-2 gap-x-6 gap-y-4 rounded-lg border border-[#E7EAE6] bg-white p-5 text-xs">
                      <div>
                        <dt className="text-[#5A625A]">운영 시간</dt>
                        <dd className="mt-1 font-medium text-[#303630]">
                          {item.operatingHours}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[#5A625A]">예약 여부</dt>
                        <dd className="mt-1 font-medium text-[#303630]">
                          {item.reservationRequired}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[#5A625A]">참가비</dt>
                        <dd className="mt-1 font-medium text-[#303630]">
                          {item.fee}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[#5A625A]">연령 안내</dt>
                        <dd className="mt-1 font-medium text-[#303630]">
                          {item.ageLimit}
                        </dd>
                      </div>
                    </dl>

                    <div className="lg:col-span-2 flex lg:justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedExpId(isExpanded ? null : item.id);
                          onExperienceSelect?.(item.title);
                        }}
                        aria-expanded={isExpanded}
                        className="inline-flex min-h-[40px] items-center justify-center rounded-md border border-[#234B38] px-4 py-2 text-xs font-medium text-[#234B38] hover:bg-[#234B38] hover:text-white transition-colors whitespace-nowrap shrink-0"
                      >
                        {isExpanded ? '안내 닫기' : '확인 사항 보기'}
                      </button>
                    </div>
                  </div>

                  {isExpanded ? (
                    <div className="mt-4 flex items-start gap-2.5 rounded-md border border-[#E7EAE6] bg-white px-4 py-3 text-xs leading-relaxed text-[#303630]">
                      <AlertCircle
                        className="mt-0.5 h-4 w-4 shrink-0 text-[#234B38]"
                        aria-hidden="true"
                      />
                      <p>
                        {item.verificationStatus === 'pending_verification'
                          ? '계절 행사 및 실내 관람 프로그램의 연도별 정확한 일정, 요금, 예약 절차는 방문 직전 아침고요수목원 공식 홈페이지 공지사항에서 반드시 재확인해 주세요.'
                          : '야외 상시 산책 구간은 기상(폭설·결빙)에 따라 일부 동선이 통제될 수 있으므로 현장 안내 표지판을 함께 확인해 주세요.'}
                      </p>
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* 04. WINTER TIP INFOGRAPHIC SECTION */}
      <section
        id="winter-tip"
        aria-labelledby="winter-tip-heading"
        className="bg-white py-16 sm:py-20 lg:py-24"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-3">
            <p className="text-xs font-medium tracking-widest text-[#234B38]">
              04. Winter Tip
            </p>
            <h2
              id="winter-tip-heading"
              className="font-serif text-2xl font-semibold text-[#234B38] sm:text-3xl lg:text-4xl"
              style={{ textWrap: 'balance' }}
            >
              안전하고 따뜻한 겨울 산책 준비
            </h2>
            <p className="text-sm leading-relaxed text-[#5A625A] sm:text-base">
              산자락에 자리한 겨울 수목원은 도심보다 기온이 낮고 그늘진 길에 눈이 오래 머뭅니다. 방문 전 네 가지 준비 사항을 확인해 보세요.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {WINTER_TIPS.map((tip, index) => (
              <motion.div
                key={tip.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.35,
                  delay: index * 0.06,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="flex flex-col justify-between rounded-lg border border-[#E7EAE6] bg-[#F5F4EF]/55 p-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-[#E7EAE6] pb-4">
                    <span className="text-xs font-medium text-[#234B38] tabular-nums">
                      {tip.category}
                    </span>
                    <TipIcon iconKey={tip.iconKey} />
                  </div>

                  <h3 className="font-serif text-lg font-semibold text-[#303630]">
                    {tip.title}
                  </h3>

                  <p className="text-sm leading-relaxed text-[#5A625A]">
                    {tip.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
