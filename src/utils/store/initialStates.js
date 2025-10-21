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
  source: '',
  branch: [],
  operator: [],
  operator2: [],
  meetingDateStart: '',
  meetingDateEnd: '',
  enableMeetingDateFilter: false,
};
