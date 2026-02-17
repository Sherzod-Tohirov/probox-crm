import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/shadcn/ui/card';
import { Badge } from '@/components/shadcn/ui/badge';
import formatterCurrency from '@/utils/formatterCurrency';

export default function SidebarPurchaseHistory({ invoiceScoreData }) {
  const contracts = invoiceScoreData?.contracts || [];

  if (!contracts.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Mijoz xaridlari tarixi</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="flex items-center justify-center rounded-[12px] border border-dashed py-[20px] text-[13px]"
            style={{
              borderColor: 'var(--primary-border-color)',
              color: 'var(--secondary-color)',
            }}
          >
            Xaridlar topilmadi
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mijoz xaridlari tarixi</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-[10px]">
        {contracts.map((contract, i) => {
          const isPaid =
            contract?.status === 'Closed' || contract?.status === 'Paid';
          return (
            <div
              key={contract?.id || i}
              className="flex flex-col gap-[8px] rounded-[14px] border p-[14px]"
              style={{
                borderColor: 'var(--primary-border-color)',
                backgroundColor: 'var(--primary-input-bg)',
              }}
            >
              <div className="flex items-start justify-between gap-[8px]">
                <span
                  className="flex-1 text-[13px] font-semibold leading-tight"
                  style={{ color: 'var(--primary-color)' }}
                >
                  {contract?.docNum || contract?.CardCode} - shartnoma
                </span>
                <Badge
                  className="border"
                  style={
                    isPaid
                      ? {
                          backgroundColor: 'var(--success-bg)',
                          color: 'var(--success-color)',
                          borderColor: 'var(--success-color)',
                        }
                      : {
                          backgroundColor: 'var(--warning-bg)',
                          color: 'var(--warning-color)',
                          borderColor: 'var(--warning-color)',
                        }
                  }
                >
                  {isPaid ? 'Yopilgan' : 'Faol'}
                </Badge>
              </div>

              <div
                className="flex items-center gap-[8px] text-[11px]"
                style={{ color: 'var(--secondary-color)' }}
              >
                <span>{contract?.installmentMonths || '—'} ta muddati</span>
                <span>·</span>
                <span>{contract?.docDate || '—'}</span>
                <span>·</span>
                <span>{contract?.installmentMonths || '—'} oy</span>
              </div>

              <div className="flex items-center justify-between">
                <span
                  className="text-[14px] font-bold"
                  style={{ color: 'var(--primary-color)' }}
                >
                  {contract?.totalAmount
                    ? formatterCurrency(contract.totalAmount) + ' uzs'
                    : '—'}
                </span>
                <span
                  className="text-[13px] font-medium"
                  style={{ color: 'var(--secondary-color)' }}
                >
                  {contract?.totalPaid
                    ? formatterCurrency(contract.totalPaid) + ' uzs'
                    : '—'}
                </span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
