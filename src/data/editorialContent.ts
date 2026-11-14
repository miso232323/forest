import heroWinterForestImg from '../assets/images/hero_winter_forest_1794633957396.jpg';
import gardenSnowWalkImg from '../assets/images/garden_snow_walk_1794633958348.jpg';
import gardenEvergreenPinesImg from '../assets/images/garden_evergreen_pines_1794633958687.jpg';
import gardenGreenhouseImg from '../assets/images/garden_greenhouse_botanical_1794633959236.jpg';
import gardenWinterLightsImg from '../assets/images/garden_winter_lights_1794633959077.jpg';

export type VerificationStatus = 'verified' | 'pending_verification';

export interface WinterGardenItem {
  id: string;
  figureIndex: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  alt: string;
  imageNote: string;
  scheduleLabel: string;
  verificationStatus: VerificationStatus;
  officialUrl?: string;
}

export interface ExperienceItem {
  id: string;
  category: 'permanent' | 'seasonal';
  categoryLabel: string;
  title: string;
  summary: string;
  operatingHours: string;
  reservationRequired: string;
  fee: string;
  ageLimit: string;
  verificationStatus: VerificationStatus;
}

export interface WinterTipItem {
  id: string;
  category: string;
  title: string;
  description: string;
  iconKey: 'footprints' | 'layers' | 'sparkles' | 'battery';
}

export interface VisitInfoRow {
  id: string;
  label: string;
  value: string;
  note?: string;
  verificationStatus: VerificationStatus;
}

export const SITE_BRAND = {
  name: '숲길 따라',
  subtitle: '아침고요수목원 겨울 여행 가이드',
  tagline: '겨울, 자연을 가장 가까이 만나는 시간. 숲길 따라.',
  officialUrl: 'https://www.morningcalm.co.kr',
  lastPolicyReview: '2026. 11. 14 기준 · 방문 전 공식 공지 확인 권장',
} as const;

export const HERO_CONTENT = {
  eyebrow: 'Natural Editorial · Winter Edition',
  headlineLines: ['겨울이', '머무는 숲으로'],
  bodyLines: [
    '하얀 눈 아래 숨 쉬는 자연,',
    '그리고 우리만의 겨울 산책.',
    '계절이 빚어낸 정원에서',
    '겨울만의 특별한 순간을 발견하세요.',
  ],
  subQuote: '하얀 겨울 숲에서 만나는 초록의 생명력. 오늘은 자연의 속도에 맞춰 걸어보세요.',
  primaryCta: '겨울 숲 여행 시작하기',
  secondaryCta: '방문 정보 보기',
  image: heroWinterForestImg,
  alt: '눈이 소복이 쌓인 겨울 아침고요수목원 스타일의 소나무 숲길과 정자 산책로 연출 이미지',
} as const;

export const ABOUT_CONTENT = {
  sectionLabel: '01. About',
  titleLines: ['고즈넉한 겨울', '산자락에 펼쳐진 정원의 시간'],
  lead: '아침고요수목원은 경기도 가평 축령산 자락에 자리한 원예 수목원으로, 한국의 자연미와 사계절의 식생을 정원 예술로 담아내는 공간입니다.',
  paragraphs: [
    '잎을 비운 겨울 정원은 여름의 화려함과는 또 다른 여백의 미학을 보여줍니다. 눈이 내린 산책로를 따라 걸으며 고요한 침엽수림과 정갈한 전통 정원의 선을 천천히 감상할 수 있습니다.',
    '본 가이드는 계절의 아름다움을 온전히 누릴 수 있도록 겨울 관람 동선, 방한 준비 정보, 그리고 방문객을 위한 계절 생태 이야기를 한곳에 정갈하게 담았습니다.',
  ],
  pullQuoteLines: ['겨울, 자연을 가까이 만나는 시간.', '숲길 따라.'],
  policyNotice: '입장 정책 안내: 반려동물 동반 입장 가능 여부 및 세부 시설 운영 기준은 방문 전 수목원 공식 홈페이지를 통해 반드시 확인해 주세요.',
} as const;

