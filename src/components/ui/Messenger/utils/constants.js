import {
  UserPlus,
  PenSquare,
  RefreshCcw,
  Users,
  FileEdit,
  Phone,
  PhoneCall,
  PhoneMissed,
  PhoneOff,
  CircleSlash,
  StickyNote,
} from 'lucide-react';

export const ACTION_META = {
  lead_created: { label: 'Lead yaratildi', color: '#22c55e', icon: UserPlus },
  lead_updated: { label: 'Lead yangilandi', color: '#3b82f6', icon: PenSquare },
  status_changed: {
    label: "Status o'zgardi",
    color: '#f59e0b',
    icon: RefreshCcw,
  },
  operator_changed: {
    label: "Operator o'zgardi",
    color: '#0ea5e9',
    icon: Users,
  },
  field_changed: { label: "Maydon o'zgardi", color: '#8b5cf6', icon: FileEdit },
  call_started: {
    label: "Qo'ng'iroq boshlandi",
    color: '#06b6d4',
    icon: Phone,
  },
  call_answered: {
    label: "Qo'ng'iroq qabul qilindi",
    color: '#16a34a',
    icon: PhoneCall,
  },
  call_no_answer: {
    label: "Qo'ng'iroqqa javob berilmadi",
    color: '#f97316',
    icon: PhoneMissed,
  },
  call_missed: {
    label: "O'tkazib yuborilgan qo'ng'iroq",
    color: '#ef4444',
    icon: PhoneMissed,
  },
  call_ended: {
    label: "Qo'ng'iroq yakunlandi",
    color: '#64748b',
    icon: PhoneOff,
  },
  auto_closed: {
    label: 'Tizim avtomatik yopdi',
    color: '#a855f7',
    icon: CircleSlash,
  },
  auto_ignored: {
    label: 'Tizim avtomatik e\u2019tiborsiz qoldirdi',
    color: '#94a3b8',
    icon: CircleSlash,
  },
  note: { label: 'Eslatma', color: '#14b8a6', icon: StickyNote },
};

export const FIELD_LABELS = {
  // Mijoz
  clientName: 'Mijoz ismi',
  clientFullName: 'Mijoz F.I.O',
  clientPhone: 'Mijoz telefoni',
  clientPhone2: 'Telefon 2',
  client_phone: 'Mijoz telefoni',
  phone: 'Telefon',
  birthDate: "Tug'ilgan sana",
  age: 'Yosh',
  jshshir: 'JSHSHIR',
  passportId: 'Passport ID',
  passport: 'Passport',
  // Manzil
  region: 'Viloyat',
  district: 'Tuman',
  neighborhood: 'Mahalla',
  street: "Ko'cha",
  house: 'Uy raqami',
  address: 'Manzil',
  address2: "Qo'shimcha manzil",
  // Status va operator
  status: 'Status',
  operator: 'Operator',
  operator2: 'Operator 2',
  slpCode: 'Operator',
  SlpCode: 'Operator',
  operatorId: 'Operator',
  operatorFrom: 'Avvalgi operator',
  operatorTo: 'Yangi operator',
  seller: 'Sotuvchi',
  scoring: 'Skoring',
  source: 'Manba',
  branch: 'Filial',
  branchId: 'Filial',
  branch2: 'Filial (2)',
  isBlocked: 'Bloklanganmi',
  seen: "Ko'rildimi",
  recallDate: 'Qayta aloqa vaqti',
  // Operator1
  called: "Qo'ng'iroq qilindimi",
  answered: 'Javob berdi',
  interested: 'Qiziqdimi',
  callCount: "Qo'ng'iroqlar soni",
  noAnswerCount: "Javob berilmagan qo'ng'iroqlar",
  rejectionReason: 'Rad etish sababi',
  meetingDate: 'Uchrashuv sanasi',
  meetingHappened: "Uchrashuv bo'ldimi",
  // Operator2
  called2: "Qo'ng'iroq qilindimi (2)",
  answered2: 'Javob berildimi (2)',
  callCount2: "Qo'ng'iroqlar soni (2)",
  rejectionReason2: 'Rad etish sababi (2)',
  paymentInterest: "To'lov turi",
  // Scoring
  applicationDate: 'Ariza sanasi',
  score: 'Ball (score)',
  katm: 'KATM',
  katmPayment: "KATM to'lov",
  paymentHistory: "To'lov tarixi",
  officialSalary: 'Rasmiy oylik',
  mib: 'MIB',
  mibIrresponsible: "MIB mas'uliyatsiz",
  aliment: 'Aliment',
  finalLimit: 'Yakuniy limit',
  finalPercentage: 'Yakuniy foiz',
  acceptedReason: 'Qabul qilingan sabab',
  // Seller
  meetingConfirmed: 'Uchrashuv tasdiqlandimi',
  meetingConfirmedDate: 'Uchrashuv tasdiqlangan sana',
  saleType: 'Savdo turi',
  purchase: 'Xarid amalga oshdimi',
  purchaseDate: 'Xarid sanasi',
  firstPayment: "Boshlang'ich to'lov",
  monthlyPayment: "Oylik to'lov",
  installmentMonths: "To'lov muddati",
  // Qo'ng'iroq
  callTime: "Qo'ng'iroq vaqti",
  call_time: "Qo'ng'iroq vaqti",
  'call time': "Qo'ng'iroq vaqti",
  callDuration: "Qo'ng'iroq davomiyligi",
  call_duration: "Qo'ng'iroq davomiyligi",
  duration: 'Davomiyligi',
  accountcode: "Qo'ng'iroq turi",
  direction: "Yo'nalish",
  operator_ext: 'Operator raqami',
  // Boshqa
  scoringResult: 'Skoring natija',
  isDeleted: "O'chirilganmi",
  isSystem: 'Tizimmi',
  note: 'Eslatma',
  comment: 'Izoh',
  comments: 'Izoh',
  closed: 'Sifatsiz',
  visit: 'Tashrif',
  newTime: "Yangi o'zgarish vaqti",
  consideringBumped: "O'ylab ko'rish",
  consideringBumpedReason: "O'ylab ko'rish sababi",
  recallBumpedAt: "Ro'yxatda ko'tarilgan sanasi",
};

