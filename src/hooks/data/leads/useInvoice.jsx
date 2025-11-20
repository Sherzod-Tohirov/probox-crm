import { useMutation } from '@tanstack/react-query';
import { createInvoice } from '@/services/invoiceService';
import { getLeadById } from '@/services/leadsService';
import { fetchItemSeries } from '@/services/leadsService';
import { extractNumericValue, resolveItemCode } from '@/features/leads/utils/deviceUtils';

export default function useInvoice(options = {}) {
  return useMutation({
    mutationFn: async ({ leadId, selectedDevices }) => {
      // 1. Lead ma'lumotlarini olish
      const leadResponse = await getLeadById(leadId);
      const leadData = leadResponse?.data || leadResponse;

      if (!leadData) {
        throw new Error('Lead ma\'lumotlari topilmadi');
      }

      // 2. DocumentLines ni tayyorlash
      const documentLines = await Promise.all(
        selectedDevices.map(async (device) => {
          const itemCode = resolveItemCode(device);
          const whsCode = device?.whsCode || device?.raw?.WhsCode || '';
          const price = extractNumericValue(device.price);

          if (!itemCode || !whsCode || !price) {
            throw new Error(`Qurilma ma'lumotlari to'liq emas: ${device.name || "Noma'lum"}`);
          }

          // 3. Serial numbers ni olish
          let serialNumbers = [];
          if (device.imeiValue) {
            // Agar imeiValue tanlangan bo'lsa, uni ishlatamiz
            const selectedImeiOption = device.imeiOptions?.find(
              (opt) => opt.value === device.imeiValue
            );
            
            if (selectedImeiOption?.meta) {
              const seriesData = selectedImeiOption.meta;
              serialNumbers = [
                {
                  ManufacturerSerialNumber: seriesData.DistNumber || device.imeiValue,
                  InternalSerialNumber: seriesData.DistNumber || device.imeiValue,
                  SystemSerialNumber: seriesData.SysNumber || 0,
                  Quantity: 1,
                  ItemCode: itemCode,
                },
              ];
            } else if (device.rawSeries && Array.isArray(device.rawSeries)) {
              // Agar rawSeries mavjud bo'lsa, undan olamiz
              const selectedSeries = device.rawSeries.find(
                (series) => series.DistNumber === device.imeiValue
              );
              
              if (selectedSeries) {
                serialNumbers = [
                  {
                    ManufacturerSerialNumber: selectedSeries.DistNumber || device.imeiValue,
                    InternalSerialNumber: selectedSeries.DistNumber || device.imeiValue,
                    SystemSerialNumber: selectedSeries.SysNumber || 0,
                    Quantity: 1,
                    ItemCode: itemCode,
                  },
                ];
              }
            } else {
              // Agar rawSeries mavjud bo'lmasa, API dan olamiz
              try {
                const seriesResponse = await fetchItemSeries({ whsCode, itemCode });
                const seriesItems = Array.isArray(seriesResponse?.items)
                  ? seriesResponse.items
                  : Array.isArray(seriesResponse)
                    ? seriesResponse
                    : seriesResponse?.data ?? [];

                const selectedSeries = seriesItems.find(
                  (series) => series.DistNumber === device.imeiValue
                );

                if (selectedSeries) {
                  serialNumbers = [
                    {
                      ManufacturerSerialNumber: selectedSeries.DistNumber || device.imeiValue,
                      InternalSerialNumber: selectedSeries.DistNumber || device.imeiValue,
                      SystemSerialNumber: selectedSeries.SysNumber || 0,
                      Quantity: 1,
                      ItemCode: itemCode,
                    },
                  ];
                }
              } catch (error) {
                console.warn('Serial numbers olishda xatolik:', error);
                // Serial number bo'lmasa ham davom etamiz
              }
            }
          }

          return {
            ItemCode: itemCode,
            WarehouseCode: whsCode,
            Quantity: 1,
            Price: price,
            Currency: 'UZS',
            DiscountPercent: 0,
            UnitPrice: price,
            SerialNumbers: serialNumbers,
          };
        })
      );

      // 4. Invoice body ni tayyorlash
      const invoiceData = {
        CardCode: leadData.cardCode || '',
        leadId: leadId,
        U_leadId: leadId,
        clientPhone: leadData.clientPhone || '',
        clientName: leadData.clientName || leadData.clientFullName || '',
        DocumentLines: documentLines,
        selectedDevices: selectedDevices, // To'lov jadvali uchun
      };

      // 5. Invoice yuborish
      await createInvoice(invoiceData);

      // 6. Invoice ma'lumotlarini qaytarish (PDF fayl yaratish uchun)
      return invoiceData;
    },
    retry: false,
    ...options,
  });
}
