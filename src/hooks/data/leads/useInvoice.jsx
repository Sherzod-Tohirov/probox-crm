import { useMutation } from '@tanstack/react-query';
import { createInvoiceTest } from '@/services/invoiceService';
import { getLeadById } from '@/services/leadsService';
import { fetchItemSeries } from '@/services/leadsService';
import { getExecutors } from '@/services/executorsService';
import {
  extractNumericValue,
  resolveItemCode,
  calculatePaymentDetails,
} from '@/features/leads/utils/deviceUtils';
import { getCurrency } from '@/services/currencyService';
import moment from 'moment';

export default function useInvoice(options = {}) {
  return useMutation({
    mutationFn: async ({
      leadId,
      selectedDevices,
      paymentType,
      calculationTypeFilter,
      payments,
      internalLimit,
    }) => {
      // 1. Lead ma'lumotlarini olish
      let leadResponse;
      try {
        leadResponse = await getLeadById(leadId);
      } catch (error) {
        console.error('Lead data fetch failed:', error);
        throw new Error("Lead ma'lumotlarini olishda xatolik yuz berdi");
      }

      const leadData = leadResponse?.data || leadResponse;

      if (!leadData) {
        throw new Error("Lead ma'lumotlari topilmadi");
      }

      // 2. Monthly limit ni hisoblash (DocumentLines dan oldin kerak)
      const monthlyLimit =
        leadData?.finalLimit !== null && leadData?.finalLimit !== undefined
          ? Number(leadData.finalLimit) || null
          : null;

      // Calculation type va boshqa parametrlarni olish
      // Avval parametrdan, keyin leadData dan, oxirida default
      const calculationType =
        calculationTypeFilter ||
        leadData?.calculationTypeFilter ||
        leadData?.calculationType ||
        'markup';
      const finalPercentage =
        leadData?.finalPercentage !== null &&
        leadData?.finalPercentage !== undefined
          ? Number(leadData.finalPercentage) || null
          : null;

      // maximumLimit - agar monthlyLimit bo'lsa, uni ishlatamiz, aks holda finalLimit
      let maximumLimit =
        leadData?.finalLimit !== null && leadData?.finalLimit !== undefined
          ? Number(leadData.finalLimit) || null
          : null;

      // Agar monthlyLimit bo'lsa va maximumLimit 0 yoki null bo'lsa, maximumLimit ni monthlyLimit ga tenglashtiramiz
      if (
        monthlyLimit !== null &&
        monthlyLimit !== undefined &&
        monthlyLimit > 0
      ) {
        if (
          maximumLimit === null ||
          maximumLimit === undefined ||
          maximumLimit === 0
        ) {
          maximumLimit = monthlyLimit;
        }
      }

      // 3. DocumentLines ni tayyorlash
      const documentLines = await Promise.all(
        selectedDevices.map(async (device) => {
          const itemCode = resolveItemCode(device);
          const whsCode = device?.whsCode || device?.raw?.WhsCode || '';
          const price = extractNumericValue(device.price) || 0;

          // Jami narxni hisoblash (ustama bilan)
          const period = Number(device.rentPeriod) || 1;
          const firstPayment = extractNumericValue(device.firstPayment) || 0;
          const monthlyLimitNum =
            monthlyLimit !== null && monthlyLimit !== undefined
              ? monthlyLimit
              : 0;

          let totalPrice = price; // Default: faqat narx
          let monthlyPayment = 0; // Oylik to'lov

          // Agar price va period to'g'ri bo'lsa, grandTotal ni hisoblaymiz
          if (price && price > 0 && period > 0) {
            const deviceFirstPaymentManual =
              device?.isFirstPaymentManual || false;

            const paymentDetails = calculatePaymentDetails({
              price,
              period,
              monthlyLimit: monthlyLimitNum,
              firstPayment,
              isFirstPaymentManual: deviceFirstPaymentManual,
              calculationType: calculationType,
              finalPercentage: finalPercentage,
              maximumLimit: maximumLimit,
            });
            totalPrice = paymentDetails.grandTotal || price;
            monthlyPayment = paymentDetails.monthlyPayment || 0;
          }

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
                  ManufacturerSerialNumber:
                    seriesData.DistNumber || device.imeiValue,
                  InternalSerialNumber:
                    seriesData.DistNumber || device.imeiValue,
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
                    ManufacturerSerialNumber:
                      selectedSeries.DistNumber || device.imeiValue,
                    InternalSerialNumber:
                      selectedSeries.DistNumber || device.imeiValue,
                    SystemSerialNumber: selectedSeries.SysNumber || 0,
                    Quantity: 1,
                    ItemCode: itemCode,
                  },
                ];
              }
            } else {
              // Agar rawSeries mavjud bo'lmasa, API dan olamiz
              try {
                const seriesResponse = await fetchItemSeries({
                  whsCode,
                  itemCode,
                });
                const seriesItems = Array.isArray(seriesResponse?.items)
                  ? seriesResponse.items
                  : Array.isArray(seriesResponse)
                    ? seriesResponse
                    : (seriesResponse?.data ?? []);

                const selectedSeries = seriesItems.find(
                  (series) => series.DistNumber === device.imeiValue
                );

                if (selectedSeries) {
                  serialNumbers = [
                    {
                      ManufacturerSerialNumber:
                        selectedSeries.DistNumber || device.imeiValue,
                      InternalSerialNumber:
                        selectedSeries.DistNumber || device.imeiValue,
                      SystemSerialNumber: selectedSeries.SysNumber || 0,
                      Quantity: 1,
                      ItemCode: itemCode,
                    },
                  ];
                }
              } catch (error) {
                // Serial number bo'lmasa ham davom etamiz
                console.warn(
                  `Serial number fetch failed for device ${device.name}:`,
                  error
                );
              }
            }
          }

          return {
            ItemCode: itemCode,
            WarehouseCode: whsCode,
            Quantity: 1,
            Price: totalPrice, // Jami narx (ustama bilan)
            Currency: 'UZS',
            DiscountPercent: 0,
            UnitPrice: totalPrice, // Jami narx (ustama bilan)
            SerialNumbers: serialNumbers,
            U_FirstPayment: firstPayment,
            U_QP: period, // Ijara oyi (har bir device uchun o'zining period)
            U_SP: monthlyPayment, // Oylik to'lov
          };
        })
      );

      // 4. Manzil ma'lumotlarini formatlash
      const clientAddressParts = [];
      if (leadData.region) clientAddressParts.push(leadData.region);
      if (leadData.district) clientAddressParts.push(leadData.district);
      if (leadData.address) clientAddressParts.push(leadData.address);
      const clientAddress =
        clientAddressParts.length > 0 ? clientAddressParts.join(', ') : '';

      // 5. Sotuvchi nomini olish
      // Avval consultant yoki sellerName ni tekshiramiz
      let sellerName = leadData?.consultant || leadData?.sellerName || '';

      // Agar seller kodi bo'lsa, executors ro'yxatidan ismini topamiz
      // sellerName bo'sh bo'lsa va seller kodi mavjud bo'lsa
      const sellerCode = leadData?.seller;
      const hasSellerCode =
        sellerCode != null && sellerCode !== '' && sellerCode !== undefined;

      if (!sellerName && hasSellerCode) {
        try {
          const executorsResponse = await getExecutors({
            include_role: 'Seller',
          });

          // Response strukturasini tekshirish
          let executors = [];

          if (Array.isArray(executorsResponse)) {
            // To'g'ridan-to'g'ri array
            executors = executorsResponse;
          } else if (
            executorsResponse?.data &&
            Array.isArray(executorsResponse.data)
          ) {
            // { total: 12, data: [...] } yoki { data: [...] } format
            executors = executorsResponse.data;
          } else if (
            executorsResponse?.content &&
            Array.isArray(executorsResponse.content)
          ) {
            // { content: [...] } format
            executors = executorsResponse.content;
          }

          // Sotuvchi kodini topish (string va number solishtirish)
          const seller = executors.find((executor) => {
            const executorCode = Number(executor?.SlpCode);
            const sellerCode = Number(leadData.seller);
            return executorCode === sellerCode;
          });

          if (seller?.SlpName) {
            sellerName = seller.SlpName;
          }
        } catch (error) {
          // Xatolik bo'lsa ham davom etamiz
          console.warn('Seller name fetch failed:', error);
        }
      }

      // 6. CashSum ni keyinroq hisoblaymiz (totalFirstPayment dan keyin)

      // 7. DocRate (dollar kursi) ni olish
      let docRate = null;
      try {
        const currencyDate = moment().format('YYYY.MM.DD');
        const currencyResponse = await getCurrency({ date: currencyDate });
        // Currency response strukturasini tekshirish
        if (currencyResponse?.Rate) {
          docRate = Number(currencyResponse.Rate);
        } else if (currencyResponse?.data?.Rate) {
          docRate = Number(currencyResponse.data.Rate);
        } else if (
          Array.isArray(currencyResponse) &&
          currencyResponse.length > 0
        ) {
          docRate = Number(
            currencyResponse[0]?.Rate || currencyResponse[0]?.rate || 0
          );
        }
      } catch (error) {
        // Currency rate olishda xatolik bo'lsa ham davom etamiz
        console.warn('Currency rate olishda xatolik:', error);
      }

      // 8. DocDate (joriy sana) ni formatlash
      const docDate = moment().format('YYYY-MM-DD');

      // 9. NumberOfInstallments va DocumentInstallments ni hisoblash
      const maxRentPeriod =
        selectedDevices.length > 0
          ? Math.max(
              ...selectedDevices.map((device) => Number(device.rentPeriod) || 1)
            )
          : 1;

      // 10. DocumentInstallments (to'lov jadvali) ni hisoblash
      const monthlyLimitNum =
        monthlyLimit !== null && monthlyLimit !== undefined ? monthlyLimit : 0;
      let grandTotal = 0;
      let totalFirstPayment = 0;
      const devicePayments = [];

      // Har bir qurilma uchun to'lov ma'lumotlarini hisoblash
      selectedDevices.forEach((device) => {
        const price = extractNumericValue(device.price);
        const period = Number(device.rentPeriod) || 1;
        const firstPayment = extractNumericValue(device.firstPayment) || 0;

        if (price && price > 0 && period > 0) {
          const deviceFirstPaymentManual =
            device?.isFirstPaymentManual || false;

          console.log('=== BEFORE calculatePaymentDetails ===', {
            deviceName: device.name,
            rawFirstPayment: device.firstPayment,
            extractedFirstPayment: firstPayment,
            isFirstPaymentManual: deviceFirstPaymentManual,
            calculationType: calculationType,
            finalPercentage: finalPercentage,
            maximumLimit: maximumLimit,
          });

          const paymentDetails = calculatePaymentDetails({
            price,
            period,
            monthlyLimit: monthlyLimitNum,
            firstPayment,
            isFirstPaymentManual: deviceFirstPaymentManual,
            calculationType: calculationType,
            finalPercentage: finalPercentage,
            maximumLimit: maximumLimit,
          });

          console.log('=== AFTER calculatePaymentDetails ===', {
            deviceName: device.name,
            calculatedFirstPayment: paymentDetails.calculatedFirstPayment,
            monthlyPayment: paymentDetails.monthlyPayment,
            grandTotal: paymentDetails.grandTotal,
          });

          // Always use calculatedFirstPayment as it handles both manual and automatic scenarios with proper rounding
          const actualFirstPayment = paymentDetails.calculatedFirstPayment;
          grandTotal += paymentDetails.grandTotal || 0;
          totalFirstPayment += actualFirstPayment || 0;

          devicePayments.push({
            period,
            monthlyPayment: paymentDetails.monthlyPayment || 0,
          });
        }
      });

      // 6. CashSum (birinchi to'lov summasi) ni hisoblash - totalFirstPayment dan foydalanamiz
      const cashSum = totalFirstPayment;

      // NumberOfInstallments ni hisoblash:
      // Agar birinchi to'lov 0 bo'lsa, numberOfInstallments = rentPeriod
      // Agar birinchi to'lov mavjud bo'lsa, numberOfInstallments = rentPeriod + 1
      const numberOfInstallments =
        totalFirstPayment > 0 ? maxRentPeriod + 1 : maxRentPeriod;

      // DocumentInstallments ni yaratish (uzunligi numberOfInstallments ga teng = rentPeriod + 1)
      const documentInstallments = [];
      let installmentId = 1;

      // 1. Birinchi object: birinchi to'lov (firstPayment) - CashSum bilan bir xil
      if (totalFirstPayment > 0) {
        const firstPaymentDate = moment().format('YYYY-MM-DD');

        documentInstallments.push({
          DueDate: firstPaymentDate,
          TotalFC: Math.round(totalFirstPayment),
          InstallmentId: installmentId++,
          U_date: firstPaymentDate,
          U_Employee: null,
          U_Comment: null,
          U_PromisedDate: null,
        });
      }

      // 2. Har bir oy uchun oylik to'lovlar (1 dan rentPeriod gacha)
      for (let month = 1; month <= maxRentPeriod; month++) {
        let monthlyTotal = 0;

        devicePayments.forEach((devicePayment) => {
          if (month <= devicePayment.period) {
            monthlyTotal += devicePayment.monthlyPayment;
          }
        });

        // Har bir oy uchun installments yaratish (monthlyTotal 0 bo'lsa ham)
        const dueDate = moment().add(month, 'months').format('YYYY-MM-DD');

        documentInstallments.push({
          DueDate: dueDate,
          TotalFC: Math.round(monthlyTotal),
          InstallmentId: installmentId++,
          U_date: dueDate,
          U_Employee: null,
          U_Comment: null,
          U_PromisedDate: null,
        });
      }

      // Muhim: DocumentInstallments yig'indisi DocumentLines.Price yig'indisiga teng bo'lishi shart.
      // Biz jadvalni o'zgartirmaymiz; farq bo'lsa DocumentLines.Price ni jadvalga moslaymiz.
      const expectedTotal = documentLines.reduce(
        (acc, line) => acc + (Number(line?.Price) || 0),
        0
      );
      const installmentsTotal = documentInstallments.reduce(
        (acc, inst) => acc + (Number(inst?.TotalFC) || 0),
        0
      );
      const delta = installmentsTotal - expectedTotal;

      if (delta !== 0 && documentLines.length > 0) {
        const lastIdx = documentLines.length - 1;
        const lastLine = documentLines[lastIdx];
        const nextPrice = (Number(lastLine?.Price) || 0) + delta;

        if (nextPrice >= 0) {
          documentLines[lastIdx] = {
            ...lastLine,
            Price: nextPrice,
            UnitPrice: nextPrice,
          };
        }
      }

      // DocDueDate - oxirgi to'lov sanasi
      const docDueDate =
        documentInstallments.length > 0
          ? documentInstallments[documentInstallments.length - 1].DueDate
          : docDate;

      // 11. Invoice body ni tayyorlash
      const limitMap = {
        internalLimit: 'internaLimit',
        markup: 'finalLimit',
        firstPayment: 'percentage',
      };

      const invoiceData = {
        CardCode: leadData.cardCode || '',
        DocDate: docDate, // Joriy sana
        DocDueDate: docDueDate, // Oxirgi to'lov sanasi
        NumberOfInstallments: numberOfInstallments, // Ijara oyi
        DocumentInstallments: documentInstallments, // To'lov jadvali
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
        internalLimit: internalLimit,
        selectedDevices: selectedDevices, // To'lov jadvali uchun
        CashSum: cashSum, // Birinchi to'lov summasi,
        U_FirstPayment: cashSum,
        DocRate: docRate, // Dollar kursi
        paymentType: paymentType || '', // To'lov turi
        calculationType: calculationType, // Xisoblash turi (markup, internalLimit yoki firstPayment)
        usedType: limitMap[calculationType], // SAP uchun ko'rinish (finalLimit / internaLimit / percentage)
        finalPercentage: finalPercentage, // Final percentage (Foiz holatida)
        maximumLimit: maximumLimit, // Maximum limit
      };
      // console.log(invoiceData, 'invoice data');
      // Payments array'ni qo'shish (agar mavjud bo'lsa)
      if (payments && Array.isArray(payments) && payments.length > 0) {
        invoiceData.payments = payments;
      } else {
        console.warn('No payments provided or payments array is empty');
      }

      // 10. Invoice yuborish
      let invoiceResponse;
      try {
        // invoiceResponse = await createInvoiceTest(invoiceData);
        console.log('Invoice created successfully:', invoiceResponse);
      } catch (error) {
        console.error('Invoice creation failed:', error);
        console.error('Invoice data that failed:', invoiceData);
        throw new Error(
          `Invoice yaratishda xatolik: ${error.message || "Noma'lum xatolik"}`
        );
      }

      // 11. Invoice ma'lumotlarini qaytarish (PDF fayl yaratish uchun)
      return {
        ...invoiceData,
        invoiceDocNum:
          invoiceResponse?.invoiceDocNum ||
          invoiceResponse?.data?.invoiceDocNum,
        invoiceDocEntry:
          invoiceResponse?.invoiceDocEntry ||
          invoiceResponse?.data?.invoiceDocEntry,
      };
    },
    retry: false,
    ...options,
  });
}

// /lead-images/upload method: POST
// /lead-images/upload method: POST
