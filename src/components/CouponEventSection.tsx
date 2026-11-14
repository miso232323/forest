import { useState, type ChangeEvent, type FormEvent } from 'react';
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  FileCheck2,
  Lock,
  RotateCcw,
  Ticket,
  Upload,
  XCircle,
} from 'lucide-react';
import { COUPON_POLICY_CONFIG } from '../data/editorialContent';

type CouponScreenState =
  | 'before_apply'
  | 'auth'
  | 'upload'
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'already_participated'
  | 'redeemed'
  | 'expired';

interface UploadedPhotoState {
  fileName: string;
  sizeKb: number;
  mimeType: string;
  previewUrl: string;
  sha256Short: string;
}

const MAX_FILE_BYTES = 10 * 1024 * 1024;
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

async function computeFileSha256Short(file: File): Promise<string> {
  if (typeof window === 'undefined' || !window.crypto?.subtle) {
    return `${file.size.toString(16)}-${Date.now().toString(16)}`;
  }
  const buffer = await file.arrayBuffer();
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const fullHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  return fullHex.slice(0, 16);
}

function generateCryptoCouponCode(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = new Uint8Array(8);
  if (typeof window !== 'undefined' && window.crypto?.getRandomValues) {
    window.crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < bytes.length; i += 1) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }
  const chars = Array.from(bytes, (b) => alphabet[b % alphabet.length]);
  return `MCW-${chars.slice(0, 4).join('')}-${chars.slice(4, 8).join('')}`;
}

const STATE_PREVIEW_OPTIONS: Array<{
  id: CouponScreenState;
  label: string;
}> = [
  { id: 'before_apply', label: '신청 전' },
  { id: 'pending', label: '검토 중' },
  { id: 'approved', label: '승인·발급' },
  { id: 'rejected', label: '반려' },
  { id: 'already_participated', label: '이미 참여' },
  { id: 'redeemed', label: '사용 완료' },
  { id: 'expired', label: '기간 만료' },
];

