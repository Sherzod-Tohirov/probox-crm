import { Phone } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/shadcn/ui/card';
import ReadOnlyField from '../components/ReadOnlyField';
import formatterCurrency from '@/utils/formatterCurrency';

export default function ClientInfoCard({ lead, onLimitHistoryClick }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mijoz haqida ma'lumotlar</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-[16px]">
        {/* Row 1: FIO, Phones, Birthday */}
        <div className="grid grid-cols-1 gap-[12px] sm:grid-cols-2 lg:grid-cols-4">
          <ReadOnlyField
            label="F.I.O"
            value={lead?.clientFullName || lead?.clientName}
          />
          <ReadOnlyField
            label="Telefon raqam 1"
            value={lead?.clientPhone}
            icon={<Phone size={14} />}
            copyable
          />
          <ReadOnlyField
            label="Telefon raqam 2"
            value={lead?.clientPhone2}
            icon={<Phone size={14} />}
            copyable
          />
          <ReadOnlyField label="Tug'ilgan sana" value={lead?.birthDate} />
        </div>

        {/* Row 2: Age, Passport, JSHSHIR, Limit */}
        <div className="grid grid-cols-1 gap-[12px] sm:grid-cols-2 lg:grid-cols-4">
          <ReadOnlyField
            label="Yoshi"
            value={lead?.age ? `${lead.age} yosh` : ''}
          />
          <ReadOnlyField
            label="Passport seriyasi"
            value={lead?.passportId}
            copyable
          />
          <ReadOnlyField label="JSHSHIR" value={lead?.jshshir} copyable />
          <div onClick={onLimitHistoryClick} className="cursor-pointer">
            <ReadOnlyField
              label="Yakuniy limit"
              value={
                lead?.finalLimit
                  ? `${formatterCurrency(lead.finalLimit)} uzs`
                  : ''
              }
              highlight={!!lead?.finalLimit}
            />
          </div>
        </div>

        {/* Row 3: Addresses */}
        <div className="grid grid-cols-1 gap-[12px] sm:grid-cols-2">
          <ReadOnlyField
            label="Manzil 1"
            value={
              [
                lead?.region,
                lead?.district,
                lead?.neighborhood,
                lead?.street,
                lead?.house,
              ]
                .filter(Boolean)
                .join(', ') || lead?.address
            }
          />
          <ReadOnlyField label="Manzil 2" value={lead?.address2} />
        </div>
      </CardContent>
    </Card>
  );
}
