import { useState } from 'react';
import { X } from 'lucide-react';
import { COUPON_POLICY_CONFIG, SITE_BRAND } from '../data/editorialContent';

export function Footer() {
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);

  return (
    <>
      <footer className="border-t border-[#E7EAE6] bg-[#F5F4EF] py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 border-b border-[#D9DFD7] pb-8 md:flex-row md:items-start md:justify-between">
            <div className="max-w-sm space-y-2.5">
              <p className="font-serif text-xl font-semibold text-[#234B38]">
                {SITE_BRAND.name}
              </p>
              <p className="text-sm leading-relaxed text-[#5A625A]">
                {SITE_BRAND.tagline}
              </p>
              <p className="text-xs leading-relaxed text-[#5A625A]">
                본 페이지는 겨울 시즌 방문 가이드 및 방문 인증 이벤트 1단계 UI 프로토타입입니다. 실제 운영 시간·요금·제휴 혜택은 공식 확인 후 적용됩니다.
              </p>
            </div>

            <nav
              aria-label="하단 섹션 링크"
              className="grid grid-cols-2 gap-x-10 gap-y-2.5 text-sm text-[#303630] sm:grid-cols-3"
            >
              <a href="#about" className="hover:text-[#234B38] py-1">
                소개
              </a>
              <a href="#winter-garden" className="hover:text-[#234B38] py-1">
                겨울 정원
              </a>
              <a href="#experience" className="hover:text-[#234B38] py-1">
                겨울 체험
              </a>
              <a href="#winter-tip" className="hover:text-[#234B38] py-1">
                방문 팁
              </a>
              <a href="#eco-story" className="hover:text-[#234B38] py-1">
                생태 이야기
              </a>
              <a href="#visit" className="hover:text-[#234B38] py-1">
                방문 안내
              </a>
            </nav>
          </div>

          <div className="mt-6 flex flex-col gap-3 text-xs text-[#5A625A] sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1.5">
              <p>© 2026 숲길 따라 · 아침고요수목원 겨울 여행 가이드</p>
              <p className="flex flex-wrap items-center gap-x-2 gap-y-1 tabular-nums">
                <span>주소지 : 경기도 하남시 감일순환로35</span>
                <span aria-hidden="true">·</span>
                <span>
                  연락처 :{' '}
                  <a
                    href="tel:031-1234-5678"
                    className="underline decoration-[#A8BBA8] underline-offset-4 hover:text-[#234B38]"
                  >
                    031-1234-5678
                  </a>
                </span>
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4 shrink-0">
              <button
                type="button"
                onClick={() => setPrivacyModalOpen(true)}
                className="underline decoration-[#A8BBA8] underline-offset-4 hover:text-[#234B38]"
              >
                개인정보 처리 안내
              </button>
              <span aria-hidden="true">·</span>
              <a
                href={SITE_BRAND.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-[#A8BBA8] underline-offset-4 hover:text-[#234B38]"
              >
                아침고요수목원 공식 사이트
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Privacy Notice Modal */}
      {privacyModalOpen ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="privacy-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
        >
          <div className="w-full max-w-lg rounded-lg border border-[#E7EAE6] bg-white p-6 shadow-lg">
            <div className="flex items-start justify-between gap-4 border-b border-[#E7EAE6] pb-4">
              <div>
                <h2
                  id="privacy-modal-title"
                  className="font-serif text-lg font-semibold text-[#234B38]"
                >
                  방문 인증 이벤트 개인정보 처리 안내
                </h2>
                <p className="mt-1 text-xs text-[#5A625A]">
                  최종 운영 시 법무·개인정보 담당 검토를 거쳐 확정됩니다.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPrivacyModalOpen(false)}
                aria-label="안내 창 닫기"
                className="inline-flex h-10 w-10 items-center justify-center rounded-md text-[#5A625A] hover:bg-[#F5F4EF]"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <dl className="mt-4 space-y-3 text-xs leading-relaxed text-[#303630]">
              <div>
                <dt className="font-semibold text-[#234B38]">수집 목적</dt>
                <dd className="mt-0.5 text-[#5A625A]">
                  {COUPON_POLICY_CONFIG.privacySummary.purpose}
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-[#234B38]">수집 항목</dt>
                <dd className="mt-0.5 text-[#5A625A]">
                  {COUPON_POLICY_CONFIG.privacySummary.items}
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-[#234B38]">보관 및 파기</dt>
                <dd className="mt-0.5 text-[#5A625A]">
                  {COUPON_POLICY_CONFIG.privacySummary.retention}
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-[#234B38]">보호 원칙</dt>
                <dd className="mt-0.5 text-[#5A625A]">
                  {COUPON_POLICY_CONFIG.privacySummary.securityNotice}
                </dd>
              </div>
            </dl>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setPrivacyModalOpen(false)}
                className="min-h-[40px] rounded-md bg-[#234B38] px-5 py-2 text-xs font-medium text-white hover:bg-[#193628]"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
