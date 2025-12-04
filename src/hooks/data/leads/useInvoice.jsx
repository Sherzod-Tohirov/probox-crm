import { useMutation } from '@tanstack/react-query';
import { createInvoice } from '@/services/invoiceService';
import { getLeadById } from '@/services/leadsService';
import { fetchItemSeries } from '@/services/leadsService';
import { getExecutors } from '@/services/executorsService';
import { extractNumericValue, resolveItemCode } from '@/features/leads/utils/deviceUtils';
import { getCurrency } from '@/services/currencyService';
import moment from 'moment';

export default function useInvoice(options = {}) {
  return useMutation({
    mutationFn: async ({ leadId, selectedDevices, paymentType }) => {
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
          const price = extractNumericValue(device.price) || 0;

          if (!itemCode || !whsCode) {
            const missingFields = [];
            if (!itemCode) missingFields.push('ItemCode');
            if (!whsCode) missingFields.push('WhsCode');
            
            throw new Error(
              `Qurilma ma'lumotlari to'liq emas: ${device.name || "Noma'lum"}. ` +
              `Yetishmayotgan maydonlar: ${missingFields.join(', ')}`
            );
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

      // 4. Manzil ma'lumotlarini formatlash
      const clientAddressParts = [];
      if (leadData.region) clientAddressParts.push(leadData.region);
      if (leadData.district) clientAddressParts.push(leadData.district);
      if (leadData.address) clientAddressParts.push(leadData.address);
      const clientAddress = clientAddressParts.length > 0 
        ? clientAddressParts.join(', ') 
        : '';

      // 5. Monthly limit ni hisoblash
      const monthlyLimit = (leadData?.finalLimit !== null && leadData?.finalLimit !== undefined) 
        ? (Number(leadData.finalLimit) || null)
        : null;

      // 6. Sotuvchi nomini olish
      // Avval consultant yoki sellerName ni tekshiramiz
      let sellerName = leadData?.consultant || leadData?.sellerName || '';
      
      // Agar seller kodi bo'lsa, executors ro'yxatidan ismini topamiz
      // sellerName bo'sh bo'lsa va seller kodi mavjud bo'lsa
      const sellerCode = leadData?.seller;
      const hasSellerCode = sellerCode != null && sellerCode !== '' && sellerCode !== undefined;
      
      if (!sellerName && hasSellerCode) {
        try {
          const executorsResponse = await getExecutors({ include_role: 'Seller' });
          
          // Response strukturasini tekshirish
          let executors = [];
          
          if (Array.isArray(executorsResponse)) {
            // To'g'ridan-to'g'ri array
            executors = executorsResponse;
          } else if (executorsResponse?.data && Array.isArray(executorsResponse.data)) {
            // { total: 12, data: [...] } yoki { data: [...] } format
            executors = executorsResponse.data;
          } else if (executorsResponse?.content && Array.isArray(executorsResponse.content)) {
            // { content: [...] } format
            executors = executorsResponse.content;
          }
          
          // Sotuvchi kodini topish (string va number solishtirish)
          const seller = executors.find(
            (executor) => {
              const executorCode = Number(executor?.SlpCode);
              const sellerCode = Number(leadData.seller);
              return executorCode === sellerCode;
            }
          );
          
          if (seller?.SlpName) {
            sellerName = seller.SlpName;
          }
        } catch (error) {
          // Xatolik bo'lsa ham davom etamiz
        }
      }

      // 7. CashSum (birinchi to'lov summasi) ni hisoblash
      const cashSum = selectedDevices.reduce((total, device) => {
        const firstPayment = 
          device.firstPayment === '' || device.firstPayment === null || device.firstPayment === undefined
            ? 0
            : Number(device.firstPayment);
        return total + (Number.isFinite(firstPayment) && firstPayment > 0 ? firstPayment : 0);
      }, 0);

      // 8. DocRate (dollar kursi) ni olish
      let docRate = null;
      try {
        const currencyDate = moment().format('YYYY.MM.DD');
        const currencyResponse = await getCurrency({ date: currencyDate });
        // Currency response strukturasini tekshirish
        if (currencyResponse?.Rate) {
          docRate = Number(currencyResponse.Rate);
        } else if (currencyResponse?.data?.Rate) {
          docRate = Number(currencyResponse.data.Rate);
        } else if (Array.isArray(currencyResponse) && currencyResponse.length > 0) {
          docRate = Number(currencyResponse[0]?.Rate || currencyResponse[0]?.rate || 0);
        }
      } catch (error) {
        // Currency rate olishda xatolik bo'lsa ham davom etamiz
        console.warn('Currency rate olishda xatolik:', error);
      }

      // 9. Invoice body ni tayyorlash
      const invoiceData = {
        CardCode: leadData.cardCode || '',
        leadId: leadId,
        U_leadId: leadId,
        clientPhone: leadData.clientPhone || '',
        clientName: leadData.clientName || leadData.clientFullName || '',
        jshshir: leadData.jshshir || leadData.jsshir || '',
        passportId: leadData.passportId || '',
        clientAddress: clientAddress,
        monthlyLimit: monthlyLimit,
        sellerName: sellerName,
        DocumentLines: documentLines,
        selectedDevices: selectedDevices, // To'lov jadvali uchun
        CashSum: cashSum, // Birinchi to'lov summasi
        DocRate: docRate, // Dollar kursi
        paymentType: paymentType || '', // To'lov turi
      };

      // 10. Invoice yuborish
      await createInvoice(invoiceData);

      // 11. Invoice ma'lumotlarini qaytarish (PDF fayl yaratish uchun)
      return invoiceData;
    },
    retry: false,
    ...options,
  });
}


// /lead-images/upload method: POST