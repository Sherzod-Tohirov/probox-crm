import moment from 'moment';

const today = moment().startOf('month').format('DD.MM.YYYY');
const endOfMonth = moment().endOf('month').format('DD.MM.YYYY');

export const initialClientsFilterState = {
  search: '',
  phone: '998',
  startDate: today,
  endDate: endOfMonth,
  paymentStatus: 'all',
  slpCode: '',
  phoneConfiscated: '',
};

export const initialStatisticsFilterState = {
  startDate: today,
  endDate: endOfMonth,
  slpCode: '',
};

export const initialLeadsFilterState = {
  search: '',
  isBlocked: '',
  status: '',
  source: [],
  branch: [],
  operator: [],
  operator2: [],
  seller: [],
  scoring: [],
  meeting: '',
  meetingDateStart: '',
  meetingDateEnd: '',
  meetingHappened: '',
  passportVisit: '',
  purchase: '',
  called: '',
  answered: '',
  interested: '',
  callCount: '',
  called2: '',
  answered2: '',
  callCount2: '',
  passportId: '',
  jshshir2: '',
  finalLimit: '',
  rejectionReason: [],
};

export const initialProductsFilterState = {
  search: '',
  condition: '',
};

export const initialPurchasesFilterState = {
  search: '',
  status: '',
  dateFrom: '',
  dateTo: '',
  category: [],
  warehouse: [],
};