export const STATUS_LABELS = {
  Active: 'Yangi lead',
  Blocked: 'Bloklangan',
  Purchased: 'Xarid qildi',
  Returned: 'Qaytarildi',
  Missed: "O'tkazib yuborildi",
  Ignored: "E'tiborsiz",
  NoAnswer: 'Javob bermadi',
  FollowUp: "Qayta a'loqa",
  Considering: "O'ylab ko'radi",
  WillVisitStore: "Do'konga boradi",
  WillSendPassport: 'Passport yuboradi',
  Scoring: 'Skoring',
  ScoringResult: 'Skoring natija',
  VisitedStore: "Do'konga keldi",
  NoPurchase: "Xarid bo'lmadi",
  Closed: 'Sifatsiz',
};

// Sana maydonlari (DD.MM.YYYY formatda ko'rsatiladi)
export const DATE_FIELDS = new Set([
  'birthDate',
  'applicationDate',
  'meetingConfirmedDate',
  'purchaseDate',
]);

// Sana + vaqt maydonlari (DD.MM.YYYY HH:mm formatda ko'rsatiladi)
export const DATETIME_FIELDS = new Set([
  'callTime',
  'call_time',
  'meetingDate',
  'recallDate',
  'created_at',
  'createdAt',
  'updated_at',
  'updatedAt',
  'newTime',
  'recallBumpedAt',
]);

// Pul maydonlari (1,000,000 formatda ko'rsatiladi)
export const CURRENCY_FIELDS = new Set([
  'katmPayment',
  'officialSalary',
  'mib',
  'aliment',
  'finalLimit',
  'firstPayment',
  'monthlyPayment',
]);

// Operator kod maydonlari (executor ismiga almashtiriladi)
export const OPERATOR_FIELDS = new Set([
  'slpcode',
  'seller',
  'operator',
  'operatorfrom',
  'operatorto',
  'operatorid',
  'operator2',
  'scoring',
]);

export const MESSAGE_VARIANTS = {
  hidden: { opacity: 0, y: 18, scale: 0.98 },
  visible: (index = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'tween',
      duration: 0.28,
      delay: Math.min(Math.max(index, 0), 10) * 0.07,
    },
  }),
  exit: {
    opacity: 0,
    y: -12,
    scale: 0.98,
    transition: { type: 'tween', duration: 0.18 },
  },
};
