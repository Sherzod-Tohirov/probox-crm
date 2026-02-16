import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/shadcn/ui/tabs';
import { Select, SelectOption } from '@/components/shadcn/ui/select';
import { Input } from '@/components/shadcn/ui/input';
import { useState } from 'react';

function LabeledField({ label, children }) {
  return (
    <div className="flex flex-col gap-[4px]">
      <span className="text-[12px] font-medium" style={{ color: 'var(--secondary-color)' }}>
        {label}
      </span>
      {children}
    </div>
  );
}

export default function SidebarServiceInfo({ lead, executors }) {
  const [activeTab, setActiveTab] = useState('operator');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Xizmat ma'lumotlari</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-[14px]">
        <Tabs value={activeTab} onChange={setActiveTab}>
          <TabsList className="w-full">
            <TabsTrigger value="operator" className="flex-1">Operator</TabsTrigger>
            <TabsTrigger value="seller" className="flex-1">Sotuvchi</TabsTrigger>
            <TabsTrigger value="scoring" className="flex-1">Tekshiruvchi</TabsTrigger>
          </TabsList>

          <TabsContent value="operator">
            <div className="flex flex-col gap-[12px]">
              <div className="grid grid-cols-2 gap-[10px]">
                <LabeledField label="Uchrashuv tasdiqlandimi">
                  <Select disabled value={lead?.meetingConfirmed ? 'true' : ''}>
                    <SelectOption value="">Tanlang</SelectOption>
                    <SelectOption value="true">Ha</SelectOption>
                    <SelectOption value="false">Yo'q</SelectOption>
                  </Select>
                </LabeledField>
                <LabeledField label="Vaqti">
                  <Input type="text" disabled value={lead?.meetingDate || ''} placeholder="kk.oo.yyyy | 00:00" />
                </LabeledField>
              </div>
              <LabeledField label="Filial">
                <Select disabled value={lead?.branch || ''}>
                  <SelectOption value="">Tanlang</SelectOption>
                </Select>
              </LabeledField>
              <LabeledField label="Sotuvchi">
                <Select disabled value={lead?.seller || ''}>
                  <SelectOption value="">Tanlang</SelectOption>
                  {(executors || [])
                    .filter((e) => e?.U_role === 'Seller')
                    .map((e) => (
                      <SelectOption key={e.SlpCode} value={String(e.SlpCode)}>
                        {e.SlpName}
                      </SelectOption>
                    ))}
                </Select>
              </LabeledField>
            </div>
          </TabsContent>

          <TabsContent value="seller">
            <div className="flex flex-col gap-[12px]">
              <LabeledField label="Uchrashuv tasdiqlandimi">
                <Select disabled value={lead?.meetingConfirmed ? 'true' : ''}>
                  <SelectOption value="">Tanlang</SelectOption>
                  <SelectOption value="true">Ha</SelectOption>
                  <SelectOption value="false">Yo'q</SelectOption>
                </Select>
              </LabeledField>
              <LabeledField label="Savdo turi">
                <Select disabled value={lead?.saleType || ''}>
                  <SelectOption value="">Tanlang</SelectOption>
                </Select>
              </LabeledField>
              <LabeledField label="Xarid amalga oshdimi">
                <Select disabled value={lead?.purchase ? 'true' : ''}>
                  <SelectOption value="">Tanlang</SelectOption>
                  <SelectOption value="true">Ha</SelectOption>
                  <SelectOption value="false">Yo'q</SelectOption>
                </Select>
              </LabeledField>
            </div>
          </TabsContent>

          <TabsContent value="scoring">
            <div className="flex flex-col gap-[12px]">
              <LabeledField label="Skoring natija">
                <Input type="text" disabled value={lead?.scoringResult || ''} placeholder="—" />
              </LabeledField>
              <LabeledField label="KATM">
                <Input type="text" disabled value={lead?.katm || ''} placeholder="—" />
              </LabeledField>
              <LabeledField label="MIB">
                <Input type="text" disabled value={lead?.mib || ''} placeholder="—" />
              </LabeledField>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