export function CouponEventSection() {
  const [screenState, setScreenState] =
    useState<CouponScreenState>('before_apply');

  // Step 1: User identification state
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  const [identifierInput, setIdentifierInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [verifiedIdentifier, setVerifiedIdentifier] = useState<string>(
    'winter.guest@example.com'
  );

  // Step 2: Photo uploads & consent state
  const [ticketPhoto, setTicketPhoto] = useState<UploadedPhotoState | null>(
    null
  );
  const [visitPhoto, setVisitPhoto] = useState<UploadedPhotoState | null>(null);
  const [personPhoto, setPersonPhoto] = useState<UploadedPhotoState | null>(
    null
  );
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [policyAgreed, setPolicyAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Result / Coupon states
  const [submittedAt, setSubmittedAt] = useState<string>('2026. 11. 14 14:20');
  const [couponCode, setCouponCode] = useState<string>(() =>
    generateCryptoCouponCode()
  );
  const [copiedCode, setCopiedCode] = useState(false);
  const [rejectionReason, setRejectionReason] = useState<string>(
    '입장권 사진에서 방문 일자가 선명하게 확인되지 않습니다. 빛 반사가 없는 상태에서 다시 촬영해 주세요.'
  );
  const [redeemedAt, setRedeemedAt] = useState<string>('2026. 11. 14 15:05');

  const handleAuthSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = identifierInput.trim();

    if (authMethod === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmed)) {
        setAuthError('올바른 이메일 주소를 입력해 주세요.');
        return;
      }
    } else {
      const normalized = trimmed.replaceAll('-', '');
      const phoneRegex = /^01[016789]\d{7,8}$/;
      if (!phoneRegex.test(normalized)) {
        setAuthError('올바른 휴대전화 번호(예: 010-1234-5678)를 입력해 주세요.');
        return;
      }
    }

    setAuthError(null);
    setVerifiedIdentifier(trimmed);
    setScreenState('upload');
  };

  const handleFileSelection = async (
    e: ChangeEvent<HTMLInputElement>,
    slot: 'ticket' | 'visit' | 'person'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      setUploadError(
        'JPG, PNG, WEBP 형식의 이미지 파일만 업로드할 수 있습니다.'
      );
      e.target.value = '';
      return;
    }

    if (file.size > MAX_FILE_BYTES) {
      setUploadError('이미지 용량은 파일당 최대 10MB까지 업로드할 수 있습니다.');
      e.target.value = '';
      return;
    }

    const sha256Short = await computeFileSha256Short(file);
    const previewUrl = URL.createObjectURL(file);

    const payload: UploadedPhotoState = {
      fileName: file.name,
      sizeKb: Math.max(1, Math.round(file.size / 1024)),
      mimeType: file.type,
      previewUrl,
      sha256Short,
    };

    if (slot === 'ticket') {
      if (visitPhoto && visitPhoto.sha256Short === sha256Short) {
        setUploadError(
          '입장권 사진과 현장 방문 사진이 동일한 파일입니다. 서로 다른 사진을 등록해 주세요.'
        );
      }
      setTicketPhoto(payload);
    } else if (slot === 'visit') {
      if (ticketPhoto && ticketPhoto.sha256Short === sha256Short) {
        setUploadError(
          '입장권 사진과 현장 방문 사진이 동일한 파일입니다. 서로 다른 사진을 등록해 주세요.'
        );
      }
      setVisitPhoto(payload);
    } else {
      setPersonPhoto(payload);
    }
  };

  const handleSubmitVerification = (e: FormEvent) => {
    e.preventDefault();
    setUploadError(null);

    if (!ticketPhoto) {
      setUploadError('입장권 사진을 업로드해 주세요.');
      return;
    }
    if (!visitPhoto) {
      setUploadError('수목원 현장 배경이 확인되는 방문 사진을 업로드해 주세요.');
      return;
    }
    if (ticketPhoto.sha256Short === visitPhoto.sha256Short) {
      setUploadError(
        '동일한 이미지 파일(SHA-256 일치)은 중복 제출할 수 없습니다. 입장권과 현장 사진을 각각 올려주세요.'
      );
      return;
    }
    if (!privacyAgreed || !policyAgreed) {
      setUploadError(
        '개인정보 처리 안내 및 1인 1회 참여 유의사항에 모두 동의해 주세요.'
      );
      return;
    }

    setIsSubmitting(true);
    window.setTimeout(() => {
      const now = new Date();
      const formatted = `${now.getFullYear()}. ${String(
        now.getMonth() + 1
      ).padStart(2, '0')}. ${String(now.getDate()).padStart(2, '0')} ${String(
        now.getHours()
      ).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      setSubmittedAt(formatted);
      setCouponCode(generateCryptoCouponCode());
      setIsSubmitting(false);
      setScreenState('pending');
    }, 350);
  };

  const handleCopyCouponCode = async () => {
    try {
      await navigator.clipboard.writeText(couponCode);
      setCopiedCode(true);
      window.setTimeout(() => setCopiedCode(false), 2000);
    } catch {
      setCopiedCode(false);
    }
  };

  const handleResetFlow = () => {
    setTicketPhoto(null);
    setVisitPhoto(null);
    setPersonPhoto(null);
    setPrivacyAgreed(false);
    setPolicyAgreed(false);
    setUploadError(null);
    setAuthError(null);
    setScreenState('before_apply');
  };

  return (
    <section
      id="coupon"
      aria-labelledby="coupon-heading"
      className="border-t border-[#E7EAE6] bg-white py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col gap-6 border-b border-[#E7EAE6] pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-3">
            <p className="text-xs font-bold tracking-widest text-[#234B38]">
              07. Coupon Event
            </p>
            <h2
              id="coupon-heading"
              className="font-serif text-2xl text-[#234B38] sm:text-3xl lg:text-4xl"
              style={{ textWrap: 'balance' }}
            >
              <span className="font-light">방문 인증 이벤트 · </span>
              <span className="font-bold underline decoration-[#A8BBA8] underline-offset-4">
                {COUPON_POLICY_CONFIG.benefitTitle}
              </span>
            </h2>
            <p className="text-sm font-light leading-relaxed text-[#5A625A] sm:text-base">
              입장권과 현장 방문 사진을 인증하면 카페 음료 할인 쿠폰 발급 절차를 진행할 수 있습니다. <strong className="font-semibold text-[#234B38]">계정당 1회 참여</strong>를 원칙으로 합니다.
            </p>
          </div>

          {/* Interactive State Previewer for Stakeholder Flow Inspection */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-[#5A625A]">
              인증 상태 화면 미리보기 (1단계 UI 플로우)
            </p>
            <div
              role="group"
              aria-label="인증 상태 화면 전환"
              className="flex flex-wrap gap-1 rounded-lg border border-[#E7EAE6] bg-[#F5F4EF] p-1"
            >
              {STATE_PREVIEW_OPTIONS.map((opt) => {
                const isActive =
                  screenState === opt.id ||
                  (opt.id === 'before_apply' &&
                    (screenState === 'auth' || screenState === 'upload'));
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setScreenState(opt.id)}
                    aria-pressed={isActive}
                    className={`min-h-[32px] rounded-md px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                      isActive
                        ? 'bg-[#234B38] text-white'
                        : 'text-[#303630] hover:bg-white'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Partnership & Policy Honesty Notice */}
        <div className="mt-8 flex items-start gap-3 rounded-lg border border-[#D8C5A0] bg-[#FBF7EE] p-4 sm:p-5">
          <AlertTriangle
            className="mt-0.5 h-5 w-5 shrink-0 text-[#7A5418]"
            aria-hidden="true"
          />
          <div className="space-y-1 text-xs leading-relaxed text-[#5C4315] sm:text-sm">
            <p className="font-semibold text-[#4D360E]">
              제휴 승인 및 운영 조건 확인 필요
            </p>
            <p>{COUPON_POLICY_CONFIG.partnershipNotice}</p>
          </div>
        </div>

        {/* Main Interactive Flow Workspace */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left/Main Interactive Card (7 cols) */}
          <div className="lg:col-span-7 rounded-lg border border-[#E7EAE6] bg-[#F5F4EF]/45 p-6 sm:p-8">
            {/* STATE 1: BEFORE APPLY */}
            {screenState === 'before_apply' ? (
              <div className="space-y-6">
                <div className="space-y-2">
                  <p className="text-xs font-medium text-[#234B38]">
                    참여 안내 · 1인 1회 한정
                  </p>
                  <h3 className="font-serif text-xl font-semibold text-[#303630] sm:text-2xl">
                    방문 인증하고 이벤트에 참여하기
                  </h3>
                  <p className="text-sm leading-relaxed text-[#5A625A]">
                    수목원 방문 시 발권한 입장권 사진과 현장 배경이 담긴 방문 사진을 제출해 주세요. 관리자 확인 후 고유 쿠폰 코드가 발급됩니다.
                  </p>
                </div>

                <ol className="space-y-3 border-y border-[#E7EAE6] py-5 text-sm text-[#303630]">
                  <li className="flex items-start gap-3">
                    <span className="font-mono text-xs font-medium text-[#234B38] tabular-nums pt-0.5">
                      01
                    </span>
                    <span>
                      중복 참여 방지를 위한 본인 식별 (이메일 또는 휴대전화 확인)
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="font-mono text-xs font-medium text-[#234B38] tabular-nums pt-0.5">
                      02
                    </span>
                    <span>
                      입장권 사진 및 수목원 현장 배경 방문 사진 업로드 (인물 사진은 선택)
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="font-mono text-xs font-medium text-[#234B38] tabular-nums pt-0.5">
                      03
                    </span>
                    <span>
                      중복 이미지 해시 검사 및 검토 완료 후 고유 쿠폰 발급
                    </span>
                  </li>
                </ol>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setScreenState('auth')}
                    className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-md bg-[#234B38] px-6 py-3 text-sm font-medium text-white hover:bg-[#193628] transition-colors whitespace-nowrap shrink-0"
                  >
                    <Ticket className="h-4 w-4" aria-hidden="true" />
                    <span>방문 인증하고 이벤트에 참여하기</span>
                  </button>
                </div>
              </div>
            ) : null}

            {/* STEP 1: USER IDENTIFICATION */}
            {screenState === 'auth' ? (
              <form onSubmit={handleAuthSubmit} className="space-y-6" noValidate>
                <div className="flex items-center justify-between border-b border-[#E7EAE6] pb-4">
                  <div>
                    <p className="text-xs font-medium text-[#234B38]">
                      단계 1 / 2 · 참여자 식별
                    </p>
                    <h3 className="mt-1 font-serif text-xl font-semibold text-[#303630]">
                      방문자 식별 정보 확인
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setScreenState('before_apply')}
                    className="text-xs font-medium text-[#5A625A] underline underline-offset-4 hover:text-[#303630]"
                  >
                    이전으로
                  </button>
                </div>

                <p className="text-sm leading-relaxed text-[#5A625A]">
                  1인 1회 인증 제한을 준수하고 발급된 쿠폰을 안전하게 조회하기 위해 연락처를 확인합니다.
                </p>

                <div
                  role="group"
                  aria-label="식별 수단 선택"
                  className="inline-flex rounded-md border border-[#E7EAE6] bg-white p-1"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMethod('email');
                      setAuthError(null);
                    }}
                    className={`min-h-[36px] rounded px-4 py-1.5 text-xs font-medium transition-colors ${
                      authMethod === 'email'
                        ? 'bg-[#234B38] text-white'
                        : 'text-[#303630] hover:bg-[#F5F4EF]'
                    }`}
                  >
                    이메일 확인
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMethod('phone');
                      setAuthError(null);
                    }}
                    className={`min-h-[36px] rounded px-4 py-1.5 text-xs font-medium transition-colors ${
                      authMethod === 'phone'
                        ? 'bg-[#234B38] text-white'
                        : 'text-[#303630] hover:bg-[#F5F4EF]'
                    }`}
                  >
                    휴대전화 번호
                  </button>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="visitor-identifier"
                    className="block text-xs font-medium text-[#303630]"
                  >
                    {authMethod === 'email' ? '이메일 주소' : '휴대전화 번호'}
                  </label>
                  <input
                    id="visitor-identifier"
                    type={authMethod === 'email' ? 'email' : 'tel'}
                    value={identifierInput}
                    onChange={(e) => setIdentifierInput(e.target.value)}
                    placeholder={
                      authMethod === 'email'
                        ? 'example@email.com'
                        : '010-1234-5678'
                    }
                    className="w-full min-h-[44px] rounded-md border border-[#D4DCD3] bg-white px-3.5 py-2.5 text-sm text-[#303630] placeholder:text-[#8E968E] focus:border-[#234B38]"
                    required
                  />
                  {authError ? (
                    <p role="alert" className="text-xs font-medium text-[#9A3412]">
                      {authError}
                    </p>
                  ) : null}
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="submit"
                    className="inline-flex min-h-[44px] items-center justify-center rounded-md bg-[#234B38] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#193628] transition-colors"
                  >
                    다음 단계 (사진 업로드)
                  </button>
                </div>
              </form>
            ) : null}

            {/* STEP 2: PHOTO UPLOAD & CONSENT */}
            {screenState === 'upload' ? (
              <form
                onSubmit={handleSubmitVerification}
                className="space-y-6"
                noValidate
              >
                <div className="flex items-center justify-between border-b border-[#E7EAE6] pb-4">
                  <div>
                    <p className="text-xs font-medium text-[#234B38]">
                      단계 2 / 2 · 인증 자료 제출 ({verifiedIdentifier})
                    </p>
                    <h3 className="mt-1 font-serif text-xl font-semibold text-[#303630]">
                      방문 인증 사진 등록
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setScreenState('auth')}
                    className="text-xs font-medium text-[#5A625A] underline underline-offset-4 hover:text-[#303630]"
                  >
                    식별 변경
                  </button>
                </div>

                {/* Upload Field 1: Ticket */}
                <div className="space-y-2 rounded-lg border border-[#E7EAE6] bg-white p-4">
                  <div className="flex items-center justify-between gap-2">
                    <label
                      htmlFor="upload-ticket"
                      className="text-sm font-medium text-[#303630]"
                    >
                      1. 입장권 사진 (필수)
                    </label>
                    <span className="text-xs text-[#5A625A]">
                      JPG, PNG, WEBP · 최대 10MB
                    </span>
                  </div>
                  <p className="text-xs text-[#5A625A]">
                    방문 날짜와 입장권 정보가 보이도록 촬영해 주세요.
                  </p>

                  <div className="pt-1">
                    <label
                      htmlFor="upload-ticket"
                      className="inline-flex min-h-[40px] cursor-pointer items-center gap-2 rounded-md border border-[#234B38] bg-white px-4 py-2 text-xs font-medium text-[#234B38] hover:bg-[#F5F4EF] transition-colors"
                    >
                      <Upload className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>
                        {ticketPhoto ? '입장권 사진 변경' : '입장권 사진 선택'}
                      </span>
                    </label>
                    <input
                      id="upload-ticket"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={(e) => handleFileSelection(e, 'ticket')}
                      className="sr-only"
                    />
                  </div>

                  {ticketPhoto ? (
                    <div className="mt-3 flex items-center gap-3 rounded-md border border-[#E7EAE6] bg-[#F5F4EF]/60 p-2.5">
                      <img
                        src={ticketPhoto.previewUrl}
                        alt="업로드된 입장권 미리보기"
                        className="h-14 w-14 shrink-0 rounded object-cover border border-[#E7EAE6]"
                      />
                      <div className="min-w-0 flex-1 text-xs">
                        <p className="truncate font-medium text-[#303630]">
                          {ticketPhoto.fileName}
                        </p>
                        <p className="mt-0.5 text-[#5A625A] tabular-nums">
                          {ticketPhoto.sizeKb} KB · SHA-256: {ticketPhoto.sha256Short}…
                        </p>
                      </div>
                    </div>
                  ) : null}
                </div>

                {/* Upload Field 2: Visit Site Photo */}
                <div className="space-y-2 rounded-lg border border-[#E7EAE6] bg-white p-4">
                  <div className="flex items-center justify-between gap-2">
                    <label
                      htmlFor="upload-visit"
                      className="text-sm font-medium text-[#303630]"
                    >
                      2. 현장 배경 방문 사진 (필수)
                    </label>
                    <span className="text-xs text-[#5A625A]">
                      JPG, PNG, WEBP · 최대 10MB
                    </span>
                  </div>
                  <p className="text-xs text-[#5A625A]">
                    아침고요수목원의 겨울 정원 또는 숲길 배경이 확인되는 사진을 올려주세요.
                  </p>

                  <div className="pt-1">
                    <label
                      htmlFor="upload-visit"
                      className="inline-flex min-h-[40px] cursor-pointer items-center gap-2 rounded-md border border-[#234B38] bg-white px-4 py-2 text-xs font-medium text-[#234B38] hover:bg-[#F5F4EF] transition-colors"
                    >
                      <Upload className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>
                        {visitPhoto ? '방문 사진 변경' : '방문 사진 선택'}
                      </span>
                    </label>
                    <input
                      id="upload-visit"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={(e) => handleFileSelection(e, 'visit')}
                      className="sr-only"
                    />
                  </div>

                  {visitPhoto ? (
                    <div className="mt-3 flex items-center gap-3 rounded-md border border-[#E7EAE6] bg-[#F5F4EF]/60 p-2.5">
                      <img
                        src={visitPhoto.previewUrl}
                        alt="업로드된 현장 방문 사진 미리보기"
                        className="h-14 w-14 shrink-0 rounded object-cover border border-[#E7EAE6]"
                      />
                      <div className="min-w-0 flex-1 text-xs">
                        <p className="truncate font-medium text-[#303630]">
                          {visitPhoto.fileName}
                        </p>
                        <p className="mt-0.5 text-[#5A625A] tabular-nums">
                          {visitPhoto.sizeKb} KB · SHA-256: {visitPhoto.sha256Short}…
                        </p>
                      </div>
                    </div>
                  ) : null}
                </div>

                {/* Upload Field 3: Optional Person Photo */}
                <div className="space-y-2 rounded-lg border border-[#E7EAE6] bg-white p-4">
                  <div className="flex items-center justify-between gap-2">
                    <label
                      htmlFor="upload-person"
                      className="text-sm font-medium text-[#303630]"
                    >
                      3. 방문자 본인 포함 사진 (선택)
                    </label>
                    <span className="text-xs text-[#5A625A]">선택 제출</span>
                  </div>
                  <p className="text-xs text-[#5A625A]">
                    필요한 경우에만 선택 제출할 수 있으며, 얼굴 인식 및 생체정보 식별은 일절 사용하지 않습니다.
                  </p>

                  <div className="pt-1">
                    <label
                      htmlFor="upload-person"
                      className="inline-flex min-h-[40px] cursor-pointer items-center gap-2 rounded-md border border-[#D4DCD3] bg-white px-4 py-2 text-xs font-medium text-[#303630] hover:bg-[#F5F4EF] transition-colors"
                    >
                      <Upload className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>
                        {personPhoto ? '선택 사진 변경' : '선택 사진 첨부'}
                      </span>
                    </label>
                    <input
                      id="upload-person"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={(e) => handleFileSelection(e, 'person')}
                      className="sr-only"
                    />
                  </div>

                  {personPhoto ? (
                    <div className="mt-3 flex items-center gap-3 rounded-md border border-[#E7EAE6] bg-[#F5F4EF]/60 p-2.5">
                      <img
                        src={personPhoto.previewUrl}
                        alt="업로드된 선택 사진 미리보기"
                        className="h-14 w-14 shrink-0 rounded object-cover border border-[#E7EAE6]"
                      />
                      <div className="min-w-0 flex-1 text-xs">
                        <p className="truncate font-medium text-[#303630]">
                          {personPhoto.fileName}
                        </p>
                        <p className="mt-0.5 text-[#5A625A] tabular-nums">
                          {personPhoto.sizeKb} KB · SHA-256: {personPhoto.sha256Short}…
                        </p>
                      </div>
                    </div>
                  ) : null}
                </div>

                {/* Consents */}
                <div className="space-y-3 rounded-lg border border-[#E7EAE6] bg-white p-4 text-xs leading-relaxed text-[#303630]">
                  <label className="flex cursor-pointer items-start gap-2.5">
                    <input
                      type="checkbox"
                      checked={privacyAgreed}
                      onChange={(e) => setPrivacyAgreed(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-[#D4DCD3] accent-[#234B38]"
                    />
                    <span>
                      <strong>[필수]</strong> 방문 인증 및 중복 참여 확인을 위한 개인정보·사진 수집 및 보관 기간(이벤트 종료 후 파기) 안내에 동의합니다.
                    </span>
                  </label>

                  <label className="flex cursor-pointer items-start gap-2.5">
                    <input
                      type="checkbox"
                      checked={policyAgreed}
                      onChange={(e) => setPolicyAgreed(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-[#D4DCD3] accent-[#234B38]"
                    />
                    <span>
                      <strong>[필수]</strong> 계정당 1회 참여 제한, 유사 이미지 재사용 검토, 제휴 승인 확정 후 쿠폰 실사용 안내를 확인했습니다.
                    </span>
                  </label>
                </div>

                {uploadError ? (
                  <p
                    role="alert"
                    className="rounded-md border border-[#E6B8A2] bg-[#FDF4F0] px-4 py-3 text-xs font-medium text-[#9A3412]"
                  >
                    {uploadError}
                  </p>
                ) : null}

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-md bg-[#234B38] px-6 py-3 text-sm font-medium text-white hover:bg-[#193628] disabled:opacity-60 transition-colors"
                  >
                    <FileCheck2 className="h-4 w-4" aria-hidden="true" />
                    <span>
                      {isSubmitting ? '자료 확인 요청 중...' : '방문 인증 신청 제출'}
                    </span>
                  </button>
                </div>
              </form>
            ) : null}

            {/* STATE 2: PENDING */}
            {screenState === 'pending' ? (
              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <Clock
                    className="mt-1 h-6 w-6 shrink-0 text-[#234B38]"
                    aria-hidden="true"
                  />
                  <div className="space-y-1.5">
                    <p className="text-xs font-medium text-[#234B38]">
                      상태 · 검토 중
                    </p>
                    <h3 className="font-serif text-xl font-semibold text-[#303630] sm:text-2xl">
                      인증 자료를 확인하고 있어요.
                    </h3>
                    <p className="text-sm leading-relaxed text-[#5A625A]">
                      제출하신 입장권과 현장 사진의 중복 여부 및 유효성을 검토하고 있습니다. 승인 전에는 쿠폰이 발급되지 않습니다.
                    </p>
                  </div>
                </div>

                <dl className="grid grid-cols-1 gap-4 rounded-lg border border-[#E7EAE6] bg-white p-5 text-xs sm:grid-cols-2">
                  <div>
                    <dt className="text-[#5A625A]">신청 계정</dt>
                    <dd className="mt-1 font-medium text-[#303630]">
                      {verifiedIdentifier}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[#5A625A]">접수 일시</dt>
                    <dd className="mt-1 font-medium text-[#303630] tabular-nums">
                      {submittedAt}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[#5A625A]">입장권 파일 해시</dt>
                    <dd className="mt-1 font-mono text-[#303630]">
                      {ticketPhoto?.sha256Short ?? 'a94f21c08d3e71b4'}…
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[#5A625A]">현장 사진 해시</dt>
                    <dd className="mt-1 font-mono text-[#303630]">
                      {visitPhoto?.sha256Short ?? '71c309ba421e9f82'}…
                    </dd>
                  </div>
                </dl>

                <div className="space-y-2 border-t border-[#E7EAE6] pt-4">
                  <p className="text-xs font-medium text-[#5A625A]">
                    검수 결과 시뮬레이션 (다음 화면 확인)
                  </p>
                  <div className="flex flex-wrap gap-2.5">
                    <button
                      type="button"
                      onClick={() => setScreenState('approved')}
                      className="min-h-[40px] rounded-md bg-[#234B38] px-4 py-2 text-xs font-medium text-white hover:bg-[#193628]"
                    >
                      검토 승인 결과 보기
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setRejectionReason(
                          '입장권 사진에서 방문 일자가 선명하게 확인되지 않습니다. 빛 반사가 없는 상태에서 다시 촬영해 주세요.'
                        );
                        setScreenState('rejected');
                      }}
                      className="min-h-[40px] rounded-md border border-[#D4DCD3] bg-white px-4 py-2 text-xs font-medium text-[#303630] hover:bg-[#F5F4EF]"
                    >
                      검토 반려 결과 보기
                    </button>
                  </div>
                </div>
              </div>
            ) : null}

            {/* STATE 3: APPROVED (COUPON ISSUED) */}
            {screenState === 'approved' ? (
              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <CheckCircle2
                    className="mt-1 h-6 w-6 shrink-0 text-[#234B38]"
                    aria-hidden="true"
                  />
                  <div className="space-y-1.5">
                    <p className="text-xs font-medium text-[#234B38]">
                      상태 · 발급 완료 (issued)
                    </p>
                    <h3 className="font-serif text-xl font-semibold text-[#303630] sm:text-2xl">
                      방문 인증 완료! 쿠폰이 발급되었어요.
                    </h3>
                    <p className="text-sm leading-relaxed text-[#5A625A]">
                      카페에서 아래 쿠폰 화면을 제시하면 담당자 확인 후 1회 사용 처리됩니다. (실제 사용은 제휴 승인 완료 후 적용)
                    </p>
                  </div>
                </div>

                {/* Coupon Ticket Surface */}
                <div className="rounded-lg border border-[#234B38] bg-white p-6">
                  <div className="flex flex-col gap-4 border-b border-dashed border-[#D4DCD3] pb-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs font-medium text-[#234B38]">
                        {COUPON_POLICY_CONFIG.benefitTitle}
                      </p>
                      <p className="mt-1 font-mono text-2xl font-medium tracking-wider text-[#303630] tabular-nums">
                        {couponCode}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyCouponCode}
                      className="inline-flex min-h-[40px] items-center gap-1.5 self-start rounded-md border border-[#E7EAE6] bg-[#F5F4EF] px-3.5 py-2 text-xs font-medium text-[#303630] hover:bg-[#E7EAE6]"
                    >
                      {copiedCode ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-[#234B38]" aria-hidden="true" />
                          <span>코드 복사됨</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5 text-[#5A625A]" aria-hidden="true" />
                          <span>코드 복사</span>
                        </>
                      )}
                    </button>
                  </div>

                  <dl className="mt-4 grid grid-cols-2 gap-4 text-xs sm:grid-cols-3">
                    <div>
                      <dt className="text-[#5A625A]">발급 일시</dt>
                      <dd className="mt-1 font-medium text-[#303630] tabular-nums">
                        {submittedAt}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[#5A625A]">유효 기간</dt>
                      <dd className="mt-1 font-medium text-[#7A5418]">
                        제휴 조건 확정 후 적용
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[#5A625A]">쿠폰 상태</dt>
                      <dd className="mt-1 font-medium text-[#234B38]">
                        사용 가능 (issued)
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      const now = new Date();
                      setRedeemedAt(
                        `${now.getFullYear()}. ${String(
                          now.getMonth() + 1
                        ).padStart(2, '0')}. ${String(now.getDate()).padStart(
                          2,
                          '0'
                        )} ${String(now.getHours()).padStart(2, '0')}:${String(
                          now.getMinutes()
                        ).padStart(2, '0')}`
                      );
                      setScreenState('redeemed');
                    }}
                    className="min-h-[40px] rounded-md bg-[#234B38] px-4 py-2 text-xs font-medium text-white hover:bg-[#193628]"
                  >
                    직원 확인 및 사용 처리 테스트
                  </button>
                  <button
                    type="button"
                    onClick={() => setScreenState('already_participated')}
                    className="min-h-[40px] rounded-md border border-[#D4DCD3] bg-white px-4 py-2 text-xs font-medium text-[#303630] hover:bg-[#F5F4EF]"
                  >
                    중복 참여 차단 화면 보기
                  </button>
                </div>
              </div>
            ) : null}

            {/* STATE 4: REJECTED */}
            {screenState === 'rejected' ? (
              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <XCircle
                    className="mt-1 h-6 w-6 shrink-0 text-[#9A3412]"
                    aria-hidden="true"
                  />
                  <div className="space-y-1.5">
                    <p className="text-xs font-medium text-[#9A3412]">
                      상태 · 인증 반려 (rejected)
                    </p>
                    <h3 className="font-serif text-xl font-semibold text-[#303630] sm:text-2xl">
                      인증이 완료되지 않았어요. 사유를 확인해 주세요.
                    </h3>
                  </div>
                </div>

                <div className="rounded-lg border border-[#E6B8A2] bg-white p-5">
                  <p className="text-xs font-medium text-[#9A3412]">반려 사유</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-[#303630]">
                    {rejectionReason}
                  </p>
                </div>

                <p className="text-xs leading-relaxed text-[#5A625A]">
                  반려된 신청의 재제출 가능 횟수 및 조건은 운영 정책 확정 후 적용됩니다.
                </p>

                <button
                  type="button"
                  onClick={handleResetFlow}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-md border border-[#234B38] bg-white px-5 py-2.5 text-xs font-medium text-[#234B38] hover:bg-[#F5F4EF]"
                >
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>처음 화면으로 돌아가기</span>
                </button>
              </div>
            ) : null}

            {/* STATE 5: ALREADY PARTICIPATED */}
            {screenState === 'already_participated' ? (
              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <Lock
                    className="mt-1 h-6 w-6 shrink-0 text-[#234B38]"
                    aria-hidden="true"
                  />
                  <div className="space-y-1.5">
                    <p className="text-xs font-medium text-[#234B38]">
                      상태 · 중복 참여 제한
                    </p>
                    <h3 className="font-serif text-xl font-semibold text-[#303630] sm:text-2xl">
                      방문 인증 이벤트는 1회 참여할 수 있어요.
                    </h3>
                    <p className="text-sm leading-relaxed text-[#5A625A]">
                      {verifiedIdentifier} 계정으로 이미 승인되었거나 검토 중인 신청 내역이 있어 새로운 신청을 진행할 수 없습니다.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  <button
                    type="button"
                    onClick={() => setScreenState('approved')}
                    className="min-h-[40px] rounded-md bg-[#234B38] px-4 py-2 text-xs font-medium text-white hover:bg-[#193628]"
                  >
                    내 발급 쿠폰 확인
                  </button>
                  <button
                    type="button"
                    onClick={handleResetFlow}
                    className="min-h-[40px] rounded-md border border-[#D4DCD3] bg-white px-4 py-2 text-xs font-medium text-[#303630] hover:bg-[#F5F4EF]"
                  >
                    초기화
                  </button>
                </div>
              </div>
            ) : null}

            {/* STATE 6: REDEEMED */}
            {screenState === 'redeemed' ? (
              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <CheckCircle2
                    className="mt-1 h-6 w-6 shrink-0 text-[#5A625A]"
                    aria-hidden="true"
                  />
                  <div className="space-y-1.5">
                    <p className="text-xs font-medium text-[#5A625A]">
                      상태 · 사용 완료 (redeemed)
                    </p>
                    <h3 className="font-serif text-xl font-semibold text-[#303630] sm:text-2xl">
                      사용 완료된 쿠폰입니다.
                    </h3>
                    <p className="text-sm leading-relaxed text-[#5A625A]">
                      이미 카페 현장에서 혜택 적용이 완료되어 재사용할 수 없습니다.
                    </p>
                  </div>
                </div>

                <dl className="grid grid-cols-1 gap-4 rounded-lg border border-[#E7EAE6] bg-white p-5 text-xs sm:grid-cols-2">
                  <div>
                    <dt className="text-[#5A625A]">쿠폰 코드</dt>
                    <dd className="mt-1 font-mono text-[#303630] line-through">
                      {couponCode}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[#5A625A]">사용 처리 일시</dt>
                    <dd className="mt-1 font-medium text-[#303630] tabular-nums">
                      {redeemedAt}
                    </dd>
                  </div>
                </dl>

                <button
                  type="button"
                  onClick={handleResetFlow}
                  className="min-h-[40px] rounded-md border border-[#D4DCD3] bg-white px-4 py-2 text-xs font-medium text-[#303630] hover:bg-[#F5F4EF]"
                >
                  참여 플로우 초기화
                </button>
              </div>
            ) : null}

            {/* STATE 7: EXPIRED */}
            {screenState === 'expired' ? (
              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <Clock
                    className="mt-1 h-6 w-6 shrink-0 text-[#5A625A]"
                    aria-hidden="true"
                  />
                  <div className="space-y-1.5">
                    <p className="text-xs font-medium text-[#5A625A]">
                      상태 · 기간 만료 (expired)
                    </p>
                    <h3 className="font-serif text-xl font-semibold text-[#303630] sm:text-2xl">
                      쿠폰 사용 기간이 종료되었습니다.
                    </h3>
                    <p className="text-sm leading-relaxed text-[#5A625A]">
                      사용 기한이 지난 쿠폰은 만료 처리되어 현장에서 사용할 수 없습니다.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleResetFlow}
                  className="min-h-[40px] rounded-md border border-[#D4DCD3] bg-white px-4 py-2 text-xs font-medium text-[#303630] hover:bg-[#F5F4EF]"
                >
                  참여 플로우 초기화
                </button>
              </div>
            ) : null}
          </div>

          {/* Right Column: Privacy, Duplicate Protection & Policy Spec (5 cols) */}
          <aside className="lg:col-span-5 space-y-5">
            <div className="rounded-lg border border-[#E7EAE6] bg-white p-6 space-y-4">
              <h3 className="font-serif text-lg font-semibold text-[#234B38]">
                개인정보 및 부정 사용 방지 원칙
              </h3>

              <dl className="space-y-3.5 text-xs leading-relaxed">
                <div>
                  <dt className="font-semibold text-[#303630]">
                    1인 1회 인증 및 동시성 보호
                  </dt>
                  <dd className="mt-1 text-[#5A625A]">
                    계정당 승인된 방문 인증은 1회만 허용되며, 승인 또는 검토 중인 신청이 있으면 추가 신청이 제한됩니다.
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-[#303630]">
                    파일 해시 및 유사 이미지 검토
                  </dt>
                  <dd className="mt-1 text-[#5A625A]">
                    SHA-256으로 동일 파일 재업로드를 차단하고, pHash 기반 유사 이미지는 관리자 검토 대상으로 분류합니다. 얼굴 인식은 사용하지 않습니다.
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-[#303630]">
                    비공개 저장 및 분리 파기
                  </dt>
                  <dd className="mt-1 text-[#5A625A]">
                    {COUPON_POLICY_CONFIG.privacySummary.retention}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="rounded-lg border border-[#E7EAE6] bg-[#F5F4EF] p-6 space-y-3">
              <h3 className="font-serif text-base font-semibold text-[#234B38]">
                제휴처 확인 후 확정 예정 조건
              </h3>
              <ul className="space-y-1.5 text-xs leading-relaxed text-[#5A625A]">
                <li>· 할인 대상 음료 및 제외 메뉴 범위</li>
                <li>· 타 할인 중복 적용 여부 및 1인당 적용 수량</li>
                <li>· 발급 후 쿠폰 유효 기간 및 주말·공휴일 적용 여부</li>
                <li>· 카페 현장 확인 절차(코드 조회 또는 QR 검증)</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
