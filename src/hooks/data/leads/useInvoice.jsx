import { useMutation } from '@tanstack/react-query';
import { createInvoice } from '@/services/invoiceService';
import { getLeadById } from '@/services/leadsService';
import { fetchItemSeries } from '@/services/leadsService';
import { getExecutors } from '@/services/executorsService';
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
      
      console.log('=== Seller Name Lookup ===');
      console.log('Initial sellerName:', sellerName);
      console.log('leadData.seller:', leadData?.seller, typeof leadData?.seller);
      console.log('leadData.consultant:', leadData?.consultant);
      console.log('leadData.sellerName:', leadData?.sellerName);
      console.log('Full leadData keys:', Object.keys(leadData || {}));
      
      // Agar seller kodi bo'lsa, executors ro'yxatidan ismini topamiz
      // sellerName bo'sh bo'lsa va seller kodi mavjud bo'lsa
      const sellerCode = leadData?.seller;
      const hasSellerCode = sellerCode != null && sellerCode !== '' && sellerCode !== undefined;
      
      console.log('hasSellerCode:', hasSellerCode, 'sellerCode:', sellerCode);
      
      if (!sellerName && hasSellerCode) {
        try {
          console.log('Fetching executors for seller code:', leadData.seller);
          const executorsResponse = await getExecutors({ include_role: 'Seller' });
          
          console.log('Executors response:', executorsResponse);
          console.log('Executors response type:', typeof executorsResponse);
          console.log('Is array?', Array.isArray(executorsResponse));
          
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
          
          console.log('Executors array length:', executors.length);
          if (executors.length > 0) {
            console.log('First executor:', executors[0]);
            console.log('First executor SlpCode:', executors[0].SlpCode, typeof executors[0].SlpCode);
          }
          console.log('Looking for seller with SlpCode:', Number(leadData.seller));
          
          // Sotuvchi kodini topish (string va number solishtirish)
          const seller = executors.find(
            (executor) => {
              const executorCode = Number(executor?.SlpCode);
              const sellerCode = Number(leadData.seller);
              const match = executorCode === sellerCode;
              if (match) {
                console.log('Match found!', { executorCode, sellerCode, executor });
              }
              return match;
            }
          );
          
          console.log('Found seller:', seller);
          
          if (seller?.SlpName) {
            sellerName = seller.SlpName;
            console.log('Seller name set to:', sellerName);
          } else {
            console.warn('Seller not found. Available SlpCodes:', executors.map(e => ({ SlpCode: e.SlpCode, SlpName: e.SlpName })));
          }
        } catch (error) {
          console.error('Sotuvchi nomini olishda xatolik:', error);
          // Xatolik bo'lsa ham davom etamiz
        }
      } else {
        console.log('Seller name lookup skipped. Reasons:', {
          hasSellerName: !!sellerName,
          sellerValue: leadData?.seller,
          sellerIsNull: leadData?.seller === null,
          sellerIsUndefined: leadData?.seller === undefined,
          sellerIsEmpty: leadData?.seller === '',
        });
      }
      
      console.log('Final sellerName:', sellerName);

      // 7. Invoice body ni tayyorlash
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
      };

      // 8. Invoice yuborish
      await createInvoice(invoiceData);

      // 9. Invoice ma'lumotlarini qaytarish (PDF fayl yaratish uchun)
      return invoiceData;
    },
    retry: false,
    ...options,
  });
}
