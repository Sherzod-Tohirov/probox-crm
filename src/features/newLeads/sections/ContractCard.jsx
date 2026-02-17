import { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/shadcn/ui/card';
import { Button } from '@/components/shadcn/ui/button';
import { Input } from '@/components/shadcn/ui/input';
import { Select, SelectOption } from '@/components/shadcn/ui/select';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/shadcn/ui/table';
import { Search, Trash2, FileText } from 'lucide-react';
import useAuth from '@hooks/useAuth';
import formatterCurrency from '@/utils/formatterCurrency';
import ReadOnlyField from '../components/ReadOnlyField';

export default function ContractCard({
  leadData,
  invoiceScoreData,
  onDeviceRemove,
  onOpenInvoiceModal,
  canEdit,
}) {
  const { user } = useAuth();
  const isSeller = user?.U_role === 'Seller';
  const [deviceSearch, setDeviceSearch] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('');

  const devices = useMemo(
    () => leadData?.selectedDevices || [],
    [leadData?.selectedDevices]
  );
  const totalPayment = useMemo(
    () => devices.reduce((sum, d) => sum + (Number(d?.totalPrice) || 0), 0),
    [devices]
  );

  // All roles can search and select devices
  const canSearchDevices = canEdit;
  // Only Seller can complete the sale
  const canSendInvoice = isSeller && canEdit && devices.length > 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Shartnoma ma'lumotlari</CardTitle>
          {canSendInvoice && (
            <Button onClick={onOpenInvoiceModal} size="sm">
              <FileText size={16} />
              Invoice yuborish
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-[16px]">
        {/* Device Search and Filters - Available for all roles who can edit */}
        {canSearchDevices && (
          <div
            className="flex flex-col gap-[12px] rounded-[14px] border p-[14px]"
            style={{
              borderColor: 'var(--primary-border-color)',
              backgroundColor: 'var(--filter-input-bg)',
            }}
          >
            <div className="grid grid-cols-1 gap-[10px] sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col gap-[4px]">
                <span
                  className="text-[12px] font-medium"
                  style={{ color: 'var(--secondary-color)' }}
                >
                  Qidiruv
                </span>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Qurilma qidirish..."
                    value={deviceSearch}
                    onChange={(e) => setDeviceSearch(e.target.value)}
                  />
                  <Search
                    size={16}
                    className="absolute right-[10px] top-[50%] translate-y-[-50%]"
                    style={{ color: 'var(--secondary-color)' }}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-[4px]">
                <span
                  className="text-[12px] font-medium"
                  style={{ color: 'var(--secondary-color)' }}
                >
                  Filial
                </span>
                <Select
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                >
                  <SelectOption value="">Barcha filiallar</SelectOption>
                  <SelectOption value="tashkent">Toshkent</SelectOption>
                  <SelectOption value="samarkand">Samarqand</SelectOption>
                </Select>
              </div>
              <div className="flex flex-col gap-[4px]">
                <span
                  className="text-[12px] font-medium"
                  style={{ color: 'var(--secondary-color)' }}
                >
                  Holat
                </span>
                <Select
                  value={selectedCondition}
                  onChange={(e) => setSelectedCondition(e.target.value)}
                >
                  <SelectOption value="">Barchasi</SelectOption>
                  <SelectOption value="new">Yangi</SelectOption>
                  <SelectOption value="used">Ishlatilgan</SelectOption>
                </Select>
              </div>
              <ReadOnlyField
                label="Maksimal limit"
                value={
                  invoiceScoreData?.limit || leadData?.finalLimit
                    ? `${formatterCurrency(invoiceScoreData?.limit || leadData?.finalLimit)} uzs`
                    : '—'
                }
                highlight={!!(invoiceScoreData?.limit || leadData?.finalLimit)}
              />
            </div>
            <span
              className="text-[11px]"
              style={{ color: 'var(--secondary-color)' }}
            >
              💡 Barcha rollar qurilma qidirish va tanlash imkoniyatiga ega
            </span>
          </div>
        )}

        {/* Selected Devices Table */}
        {devices.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">No</TableHead>
                  <TableHead>Mahsulot nomi</TableHead>
                  <TableHead>IMEI/Seriya</TableHead>
                  <TableHead>Narxi</TableHead>
                  <TableHead>Muddat</TableHead>
                  <TableHead>Boshlang'ich to'lov</TableHead>
                  <TableHead className="w-[60px]">Amallar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {devices.map((device, index) => (
                  <TableRow key={device?.id || device?.ItemCode || index}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-[2px]">
                        <span className="font-medium">
                          {device?.ItemName || device?.name || '—'}
                        </span>
                        <span
                          className="text-[11px]"
                          style={{ color: 'var(--secondary-color)' }}
                        >
                          {device?.ItemCode || '—'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className="rounded-[6px] px-[8px] py-[4px] text-[12px] font-medium"
                        style={{
                          backgroundColor: 'var(--success-bg)',
                          color: 'var(--success-color)',
                        }}
                      >
                        {device?.IntrSerial || device?.imei || '—'}
                      </span>
                    </TableCell>
                    <TableCell className="font-semibold">
                      {device?.Price || device?.price
                        ? formatterCurrency(device.Price || device.price) +
                          ' uzs'
                        : '—'}
                    </TableCell>
                    <TableCell>
                      <span
                        className="rounded-[6px] px-[8px] py-[4px] text-[12px] font-medium"
                        style={{
                          backgroundColor: 'var(--info-bg)',
                          color: 'var(--info-color)',
                        }}
                      >
                        {device?.rentPeriod || device?.InstlmntPeriod || '—'} oy
                      </span>
                    </TableCell>
                    <TableCell className="font-semibold">
                      {device?.downPayment || device?.firstPayment
                        ? formatterCurrency(
                            device.downPayment || device.firstPayment
                          ) + ' uzs'
                        : '—'}
                    </TableCell>
                    <TableCell>
                      {canEdit && (
                        <button
                          type="button"
                          onClick={() =>
                            onDeviceRemove?.(
                              device?.id || device?.ItemCode || index
                            )
                          }
                          className="rounded-[6px] p-[6px] transition-colors hover:bg-(--danger-bg)"
                          style={{ color: 'var(--danger-color)' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div
            className="flex flex-col items-center justify-center gap-[8px] rounded-[14px] border border-dashed py-[40px]"
            style={{
              borderColor: 'var(--primary-border-color)',
              color: 'var(--secondary-color)',
            }}
          >
            <FileText size={32} style={{ opacity: 0.3 }} />
            <span className="text-[14px] font-medium">
              Qurilmalar tanlanmagan
            </span>
            {canSearchDevices && (
              <span className="text-[12px]">
                Yuqoridagi qidiruv orqali qurilma tanlang
              </span>
            )}
          </div>
        )}

        {/* Total Payment */}
        {totalPayment > 0 && (
          <div
            className="flex items-center justify-between rounded-[14px] border px-[16px] py-[14px]"
            style={{
              borderColor: 'var(--success-color)',
              backgroundColor: 'var(--success-bg)',
            }}
          >
            <span
              className="text-[15px] font-semibold"
              style={{ color: 'var(--success-color)' }}
            >
              Jami to'lov
            </span>
            <span
              className="text-[20px] font-bold"
              style={{ color: 'var(--success-color)' }}
            >
              {formatterCurrency(totalPayment)} uzs
            </span>
          </div>
        )}

        {/* Seller-only notice */}
        {!isSeller && devices.length > 0 && (
          <div
            className="rounded-[12px] border px-[14px] py-[10px] text-[12px]"
            style={{
              borderColor: 'var(--warning-color)',
              backgroundColor: 'var(--warning-bg)',
              color: 'var(--warning-color)',
            }}
          >
            ℹ️ Invoice yuborish faqat Sotuvchi roli uchun mavjud
          </div>
        )}
      </CardContent>
    </Card>
  );
}
