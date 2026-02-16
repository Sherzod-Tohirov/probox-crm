import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/ui/card';
import ReadOnlyField from '../components/ReadOnlyField';
import { statusOptions } from '@/features/leads/utils/options';
import moment from 'moment';

export default function LeadInfoCard({ lead }) {
  const statusLabel =
    statusOptions?.find((s) => s.value === lead?.status)?.label || lead?.status || '';

  const createdAt = lead?.createdAt || lead?.created_at;
  const formattedDate = createdAt
    ? moment(createdAt).format('HH:mm | DD.MM.YYYY')
    : '';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lead ma'lumotlari</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-[12px] sm:grid-cols-4">
          <ReadOnlyField label="Holat" value={lead?.isBlocked ? 'Bloklangan' : 'Ochiq'} />
          <ReadOnlyField label="Status" value={statusLabel} />
          <ReadOnlyField label="Manba" value={lead?.source} />
          <ReadOnlyField label="Yaratilgan vaqt" value={formattedDate} />
        </div>
        <div className="mt-[12px] grid grid-cols-2 gap-[12px] sm:grid-cols-4">
          <ReadOnlyField label="Operator 1" value={lead?.operator} />
          <ReadOnlyField label="Operator 2" value={lead?.operator2} />
          <ReadOnlyField label="" value="" />
          <ReadOnlyField label="Skoring" value={lead?.scoring} />
        </div>
      </CardContent>
    </Card>
  );
}
