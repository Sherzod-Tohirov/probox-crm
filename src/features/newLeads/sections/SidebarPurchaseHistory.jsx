import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/shadcn/ui/card';
import formatterCurrency from '@/utils/formatterCurrency';

const SAMPLE_CONTRACTS = [
  {
    id: 'sample-1',
    docNum: 'PB2348934',
    status: 'Active',
    itemCount: 2,
    docDate: '12.12.2025',
    installmentMonths: 6,
    totalAmount: 7800000,
    totalPaid: 5200000,
  },
  {
    id: 'sample-2',
    docNum: 'PB2348934',
    status: 'Closed',
    itemCount: 2,
    docDate: '12.06.2025',
    installmentMonths: 3,
    totalAmount: 4500000,
    totalPaid: 4500000,
  },
];

function ContractLogo() {
  return (
    <div
      className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-[10px]"
      style={{
        backgroundColor: 'var(--primary-input-bg)',
        border: '1px solid var(--primary-border-color)',
      }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 2L4 6v6c0 5.25 3.5 10.15 8 11.35C16.5 22.15 20 17.25 20 12V6l-8-4z"
          fill="var(--button-bg)"
          opacity="0.15"
        />
        <path
          d="M12 2L4 6v6c0 5.25 3.5 10.15 8 11.35C16.5 22.15 20 17.25 20 12V6l-8-4z"
          stroke="var(--button-bg)"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M9 12l2 2 4-4"
          stroke="var(--button-bg)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function StatusBadge({ isPaid, isActive }) {
  if (isPaid) {
    return (
      <span
        className="flex items-center gap-[4px] rounded-full px-[8px] py-[2px] text-[11px] font-semibold"
        style={{
          backgroundColor: 'var(--success-bg)',
          color: 'var(--success-color)',
        }}
      >
        <span
          className="h-[6px] w-[6px] rounded-full"
          style={{ backgroundColor: 'var(--success-color)' }}
        />
        Yopilgan
      </span>
    );
  }
  if (isActive) {
    return (
      <span
        className="rounded-full px-[8px] py-[2px] text-[11px] font-semibold"
        style={{
          backgroundColor: 'var(--warning-bg)',
          color: 'var(--warning-color)',
        }}
      >
        Jarayonda
      </span>
    );
  }
  return (
    <span
      className="rounded-full px-[8px] py-[2px] text-[11px] font-semibold"
      style={{
        backgroundColor: 'var(--primary-input-bg)',
        color: 'var(--secondary-color)',
      }}
    >
      Noma'lum
    </span>
  );
}

function ContractCard({ contract, isSample }) {
  const isPaid = contract?.status === 'Closed' || contract?.status === 'Paid';
  const isActive = !isPaid;
  const paidRatio =
    contract?.totalAmount > 0
      ? Math.min(contract.totalPaid / contract.totalAmount, 1)
      : 0;
  const paidPercent = Math.round(paidRatio * 100);

  return (
    <div
      className="flex flex-col gap-[10px] rounded-[14px] border p-[12px]"
      style={{
        borderColor: 'var(--primary-border-color)',
        backgroundColor: 'var(--primary-input-bg)',
        opacity: isSample ? 0.6 : 1,
      }}
    >
      {/* Header row */}
      <div className="flex items-center gap-[10px]">
        <ContractLogo />
        <div className="flex min-w-0 flex-1 flex-col gap-[2px]">
          <div className="flex items-center justify-between gap-[6px]">
            <span
              className="truncate text-[13px] font-semibold"
              style={{ color: 'var(--primary-color)' }}
            >
              {contract?.docNum || contract?.CardCode} - shartnoma
            </span>
            <StatusBadge isPaid={isPaid} isActive={isActive} />
          </div>

          {/* Meta row */}
          <div
            className="flex flex-wrap items-center gap-x-[8px] gap-y-[2px] text-[11px]"
            style={{ color: 'var(--secondary-color)' }}
          >
            {contract?.itemCount != null && (
              <span className="flex items-center gap-[3px]">
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="2" y="3" width="20" height="14" rx="2" />
                  <path d="M8 21h8M12 17v4" />
                </svg>
                {contract.itemCount} ta mahsulot
              </span>
            )}
            {contract?.docDate && (
              <span className="flex items-center gap-[3px]">
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
                {contract.docDate}
              </span>
            )}
            {contract?.installmentMonths != null && (
              <span className="flex items-center gap-[3px]">
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
                {contract.installmentMonths} oy
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="flex flex-col gap-[4px]">
        <div
          className="h-[6px] w-full overflow-hidden rounded-full"
          style={{ backgroundColor: 'var(--primary-border-color)' }}
        >
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${paidPercent}%`,
              backgroundColor: isPaid
                ? 'var(--success-color)'
                : 'var(--button-bg)',
            }}
          />
        </div>
      </div>

      {/* Amounts row */}
      <div className="flex items-center justify-between">
        <span
          className="text-[13px] font-bold"
          style={{
            color: isPaid ? 'var(--success-color)' : 'var(--button-bg)',
          }}
        >
          {contract?.totalPaid != null
            ? formatterCurrency(contract.totalPaid) + ' uzs'
            : '—'}
        </span>
        <span
          className="text-[12px] font-medium"
          style={{ color: 'var(--secondary-color)' }}
        >
          {contract?.totalAmount != null
            ? formatterCurrency(contract.totalAmount) + ' uzs'
            : '—'}
        </span>
      </div>
    </div>
  );
}

export default function SidebarPurchaseHistory({ invoiceScoreData }) {
  const contracts = invoiceScoreData?.contracts || [];
  const displayContracts = contracts.length ? contracts : SAMPLE_CONTRACTS;
  const isSample = contracts.length === 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Mijoz xaridlari tarixi</CardTitle>
          {isSample && (
            <span
              className="rounded-full px-[8px] py-[2px] text-[10px] font-medium"
              style={{
                backgroundColor: 'var(--primary-input-bg)',
                color: 'var(--secondary-color)',
                border: '1px solid var(--primary-border-color)',
              }}
            >
              Namuna
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-[10px]">
        {displayContracts.map((contract, i) => (
          <ContractCard
            key={contract?.id || i}
            contract={contract}
            isSample={isSample}
          />
        ))}
      </CardContent>
    </Card>
  );
}
