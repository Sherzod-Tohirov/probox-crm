import moment from 'moment';

const sources = ['Website', 'Referral', 'Facebook', 'Instagram', 'Google Ads'];
const statuses = ['New', 'Contacted', 'Qualified', 'Lost', 'Won'];
const owners = ['Azamat', 'Sherzod', 'Dilshod', 'Malika', 'Javlon'];

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomPhone() {
  const part = () => String(rand(100, 999));
  const last = () => String(rand(10, 99));
  return `+998 ${part()} ${part()} ${last()} ${last()}`;
}

function randomDateWithinMonths(months = 2) {
  const days = months * 30;
  const offset = rand(0, days);
  return moment().subtract(offset, 'days').format('DD.MM.YYYY');
}

export const sampleLeads = Array.from({ length: 120 }).map((_, idx) => {
  const status = statuses[rand(0, statuses.length - 1)];
  const createdAt = randomDateWithinMonths(3);
  return {
    id: idx + 1,
    name: `Lead ${idx + 1}`,
    phone: randomPhone(),
    source: sources[rand(0, sources.length - 1)],
    status,
    owner: owners[rand(0, owners.length - 1)],
    createdAt,
    notes: status === 'New' ? 'Fresh lead' : 'Follow up scheduled',
  };
});