export const WINTER_GARDEN_ITEMS: WinterGardenItem[] = [
  {
    id: 'snow-walk',
    figureIndex: 'Fig. 01',
    title: '겨울 정원 산책',
    subtitle: '하얀 설경과 고요한 산책로',
    description: '눈 덮인 나무 다리와 곡선형 정원 길을 따라 걸으며 겨울 산자락 특유의 적막하고 맑은 공기를 만날 수 있는 상시 산책 구간입니다.',
    image: gardenSnowWalkImg,
    alt: '눈이 쌓인 정원 목조 다리와 겨울 산책로 연출 이미지',
    imageNote: '연출 예시 이미지 · 실제 현장 사진으로 교체 예정',
    scheduleLabel: '상시 관람 · 일몰 전 산책 권장',
    verificationStatus: 'verified',
    officialUrl: 'https://www.morningcalm.co.kr',
  },
  {
    id: 'evergreen-pines',
    figureIndex: 'Fig. 02',
    title: '겨울에도 푸른 상록수와 침엽수',
    subtitle: '흰 눈과 대비되는 짙은 초록의 숲',
    description: '소나무, 전나무, 잣나무 등 사계절 푸름을 지키는 침엽수림이 흰 눈과 어우러져 겨울 수목원만의 선명한 색채 대비를 이룹니다.',
    image: gardenEvergreenPinesImg,
    alt: '눈을 이고 선 짙은 녹색 침엽수림과 겨울 산맥 연출 이미지',
    imageNote: '연출 예시 이미지 · 실제 현장 사진으로 교체 예정',
    scheduleLabel: '상시 관람 · 수목원 야외 산책 구간',
    verificationStatus: 'verified',
    officialUrl: 'https://www.morningcalm.co.kr',
  },
  {
    id: 'winter-greenhouse',
    figureIndex: 'Fig. 03',
    title: '온실 및 실내 식물 관람',
    subtitle: '차가운 겨울 공기 속 따뜻한 초록의 쉼터',
    description: '야외 산책 중 추위를 녹이며 동백과 양치식물 등 실내 식물을 가까이에서 관찰할 수 있는 실내 관람 공간입니다.',
    image: gardenGreenhouseImg,
    alt: '바깥 눈 풍경과 대비되는 온실 내부의 푸른 식물과 동백꽃 연출 이미지',
    imageNote: '연출 예시 이미지 · 실제 온실 운영 여부는 공식 공지 확인 필요',
    scheduleLabel: '운영 여부 및 개방 시간 · 공식 공지 확인 필요',
    verificationStatus: 'pending_verification',
    officialUrl: 'https://www.morningcalm.co.kr',
  },
  {
    id: 'winter-light-festival',
    figureIndex: 'Fig. 04',
    title: '오색별빛정원전 (겨울 시즌 행사)',
    subtitle: '해 질 녘 정원을 밝히는 겨울 야간 정원',
    description: '매년 겨울 시즌에 맞춰 정원 곳곳의 수목과 산책로에 조명이 더해지는 야간 정원 행사입니다. 해당 연도 점등 일정 확인 후 방문하세요.',
    image: gardenWinterLightsImg,
    alt: '눈 덮인 소나무 가지마다 따뜻한 별빛 조명이 켜진 겨울 야간 정원 연출 이미지',
    imageNote: '연출 예시 이미지 · 해당 연도 행사 일정 공식 확인 필요',
    scheduleLabel: '연도별 행사 기간 및 점등 시간 · 공식 공지 확인 필요',
    verificationStatus: 'pending_verification',
    officialUrl: 'https://www.morningcalm.co.kr',
  },
];

