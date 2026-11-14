import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { SITE_BRAND } from '../data/editorialContent';

const NAV_LINKS = [
  { href: '#about', label: '소개' },
  { href: '#winter-garden', label: '겨울 정원' },
  { href: '#experience', label: '겨울 체험' },
  { href: '#winter-tip', label: '방문 팁' },
  { href: '#visit', label: '방문 안내' },
] as const;

interface HeaderProps {
  onNavigate?: (sectionId: string) => void;
}

export function Header({ onNavigate }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLinkClick = (href: string) => {
    setMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(href);
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[#E7EAE6] bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-8 px-4 py-3.5 sm:px-6 lg:px-8">
        {/* Zone 1: Single-line Wordmark */}
        <a
          href="#top"
          onClick={() => handleLinkClick('#top')}
          className="font-serif text-xl font-semibold tracking-tight text-[#234B38] whitespace-nowrap shrink-0"
        >
          {SITE_BRAND.name}
        </a>

        {/* Zone 2: Concise Single-Line Desktop Nav Links */}
        <nav
          aria-label="주요 섹션 이동"
          className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-[#303630]"
        >
          {NAV_LINKS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => handleLinkClick(item.href)}
              className="relative py-1 text-[#303630] hover:text-[#234B38] transition-colors duration-150 whitespace-nowrap shrink-0 after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-[#234B38] after:transition-all after:duration-200 hover:after:w-full"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Single Primary Action + Mobile Menu Trigger */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#coupon"
            onClick={() => handleLinkClick('#coupon')}
            className="hidden sm:inline-flex min-h-[40px] items-center justify-center rounded-md bg-[#234B38] px-4 py-2 text-xs font-medium text-white hover:bg-[#193628] transition-colors duration-150 whitespace-nowrap shrink-0"
          >
            방문 인증 쿠폰
          </a>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation-drawer"
            aria-label={mobileMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
            className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-[#E7EAE6] text-[#303630] hover:bg-[#F5F4EF] transition-colors md:hidden"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Accessible Mobile Drawer */}
      {mobileMenuOpen ? (
        <nav
          id="mobile-navigation-drawer"
          aria-label="모바일 전체 메뉴"
          className="border-t border-[#E7EAE6] bg-white px-4 py-4 md:hidden"
        >
          <ul className="space-y-1">
            {NAV_LINKS.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => handleLinkClick(item.href)}
                  className="flex min-h-[44px] items-center rounded-md px-3 text-sm font-medium text-[#303630] hover:bg-[#F5F4EF] hover:text-[#234B38]"
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="#eco-story"
                onClick={() => handleLinkClick('#eco-story')}
                className="flex min-h-[44px] items-center rounded-md px-3 text-sm font-medium text-[#303630] hover:bg-[#F5F4EF] hover:text-[#234B38]"
              >
                생태 이야기
              </a>
            </li>
            <li className="pt-2">
              <a
                href="#coupon"
                onClick={() => handleLinkClick('#coupon')}
                className="flex min-h-[44px] items-center justify-center rounded-md bg-[#234B38] px-4 text-sm font-medium text-white hover:bg-[#193628]"
              >
                방문 인증 쿠폰 참여하기
              </a>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
