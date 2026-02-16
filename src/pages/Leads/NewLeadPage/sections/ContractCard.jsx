import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/ui/card';
import { Select, SelectOption } from '@/components/shadcn/ui/select';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/shadcn/ui/table';
import ReadOnlyField from '../components/ReadOnlyField';
import formatterCurrency from '@/utils/formatterCurrency';

export default function ContractCard({ leadData, invoiceScoreData }) {
  const devices = leadData?.selectedDevices || [];
  const totalPayment = devices.reduce((sum, d) => sum + (d?.totalPrice || 0), 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shartnoma ma'lumotlari</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-[16px]">
        {/* Top row: contract filters */}
        <div className="grid grid-cols-2 gap-[12px] sm:grid-cols-4">
          <div className="flex flex-col gap-[4px]">
            <span className="text-[12px] font-medium" style={{ color: 'var(--secondary-color)' }}>
              Xarajatish turi
            </span>
            <Select placeholder="Tanlang" disabled>
              <SelectOption value="">Tanlang</SelectOption>
            </Select>
          </div>
          <div className="flex flex-col gap-[4px]">
            <span className="text-[12px] font-medium" style={{ color: 'var(--secondary-color)' }}>
              Filial
            </span>
            <Select placeholder="Tanlang" disabled>
              <SelectOption value="">Tanlang</SelectOption>
            </Select>
          </div>
          <div className="flex flex-col gap-[4px]">
            <span className="text-[12px] font-medium" style={{ color: 'var(--secondary-color)' }}>
              Holat
            </span>
            <Select placeholder="Tanlang" disabled>
              <SelectOption value="">Tanlang</SelectOption>
            </Select>
          </div>
          <ReadOnlyField
            label="Maksimal limit"
            value={
              invoiceScoreData?.limit
                ? `${formatterCurrency(invoiceScoreData.limit)} uzs`
                : ''
            }
            highlight={!!invoiceScoreData?.limit}
          />
        </div>

        {/* Devices table */}
        {devices.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>Mahsulot nomi</TableHead>
                <TableHead>IMEI raqami</TableHead>
                <TableHead>Nura</TableHead>
                <TableHead>Ijara oyi</TableHead>
                <TableHead>Birinchi to'lov</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {devices.map((device, index) => (
                <TableRow key={device?.id || index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{device?.name || '—'}</TableCell>
                  <TableCell>
                    <span className="rounded-[6px] bg-emerald-500/10 px-[8px] py-[2px] text-[13px] text-emerald-600">
                      {device?.imei || '—'}
                    </span>
                  </TableCell>
                  <TableCell>{device?.price ? formatterCurrency(device.price) + ' uzs' : '—'}</TableCell>
                  <TableCell>{device?.rentPeriod || '—'}</TableCell>
                  <TableCell>{device?.firstPayment ? formatterCurrency(device.firstPayment) + ' uzs' : '—'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div
            className="flex items-center justify-center rounded-[14px] border border-dashed py-[32px] text-[14px]"
            style={{
              borderColor: 'var(--primary-border-color)',
              color: 'var(--secondary-color)',
            }}
          >
            Qurilmalar tanlanmagan
          </div>
        )}

        {/* Total */}
        {totalPayment > 0 && (
          <div className="flex items-center justify-between border-t pt-[12px]" style={{ borderColor: 'var(--primary-border-color)' }}>
            <span className="text-[14px] font-medium" style={{ color: 'var(--secondary-color)' }}>
              Jami to'lov
            </span>
            <span className="text-[18px] font-bold" style={{ color: 'var(--primary-color)' }}>
              {formatterCurrency(totalPayment)} uzs
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