export const EXPERIENCE_ITEMS: ExperienceItem[] = [
  {
    id: 'exp-winter-trail',
    category: 'permanent',
    categoryLabel: '상시 관람',
    title: '겨울 상록수림 자유 산책 코스',
    summary: '정문에서 주요 침엽수 정원 구간까지 천천히 걸으며 설경과 수형을 감상하는 상시 산책 동선입니다.',
    operatingHours: '정규 개장 시간 내 상시 (계절별 마감 시간 상이)',
    reservationRequired: '별도 예약 불필요 (현장 입장)',
    fee: '수목원 입장권에 포함',
    ageLimit: '전 연령 (미끄럼 주의)',
    verificationStatus: 'verified',
  },
  {
    id: 'exp-night-garden',
    category: 'seasonal',
    categoryLabel: '겨울 시즌 행사',
    title: '오색별빛정원전 야간 관람',
    summary: '일몰 이후 정원 전역에 조명이 점등되는 겨울 대표 시즌 프로그램입니다. 정확한 개최 기간과 점등 시각은 매년 공식 공지로 확정됩니다.',
    operatingHours: '공식 공지 확인 필요',
    reservationRequired: '공식 공지 확인 필요',
    fee: '공식 공지 확인 필요',
    ageLimit: '제한 없음 (동절기 방한 필수)',
    verificationStatus: 'pending_verification',
  },
  {
    id: 'exp-indoor-botanical',
    category: 'seasonal',
    categoryLabel: '실내 관람 · 확인 필요',
    title: '겨울 온실 식물 관찰 프로그램',
    summary: '동절기 실내 온실 및 전시관 개방 현황과 연계 체험 프로그램 운영 여부는 기상 및 수목원 내부 일정에 따라 달라집니다.',
    operatingHours: '공식 공지 확인 필요',
    reservationRequired: '공식 공지 확인 필요',
    fee: '공식 공지 확인 필요',
    ageLimit: '공식 공지 확인 필요',
    verificationStatus: 'pending_verification',
  },
];

export const WINTER_TIPS: WinterTipItem[] = [
  {
    id: 'tip-shoes',
    category: '01 · 신발',
    title: '미끄럼 방지 신발 착용',
    description: '눈과 얼음에 대비해 접지력이 좋은 미끄럼 방지 신발을 착용하세요.',
    iconKey: 'footprints',
  },
  {
    id: 'tip-warmth',
    category: '02 · 보온',
    title: '체온 유지를 위한 겹쳐 입기',
    description: '내복, 니트, 방풍 외투를 겹쳐 입어 체온을 유지하세요.',
    iconKey: 'layers',
  },
  {
    id: 'tip-accessories',
    category: '03 · 방한 소품',
    title: '노출 부위 보온 소품 챙기기',
    description: '장갑, 목도리, 귀마개 등으로 노출 부위를 보호하세요.',
    iconKey: 'sparkles',
  },
  {
    id: 'tip-battery',
    category: '04 · 촬영 준비',
    title: '보조배터리 사전 준비',
    description: '추운 날씨에는 배터리가 빨리 소모될 수 있으니 보조배터리를 준비하세요.',
    iconKey: 'battery',
  },
];

export const ECO_STORY_CONTENT = {
  sectionLabel: '05. Eco Story',
  title: '겨울 숲의 생태 이야기',
  subtitle: '멈춘 듯 보이지만 조용히 다음 계절을 준비하는 숲의 호흡',
  body: '겨울 숲은 멈춰 있는 공간이 아닙니다. 소나무와 상록수는 추운 계절에도 잎을 유지하며 광합성을 이어가고, 낙엽수는 휴면 상태로 에너지를 아낍니다. 눈과 서리는 식물과 숲의 풍경을 바꾸고, 겨울 숲은 계절마다 다른 생태의 모습을 보여줍니다. 방풍·보온 외투와 장갑, 목도리, 미끄럼 방지 신발을 준비해 안전하고 따뜻한 산책을 즐겨보세요.',
  marginNotes: [
    {
      term: '상록 침엽수의 월동',
      detail: '바늘 모양의 좁은 잎과 두꺼운 큐티클층은 수분 손실을 줄여 영하의 기온에서도 잎을 유지할 수 있게 돕습니다.',
    },
    {
      term: '낙엽수의 휴면 전략',
      detail: '가을에 잎을 떨어뜨려 증산 작용과 동해를 예방하고, 겨울눈(동아) 속에 봄을 위한 생장 에너지를 보존합니다.',
    },
  ],
} as const;

export const VISIT_INFO_ROWS: VisitInfoRow[] = [
  {
    id: 'address',
    label: '주소',
    value: '경기도 가평군 상면 수목원로 432 (아침고요수목원)',
    note: '방문 전 내비게이션 및 공식 안내 확인',
    verificationStatus: 'verified',
  },
  {
    id: 'transport',
    label: '대중교통 · 자가용',
    value: '경춘선 청평역 하차 후 가평 시티투어버스 또는 시내버스 이용 · 자가용 이용 시 수목원 방면 지방도 진입',
    note: '동절기 도로 결빙 및 버스 배차 시간은 사전 확인 권장',
    verificationStatus: 'pending_verification',
  },
  {
    id: 'hours',
    label: '운영 시간',
    value: '공식 공지 확인 필요',
    note: '동절기 및 야간 개장 여부에 따라 마감 시각 변동',
    verificationStatus: 'pending_verification',
  },
  {
    id: 'admission',
    label: '입장료',
    value: '공식 공지 확인 필요',
    note: '성인·청소년·어린이 및 우대 요금은 공식 홈페이지 최신 기준 적용',
    verificationStatus: 'pending_verification',
  },
  {
    id: 'parking',
    label: '주차 정보',
    value: '수목원 방문객 전용 주차장 운영 (세부 요금·혼잡 시간대 안내 확인 필요)',
    verificationStatus: 'pending_verification',
  },
  {
    id: 'festival-schedule',
    label: '계절 행사 일정',
    value: '공식 공지 확인 필요',
    note: '오색별빛정원전 등 겨울 시즌 행사 일정 확인 후 게시 예정',
    verificationStatus: 'pending_verification',
  },
  {
    id: 'contact',
    label: '공식 홈페이지 · 문의',
    value: 'https://www.morningcalm.co.kr',
    note: '운영 시간·요금·행사 일정은 방문 전 공식 공지를 반드시 확인해 주세요.',
    verificationStatus: 'verified',
  },
];

export const COUPON_POLICY_CONFIG = {
  partnershipApproved: false,
  benefitTitle: '아침고요수목원 카페 음료 50% 할인',
  partnershipNotice:
    '중요 안내: 본 카페 음료 50% 할인 혜택은 수목원 및 카페 운영 주체의 공식 승인과 세부 이용 조건(대상 음료·유효기간·정산) 확정 전까지 “제휴 승인 및 운영 조건 확인 필요” 상태입니다. 현재 화면에서는 인증 신청 및 쿠폰 발급 UI 플로우를 사전에 체험·검토할 수 있습니다.',
  privacySummary: {
    purpose: '겨울 방문 인증 이벤트 참여 여부 확인 및 중복 참여 방지',
    items: '식별 정보(이메일 또는 휴대전화), 입장권 사진, 현장 방문 사진, (선택) 방문자 포함 사진',
    retention: '이벤트 운영 및 쿠폰 검증 완료 후 보관 기한 경과 시 원본 사진 즉시 파기 (쿠폰 발급·사용 이력과 분리 보관)',
    securityNotice: '얼굴 인식 및 생체정보 기반 식별은 사용하지 않으며, 제출된 사진은 비공개 저장소에 안전하게 격리 보관됩니다.',
  },
} as const;
