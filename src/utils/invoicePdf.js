/**
 * Invoice ma'lumotlaridan PDF fayl yaratadi va yuklab olish
 * Shartnoma formatida - to'liq shablon asosida
 * Times New Roman font bilan, Cyrillic belgilarini qo'llab-quvvatlaydi
 * @param {Object} invoiceData - Invoice ma'lumotlari
 * @param {string} invoiceData.clientName - Mijoz nomi
 * @param {string} invoiceData.clientPhone - Mijoz telefon raqami
 * @param {string} invoiceData.cardCode - Card code
 * @param {string} invoiceData.leadId - Lead ID
 * @param {Array} invoiceData.DocumentLines - Qurilmalar ro'yxati
 */

import { imageToBase64,  pdfMake } from './pdfHelpers';
import { calculatePaymentData, calculatePaymentSchedule, getDateInfo } from './invoicePdfCalculations';

// pdfmake uzun "bitta so'z"larni (bo'sh joysiz) satrga bo'la olmaydi va matn kesilib qoladi.
// \u200B ba'zi holatlarda wrap bo'lmasligi mumkin, shuning uchun bu yerda majburiy newline (\n) qo'yamiz.
const softWrapLongTokens = (text, chunkSize = 16) => {
  if (!text) return text;
  const str = String(text);
  // Agar allaqachon bo'shliqlar bo'lsa ham, juda uzun token bo'lsa bo'lamiz
  return str
    .split(' ')
    .map((token) => {
      if (token.length <= chunkSize) return token;
      // Har chunk'dan keyin qator tashlaymiz (PDF'da 100% wrap bo'ladi)
      return token.replace(new RegExp(`(.{${chunkSize}})`, 'g'), '$1\n');
    })
    .join(' ');
};

export const generateInvoicePdf = async (invoiceData) => {
  if (!invoiceData) {
    throw new Error('invoiceData topilmadi');
  }
  
  const { 
    clientName, 
    clientPhone, 
    cardCode = invoiceData.CardCode,
    leadId, 
    invoiceDocNum,
    jshshir = '',
    passportId = '',
    clientAddress = '',
    sellerName = '',
    currentUser = null,
    userSignature = null,
    DocumentLines = [],
    selectedDevices = []
  } = invoiceData;
  
  // Agar sellerName bo'sh bo'lsa, currentUser dan olamiz
  const finalSellerName = sellerName || currentUser?.SlpName || '';

  try {
    // Imzo va muhur rasmini yuklab olish
    const signatureImage = await imageToBase64('/signature-stamp.jpg');
    
    // To'lov ma'lumotlarini hisoblash
    const calculationType = invoiceData.calculationType || 'markup';
    const finalPercentage = invoiceData.finalPercentage || null;
    const maximumLimit = invoiceData.maximumLimit || null;
    
    const paymentData = calculatePaymentData(
      selectedDevices, 
      DocumentLines, 
      invoiceData.monthlyLimit,
      calculationType,
      finalPercentage,
      maximumLimit
    );
    const {
      maxPeriod,
      grandTotal,
      grandTotalFormatted,
      firstPaymentFormatted,
      remainingAmountFormatted,
      grandTotalWordsUZ,
      grandTotalWordsRU,
      firstPaymentWordsUZ,
      firstPaymentWordsRU,
      remainingAmountWordsUZ,
      remainingAmountWordsRU,
    } = paymentData;

    // To'lov jadvalini hisoblash
    const paymentSchedule = calculatePaymentSchedule(
      selectedDevices, 
      invoiceData.monthlyLimit,
      calculationType,
      finalPercentage,
      maximumLimit
    );
    // PDF da jadvaldagi jami to'lov faqat oylik to'lovlarning yig'indisi (birinchi to'lovni hisobga olmasdan)
    const paymentScheduleTotal = paymentSchedule.reduce(
      (acc, item) => acc + (Number(item?.amount) || 0),
      0
    );
    const paymentScheduleTotalFormatted = Math.round(paymentScheduleTotal).toLocaleString('uz-UZ');

    // Sana ma'lumotlari
    const { day, month, monthRu, year } = getDateInfo();

    // IMEI ma'lumotlari
    const imei1 = DocumentLines[0]?.SerialNumbers?.[0]?.ManufacturerSerialNumber || '_______________________';
    const imei2 = DocumentLines[1]?.SerialNumbers?.[0]?.ManufacturerSerialNumber || '_______________________';
    // Telefon nomini olish - avval selectedDevices'dan, keyin DocumentLines'dan
    const itemName1 = selectedDevices[0]?.name || DocumentLines[0]?.ItemName || DocumentLines[0]?.ItemCode || '_______________________';
    const itemName2 = selectedDevices[1]?.name || DocumentLines[1]?.ItemName || DocumentLines[1]?.ItemCode || '_______________________';

    // PDF document definition
    const docDefinition = {
      pageSize: 'A4',
      pageMargins: [40, 40, 40, 40],
      defaultStyle: {
        font: 'Roboto',
        fontSize: 9,
        lineHeight: 1.2,
      },
      content: [
        // ========== SAHIFA 1: Sarlavha va kirish ==========
        {
          columns: [
            {
              width: '*',
              text: [
                { text: 'Muddatli to\'lov asosida\n', fontSize: 12, bold: true },
                { text: 'sotish-xarid qilish shartnomasi\n', fontSize: 12, bold: true },
                { text: '№ ', fontSize: 10 },
                { text: `${invoiceDocNum  || '___________________________'}\n\n`, fontSize: 10, bold: true },
                { text: 'Toshkent sh.   "', fontSize: 10 },
                { text: `${day}`, fontSize: 10, bold: true },
                { text: `" ${month} `, fontSize: 10 },
                { text: `${year}`, fontSize: 10, bold: true },
                { text: ' y.\n\n', fontSize: 10 },
                {
                  text: '«PROBOX GROUP CO» MChJ keyingi o\'rinlarda "Sotuvchi" deb ataluvchi, Ustav asosida harakat qiluvchi direktor Nigmatov O.X. nomidan, bir tomondan, va\n\n',
                  fontSize: 9,
                },
                { text: '(FISH) ', fontSize: 9 },
                { text: `${clientName || '_______________________'}\n`, fontSize: 9, bold: true },
                { text: 'pasport/id: ', fontSize: 9 },
                { text: `${passportId || '______________'}`, fontSize: 9, bold: true },
                { text: ', JSHSHIR) ', fontSize: 9 },
                { text: `${jshshir || '______________'}\n`, fontSize: 9, bold: true },
                { text: 'pasport berilgan sana)da berilgan,\n', fontSize: 9 },
                { text: '(yashash manzili) ', fontSize: 9 },
                { text: `${clientAddress || '_______________________'}\n`, fontSize: 9, bold: true },
                {
                  text: 'manzilda istiqomat qiluvchi, O\'zbekiston Respublikasi fuqarosi, keyingi o\'rinlarda "Xaridor" deb ataluvchi boshqa tomondan, ushbu shartnomani quyidagilar haqida tuzdilar:\n\n',
                  fontSize: 9,
                },
              ],
            },
            {
              width: '*',
              text: [
                { text: 'Договор купли-продажи\n', fontSize: 12, bold: true },
                { text: 'на основе рассрочки\n', fontSize: 12, bold: true },
                { text: '№ ', fontSize: 10 },
                { text: `${invoiceDocNum  || '___________________________'}\n\n`, fontSize: 10, bold: true },
                { text: 'г. Ташкент   "', fontSize: 10 },
                { text: `${day}`, fontSize: 10, bold: true },
                { text: `" ${monthRu} `, fontSize: 10 },
                { text: `${year}`, fontSize: 10, bold: true },
                { text: ' г.\n\n', fontSize: 10 },
                {
                  text: 'ООО «PROBOX GROUP CO», далее именуемое «Продавец», в лице директора Нигматова О.Х., действующего на основании Устава, с одной стороны, и гражданин Республики Узбекистан:\n\n',
                  fontSize: 9,
                },
                { text: '(ФИО) ', fontSize: 9 },
                { text: `${clientName || '_______________________'}\n`, fontSize: 9, bold: true },
                { text: 'серия и номер паспорта/id: ', fontSize: 9 },
                { text: `${passportId || '______________'}`, fontSize: 9, bold: true },
                { text: ', ЖШШИР) ', fontSize: 9 },
                { text: `${jshshir || '______________'}\n`, fontSize: 9, bold: true },
                { text: 'выдан ____________(дата выдачи),\n', fontSize: 9 },
                { text: 'проживающий по адресу: ', fontSize: 9 },
                { text: `${clientAddress || '_______________________'}\n`, fontSize: 9, bold: true },
                {
                  text: 'далее именуемый "Покупатель", с другой стороны, заключили настоящий Договор о нижеследующем:\n\n',
                  fontSize: 9,
                },
              ],
            },
          ],
          columnGap: 10,
        },

        // 1. SHARTNOMA PREDMETI
        {
          columns: [
            {
              width: '*',
              text: [
                { text: '1. SHARTNOMA PREDMETI\n', fontSize: 10, bold: true },
                {
                  text: '1.1.Sotuvchi Tovar (keyingi o\'rinlarda "Tovar" deb yuritiladi): va uning to\'plamiga kiruvchi aksessuarlarni va hujjatlari Xaridorga foydalanishi uchun topshirish, Xaridor esa Tovar qiymatini ushbu Shartnomada ko\'rsatilgan shartlarda va miqdorda to\'lash majburiyatini oladi.\n\n',
                  fontSize: 9,
                },
                { text: '1.2.Sotilgan tovar haqida ma\'lumot:\n', fontSize: 9 },
                { text: `${itemName1} `, fontSize: 9, bold: true },
                { text: 'IMEI 1 код: ', fontSize: 9 },
                { text: `${imei1}\n`, fontSize: 9, bold: true },
                {
                  text: DocumentLines.length > 1 ? `IMEI 2 код: ${imei2}\n\n` : 'IMEI 2 код: _____________________________\n\n',
                  fontSize: 9,
                },
              ],
            },
            {
              width: '*',
              text: [
                { text: '1. ПРЕДМЕТ ДОГОВОРА\n', fontSize: 10, bold: true },
                {
                  text: '1.1. Продавец обязуется передать Покупателю Товар (далее по тексту "Товар") и входящие в его состав аксессуары и документы, а Покупатель, в свою очередь, обязуется оплатить стоимость Товара на условиях настоящего Договора.\n\n',
                  fontSize: 9,
                },
                { text: '1.2. Информация о продаваемом Товаре:\n', fontSize: 9 },
                { text: `${itemName1} `, fontSize: 9, bold: true },
                { text: 'IMEI 1 код: ', fontSize: 9 },
                { text: `${imei1}\n`, fontSize: 9, bold: true },
                {
                  text: DocumentLines.length > 1 ? `IMEI 2 код: ${imei2}\n\n` : 'IMEI 2 код: _____________________________\n\n',
                  fontSize: 9,
                },
              ],
            },
          ],
          columnGap: 10,
        },

        // 2. SHARTNOMA QIYMATI VA TO'LOV TARTIBI
        {
          columns: [
            {
              width: '*',
              text: [
                { text: '2. SHARTNOMA QIYMATI VA TO\'LOV TARTIBI\n', fontSize: 10, bold: true },
                {
                  text: '2.1.Shartnoma imzolangan kunida Tovarning umumiy qiymati ',
                  fontSize: 9,
                },
                {
                  text: [
                    { text: `${grandTotalFormatted} `, bold: true },
                    { text: `(${grandTotalWordsUZ} so\'m) `, fontSize: 8, italics: true },
                    { text: 'so\'mni tashkil qiladi.\n\n', bold: true },
                  ],
                  fontSize: 9,
                },
                {
                  text: '2.2.Xaridor Tovar uchun oldindan ',
                  fontSize: 9,
                },
                {
                  text: [
                    { text: `${firstPaymentFormatted} `, bold: true },
                    { text: `(${firstPaymentWordsUZ} so\'m) `, fontSize: 8, italics: true },
                    { text: 'so\'m to\'lovni amalga oshiradi.\n\n', bold: true },
                  ],
                  fontSize: 9,
                },
                {
                  text: '2.3.Xaridor Tovarning qolgan ',
                  fontSize: 9,
                },
                {
                  text: [
                    { text: `${remainingAmountFormatted} `, bold: true },
                    { text: `(${remainingAmountWordsUZ} so\'m) `, fontSize: 8, italics: true },
                    { text: 'so\'m qiymatini ', bold: true },
                  ],
                  fontSize: 9,
                },
                {
                  text: `${maxPeriod || '_____'} oy davomida `,
                  fontSize: 9,
                  bold: true,
                },
                {
                  text: 'To\'lov jadvali (1-Ilova) buyicha to\'lov qilishga majbur.\n\n',
                  fontSize: 9,
                },
                {
                  text: `2.4.To\'lov muddati har oyning `,
                  fontSize: 9,
                },
                {
                  text: `${day}-kunida `,
                  fontSize: 9,
                  bold: true,
                },
                {
                  text: 'amalga oshiriladi.\n\n',
                  fontSize: 9,
                },
                {
                  text: '2.5. Yuqorida ko\'rsatilgan ustama miqdori Tovarning qolgan narxiga (2.3-band) nisbatan hisoblanadi. To\'lovlar teng miqdordagi (annuitet) to\'lovlar usuli buyicha hisoblanadi.\n\n',
                  fontSize: 9,
                },
                {
                  text: '2.6. Xaridor muddatidan oldin to\'liq yoki qisman to\'lovni amalga oshirish huquqiga ega. Bunda, muddatidan oldin to\'langan summa uchun oldindan shartnoma tuzilgan umumiy qiymat (2.1-band) qayta hisoblanmaydi (o\'zgartirilmaydi).\n\n',
                  fontSize: 9,
                },
                {
                  text: '2.7.Shartnoma buyicha to\'lovlar va tovarlarni sotib olishda Xaridorga nisbatan hech qanday qo\'shimcha komissiya, yig\'im yoki jarimalar (penya) qo\'llanilmaydi.\n\n',
                  fontSize: 9,
                },
                {
                  text: '2.8. Xaridor ushbu Shartnoma buyicha to\'lovlarni tasdiqlovchi cheklarni saqlashga majburdir. Aks holda, munozarali vaziyatlarda to\'lov chekni taqdim etilmasa, Xaridor tomonidan amalga oshirilgan to\'lov hisobga olinmasligi mumkin.\n\n',
                  fontSize: 9,
                },
              ],
            },
            {
              width: '*',
              text: [
                { text: '2.СТОИМОСТЬ ДОГОВОРА И ПОРЯДОК ОПЛАТЫ\n', fontSize: 10, bold: true },
                {
                  text: '2.1. На день подписания Договора общая стоимость Товара: составляет ',
                  fontSize: 9,
                },
                {
                  text: [
                    { text: `${grandTotalFormatted} `, bold: true },
                    { text: `(${grandTotalWordsRU} сум) `, fontSize: 8, italics: true },
                    { text: 'сум.\n\n', bold: true },
                  ],
                  fontSize: 9,
                },
                {
                  text: '2.2. Предоплата за Товар: ',
                  fontSize: 9,
                },
                {
                  text: [
                    { text: `${firstPaymentFormatted} `, bold: true },
                    { text: `(${firstPaymentWordsRU} сум) `, fontSize: 8, italics: true },
                    { text: 'сум.\n\n', bold: true },
                  ],
                  fontSize: 9,
                },
                {
                  text: '2.3.Оставшуюся стоимость Товара: ',
                  fontSize: 9,
                },
                {
                  text: [
                    { text: `${remainingAmountFormatted} `, bold: true },
                    { text: `(${remainingAmountWordsRU} сум) `, fontSize: 8, italics: true },
                    { text: 'сум ', bold: true },
                  ],
                  fontSize: 9,
                },
                {
                  text: 'Покупатель обязуется выплатить в течение ',
                  fontSize: 9,
                },
                {
                  text: `${maxPeriod || '_____'}месяцев `,
                  fontSize: 9,
                  bold: true,
                },
                {
                  text: 'согласно Графику платежей (Приложение 1).\n\n',
                  fontSize: 9,
                },
                {
                  text: '2.4.Срок ежемесячной оплаты Товара устанавливается на ',
                  fontSize: 9,
                },
                {
                  text: `${day}-е число `,
                  fontSize: 9,
                  bold: true,
                },
                {
                  text: 'каждого месяца.\n\n',
                  fontSize: 9,
                },
                {
                  text: '2.5.Указанная выше сумма наценки начисляется по отношению к остаточной стоимости Товара (пункт 2.3). Платежи рассчитываются по методу равных (аннуитетных) платежей.\n\n',
                  fontSize: 9,
                },
                {
                  text: '2.6. Покупатель вправе произвести полную или частичную досрочную оплату. При этом, общая стоимость договора (п.2.1), согласованная заранее, не пересчитывается (остается неизменной).\n\n',
                  fontSize: 9,
                },
                {
                  text: '2.7. При оплате и покупке Товара по Договору, в отношении Покупателя не применяются никакие дополнительные комиссии, сборы или штрафы (пени).\n\n',
                  fontSize: 9,
                },
                {
                  text: '2.8. Покупатель обязуется хранить чеки. подтверждающие оплаты по настоящему Договору. В противном случае, в спорных ситуациях, при непредоставлении чека об оплате, произведенная Покупателем оплата может быть не засчитана.\n\n',
                  fontSize: 9,
                },
              ],
            },
          ],
          columnGap: 10,
        },

        // 3. TOVAR TOPSHIRISH
        {
          columns: [
            {
              width: '*',
              text: [
                { text: '3. TOVARNI TOPSHIRISH TARTIBI\n', fontSize: 10, bold: true },
                {
                  text: '3.1.Tovarni topshirish quyidagi manzillar buyicha amalga oshiriladi:\n\n',
                  fontSize: 9,
                },
                {
                  text: '1) Toshkent shahri, Olmazor tumani, Nurafshon aylanma ko\'chasi, 1 uy, 12 xonadon.\n\n',
                  fontSize: 9,
                },
                {
                  text: '2) Toshkent shahri, Shayxontohur tumani, Koratosh ko\'chasi, 55-uy.\n\n',
                  fontSize: 9,
                },
                {
                  text: '3)Toshkent shahri Mirzo Ulug\'bek tumani Parkent ko\'chasi 195-uy 199-xonadon.\n\n',
                  fontSize: 9,
                },
                {
                  text: '3.2.Ushbu Shartnomaning 2.2.-bandida ko\'rsatilgan oldindan to\'lov amalga oshirishdan oldin Xaridor Tovarning to\'liqligi va yaroqliligini tekshirishga majbur.\n\n',
                  fontSize: 9,
                },
                {
                  text: '3.3.Oldindan to\'lovni amalga oshirishi orqali Xaridor o\'zi xarid qilgan Tovarni tanlagani tekshirib ko\'rganligi va qabul qilishga tayyorligini tasdiqlaydi.\n\n',
                  fontSize: 9,
                },
                {
                  text: '3.4.Sotuvchi ushbu Shartnoma buyicha Tovarni xaridorga oldindan to\'lovini amalga oshirgan paytdan boshlab 1 (bir) kalendar kun davomida topshiradi.\n\n',
                  fontSize: 9,
                },
                {
                  text: '3.5. Tovar tegishli hujjatlar bilan IMEI-1 ni ro\'yxatdan o\'tkazgan holda topshiradi. IMEI-2 ro\'yxatdan o\'tkazish xaridorning xohishiga ko\'ra amalga oshiriladi, agar talab etilsa Davlat standartlari asosida, ro\'yxatdan o\'tkazish uchun qo\'shimcha to\'lov qilish talab qilinadi Tovarning qutisi ushbu Shartnomaning 2.1.-bandda ko\'rsatilgan to\'liq qiymati to\'langanidan keyin Xaridorga topshiradi.\n\n',
                  fontSize: 9,
                },
                {
                  text: '3.6.Oldindan to\'lov amalga oshirgandan so\'ng, Xaridor tomonidan Tovarni qabul qilishdan turli sabablarga ko\'ra rad etilgan taqdirda, to\'langan oldindan to\'lov qaytarilmaydi.\n\n',
                  fontSize: 9,
                },
                {
                  text: '3.7.Tovarga egalik huquqi ushbu Shartnomaning 2.1-bandida ko\'rsatilgan Tovarning to\'liq qiymati to\'langan paytdan boshlab Xaridorga o\'tadi.\n\n',
                  fontSize: 9,
                },
              ],
            },
            {
              width: '*',
              text: [
                { text: '3. ПОРЯДОК ПЕРЕДАЧИ ТОВАРА\n', fontSize: 10, bold: true },
                {
                  text: '3.1. Передача Товара осуществляется по следующему адресу:\n\n',
                  fontSize: 9,
                },
                {
                  text: '1) г. Ташкент, Алмазарский район, ул. Нурафшон, 1-дом, 12-квартира.\n\n',
                  fontSize: 9,
                },
                {
                  text: '2) г. Ташкент, Шайхантахурский район, ул. Коратош, 55-дом.\n\n',
                  fontSize: 9,
                },
                {
                  text: '3)г.Ташкент, Мирзо Улугбекский район, ул. Паркент, 195-дом, 199 кв\n\n',
                  fontSize: 9,
                },
                {
                  text: '3.2. Покупатель перед оплатой предоплаты, предусмотренной п.2.2 настоящего Договора, обязуется проверить Товар на предмет комплектности и пригодности.\n\n',
                  fontSize: 9,
                },
                {
                  text: '3.3. Осуществляя предоплату, Покупатель подтверждает, что проверил выбранный Товар и готов его принять.\n\n',
                  fontSize: 9,
                },
                {
                  text: '3.4. Продавец передает Покупателю Товар в течение 1 (одного) календарного дня с момента осуществления предоплаты.\n\n',
                  fontSize: 9,
                },
                {
                  text: '3.5.Товар передаётся с соответствующими документами после регистрации IMEI-1. Регистрация IMEI-2 осуществляется по желанию покупателя. Если требуется, регистрация производится в соответствии с государственными стандартами, при этом взимается дополнительная плата. Коробка от товара передаётся покупателю после полной оплаты его стоимости, указанной в пункте 2.1 настоящего договора.\n\n',
                  fontSize: 9,
                },
                {
                  text: '3.6. В случае отказа Покупателем от принятия Товара после осуществления предоплаты уплаченная сумма предоплаты Покупателю не возвращается.\n\n',
                  fontSize: 9,
                },
                {
                  text: '3.7. Право собственности на Товар переходит к Покупателю с момента оплаты полной стоимости Товара, указанной в п.2.1 настоящего Договора.\n\n',
                  fontSize: 9,
                },
              ],
            },
          ],
          columnGap: 10,
        },

        // 4. TOMONLARNING HUQUQ VA MAJBURIYATLARI
        {
          columns: [
            {
              width: '*',
              text: [
                { text: '4. TOMONLARNING HUQUQ VA MAJBURIYATLARI\n', fontSize: 10, bold: true },
                { text: '4.1.Sotuvchining majburiyatlari:\n', fontSize: 9, bold: true },
                {
                  text: '4.1.1. Tovarni sotish vaqtida O\'zbekiston Respublikasining qonun hujjatlari tomonidan belgilangan talablarga javob beradigan mahsulot haqidagi zarur va ishonchli ma\'lumotlarni xaridorga taqdim etish.\n\n',
                  fontSize: 9,
                },
                {
                  text: '4.1.2. Ushbu Shartnomaning 3.4-bandida ko\'rsatilgan muddatda Tovarni topshirish.\n\n',
                  fontSize: 9,
                },
                {
                  text: '4.1.3. Tegishli sifatdagi Tovarni topshirish.\n\n',
                  fontSize: 9,
                },
                { text: '4.2.Sotuvchining huquqlari:\n', fontSize: 9, bold: true },
                {
                  text: '4.2.1. Ushbu Shartnomaning shartlariga muvofiq Tovar uchun o\'z vaqtida to\'lovni talab qilish.\n\n',
                  fontSize: 9,
                },
                {
                  text: '4.2.2. Sotuvchi Xaridordan Tovarni qaytarib olish huquqiga ega. Bunda, Sotuvchi oldin Xaridor tomonidan to‘langan pul miqdoridan faqat Tovardan foydalanilganlik uchun to‘lovni, shuningdek, shartnomani bekor qilish munosabati bilan yuzaga kelgan real zararni (foydadan mahrum bo‘lishdan tashqari) ushlab qolishga haqli. Qolgan summa Xaridorga 10 (o‘n) ish kuni ichida qaytariladi.\n\n',
                  fontSize: 9,
                },
                { text: '4.3.Xaridorning majburiyatlari:\n', fontSize: 9, bold: true },
                {
                  text: '4.3.1. Ushbu Shartnoma buyicha to\'lovlarni o\'z vaqtida amalga oshirish.\n\n',
                  fontSize: 9,
                },
                {
                  text: '4.3.2. Makur shartnomaning 2.2-banida ko\'rsatilgan oldindan to\'lov amalga oshirishdan so\'ng Tovarni qabul qilish.\n\n',
                  fontSize: 9,
                },
                {
                  text: '4.3.3. Tovarni ushbu Shartnomaning 2.1.-bandida ko\'rsatilgan Tovarning umumiy qiymati to\'lamasdan uchinchi shaxsga o\'tkazmaslik.\n\n',
                  fontSize: 9,
                },
                {
                  text: '4.3.4. Mijoz tomonidan shartnomada belgilangan to\'lovlarning to\'liq amalga oshirilishi natijasida qarzdorlik bartaraf etilgach, mijoz mahsulotning original qutisini 3 (uch) kalendar oy ichida olib ketishi shart. Xaridordan bu jarayonda shaxsni tasdiqlovchi hujjat talab etiladi. Agar mijoz ushbu muddat ichida qutini olib ketmasa, 3 oydan ortiq saqlangan qutilar utilizatsiya qilinadi va mijoz bu borada hech qanday da\'vo yoki e\'tiroz bildirish huquqiga ega emas.\n\n',
                  fontSize: 9,
                },
                { text: '4.4.Xaridorning huquqlari:\n', fontSize: 9, bold: true },
                {
                  text: '4.4.1. Tovarni sotib olish vaqtida O\'zbekiston Respublikasining qonun hujjatlari tomonidan belgilangan talablarga javob beradigan mahsulot haqidagi zarur va ishonchli ma\'lumotlarni talab qilish.\n\n',
                  fontSize: 9,
                },
                {
                  text: '4.4.2. Tovarni qabul qilishdan oldin uning funksiyalarini tekshirishni yoki agar bu Tovarning xususiyatiga ko\'ra istisno qilinmasa Tovardan foydalanishni ko\'rsatib berishni talab qilish.\n\n',
                  fontSize: 9,
                },
                {
                  text: '4.4.3. Ushbu Shartnomaning 5-bobida belgilangan shartlariga muvofiq kafolat holati yuzaga kelgan taqdirda, nosozliklarni bartaraf etishni talab qilish.\n\n',
                  fontSize: 9,
                },
              ],
            },
            {
              width: '*',
              text: [
                { text: '4. ПРАВА И ОБЯЗАННОСТИ СТОРОН\n', fontSize: 10, bold: true },
                { text: '4.1. Обязанности Продавца:\n', fontSize: 9, bold: true },
                {
                  text: '4.1.1. При реализации товара предоставить Покупателю необходимую и достоверную информацию о Товаре, отвечающую требованиям норм законодательства Республики Узбекистан.\n\n',
                  fontSize: 9,
                },
                {
                  text: '4.1.2. Передать Товар в сроки, установленные п.3.4 настоящего Договора.\n\n',
                  fontSize: 9,
                },
                {
                  text: '4.1.3. Передать Товар надлежащего качества.\n\n',
                  fontSize: 9,
                },
                { text: '4.2. Права Продавца:\n', fontSize: 9, bold: true },
                {
                  text: '4.2.1. Требовать своевременной оплаты Товара на условиях настоящего Договора.\n\n',
                  fontSize: 9,
                },
                {
                  text: '4.2.2. Продавец имеет право изъять Товар у Покупателя. При этом, Продавец вправе удержать из ранее оплаченной Покупателем суммы только плату за использование Товара, а также реальный ущерб, возникший в связи с расторжением договора (за исключением упущенной выгоды). Оставшаяся сумма возвращается Покупателю в течение 10 (десяти) рабочих дней.\n\n',
                  fontSize: 9,
                },
                { text: '4.3. Обязанности Покупателя:\n', fontSize: 9, bold: true },
                {
                  text: '4.3.1. Своевременно осуществлять платежи по настоящему Договору.\n\n',
                  fontSize: 9,
                },
                {
                  text: '4.3.2. Принять Товар после проведения предоплаты, указанной в п.2.2. настоящего Договора.\n\n',
                  fontSize: 9,
                },
                {
                  text: '4.3.3. Не передавать Товар третьим лицам до момента полной оплаты стоимости Товара, указанной в п.2.1. настоящего Договора.\n\n',
                  fontSize: 9,
                },
                {
                  text: '4.3.4. После полного исполнения клиентом обязательств по оплате, указанных в контракте, и погашения задолженности, клиент обязан забрать оригинальную упаковку товара в течение 3 (трех) календарных месяцев. От покупателя в этом процессе требуется удостоверяющий личность документ. В случае, если клиент не заберет упаковку в указанный срок, упаковки, хранящиеся более 3 месяцев, подлежат утилизации, и клиент не имеет права предъявлять какие-либо претензии или возражения по данному поводу.\n\n',
                  fontSize: 9,
                },
                { text: '4.4. Права Покупателя:\n', fontSize: 9, bold: true },
                {
                  text: '4.4.1. При покупке Товара требовать необходимую и достоверную информацию о Товаре, отвечающую требованиям норм законодательства Республики Узбекистан.\n\n',
                  fontSize: 9,
                },
                {
                  text: '4.4.2.Требовать проверки функциональности Продукта перед его приемкой или демонстрации использования Продукта, если это не исключается из-за характера Продукта.\n\n',
                  fontSize: 9,
                },
                {
                  text: '4.4.3. В случае возникновения гарантийного случая в соответствии с условиями раздела 5 настоящего Договора, требовать исправления неполадок.\n\n',
                  fontSize: 9,
                },
              ],
            },
          ],
          columnGap: 10,
        },

        // 5. KAFOLAT
        {
          columns: [
            {
              width: '*',
              text: [
                { text: '5. KAFOLAT\n', fontSize: 10, bold: true },
                { text: '5.1.Tovarning kafolat muddati:\n', fontSize: 9 },
                { text: '- yangi Tovar uchun – 1 (bir) oy;\n', fontSize: 9 },
                { text: '- ishlatilgan Tovar uchun – 1 (bir) hafta tashil etadi.\n\n', fontSize: 9 },
                {
                  text: '5.2.Ushbu Shartnomaning 5.1 -bandida ko\'rsatilgan kafolat muddati Tovar Xaridorga topshirilgan paytdan boshlab hisoblanadi.\n\n',
                  fontSize: 9,
                },
                {
                  text: '5.3.Tomonlar ushbu Shartnoma buyicha sotilgan tovarning kafolati deganda Toshkent shahridagi rasmiy xizmat ko\'rsatish markazida texnik ta\'mirlash tushuniladi.\n\n',
                  fontSize: 9,
                },
                {
                  text: '5.4.Agar xaridorning aybi bilan emas, balki ishlab chiqaruvchining aybi bilan kafolat holati yuzaga kelsa, Sotuvchi zarur maslahatlarni beradi va tovarni xizmat ko\'rsatish va nosozliklarni bartaraf etish uchun xizmat ko\'rsatish markaziga topshirishni tashkilashtiradi..\n\n',
                  fontSize: 9,
                },
                {
                  text: '5.5.Ushbu Shartnomada kafolat holati deganda quyidagilarni tushuniladi:\n',
                  fontSize: 9,
                },
                {
                  text: '- ishlab chiqaruvchi aybi tufayli yuzaga kelgan Tovarning nosozliklar;\n',
                  fontSize: 9,
                },
                {
                  text: '- ishlab chiqaruvchi aybi tufayli Tovardan maqsadli foydalanishning mumkin emasligi;\n',
                  fontSize: 9,
                },
                {
                  text: '- ishlab chiqaruvchi aybi tufayli Tovarning ishlamasligi.\n\n',
                  fontSize: 9,
                },
                {
                  text: '5.6.Xaridor Tovarni boshqa maqsadlarda ishlatilgan yoki uni ishlab chiqaruvchining ko\'rsatmalaridan farqli ravishda ishlatilgan taqdirda, Sotuvchi Xaridor oldida hech qanday kafolat majburiyatlarini o\'z zimmasiga olmaydi.\n\n',
                  fontSize: 9,
                },
                {
                  text: '5.7.Yuqorida ko\'rsatilgan holatlarga qo\'shimcha ravishda, Sotuvchi Xaridorga nosozlik sabablaridan qat\'iy nazar, yangi Tovarni 10 000 000 (o\'n million) so\'mgacha bo\'lgan bir martalik texnik ta\'mirlash xizmatini taqdim etadi. Texnik ta\'mirlash xizmati   3 (uch) ish kunidan 14 (o\'n to\'rt) ish kunigacha ko\'rsatiladi.\n\n',
                  fontSize: 9,
                },
              ],
            },
            {
              width: '*',
              text: [
                { text: '5. ГАРАНТИЯ\n', fontSize: 10, bold: true },
                { text: '5.1. Гарантийный срок на Товар:\n', fontSize: 9 },
                { text: '- на новый Товар – 1 (один) месяц;\n', fontSize: 9 },
                { text: '- на Товар, бывший в употреблении 1 (одна) неделя.\n\n', fontSize: 9 },
                {
                  text: '5.2. Гарантийный рок, указанный в п.5.1. настоящего Договора считается с момента передачи Товара Покупателю.\n\n',
                  fontSize: 9,
                },
                {
                  text: '5.3. Гарантия товара, реализуемого сторонами по настоящему Договору, подразумевает технический ремонт в официальном сервисном центре в г. Ташкент.\n\n',
                  fontSize: 9,
                },
                {
                  text: '5.4. В случае возникновения гарантийной ситуации по вине производителя, а не Покупателя, Продавец предоставит необходимую консультацию и организует передачу Товара в сервисный центр для обслуживания и устранения неполадок.\n\n',
                  fontSize: 9,
                },
                {
                  text: '5.5. По смыслу настоящего Договора гарантийный случай подразумевает следующее:\n',
                  fontSize: 9,
                },
                {
                  text: '- неполадки Товара, возникшие по вине производителя;\n',
                  fontSize: 9,
                },
                {
                  text: '- невозможность использования Товара по назначению по вине производителя;\n',
                  fontSize: 9,
                },
                {
                  text: '- выход из строя Товара по вине производителя.\n\n',
                  fontSize: 9,
                },
                {
                  text: '5.6. В случае, если Покупатель использует Товар не по назначению или использует его вопреки указаниям производителя, Продавец не несет перед Покупателем никаких гарантийных обязательств.\n\n',
                  fontSize: 9,
                },
                {
                  text: '5.7. Помимо случаев, указанных выше, Продавец предоставляет Покупателю разовое техническое ремонтное обслуживание новые Товара на сумму до 10 000 000 (десяти миллионов) сум вне зависимости от причины неполадки. Услуга технического ремонта предоставляется от 3 (трех) рабочих дней до 14 (четырнадцати) рабочих дней.\n\n',
                  fontSize: 9,
                },
              ],
            },
          ],
          columnGap: 10,
        },

        // 6. TOMONLARNING JAVOBGARLIGI
        {
          columns: [
            {
              width: '*',
              text: [
                { text: '6. TOMONLARNING JAVOBGARLIGI\n', fontSize: 10, bold: true },
                {
                  text: '6.1.Ushbu Shartnoma buyicha majburiyatlarni bajarmaganlik yoki lozim darajada bajarmaganlik uchun tomonlar O\'zbekiston Respublikasining amaldagi qonun hujjatlari muvofiq javobgar bo\'ladilar.\n\n',
                  fontSize: 9,
                },
                {
                  text: '6.2.Ushbu Shartnoma buyicha Xaridor tomonidan to\'lovlarni o\'z vaqtida amalga oshirilmagan taqdirida Sotuvchi quyidagi chorani ko\'rish mumkin:\n\n',
                  fontSize: 9,
                },
                {
                  text: '6.2.1. Sotuvchi Xaridorga to\'lov muddati yaqinlashganini yoki kechikkanini quyidagi usullar bilan eslatish huquqiga ega:\n',
                  fontSize: 9,
                },
                {
                  text: 'To\'lov sanasidan 3 (uch) kun oldin SMS-xabarnoma yuborishi (ixtiyoriy). To\'lov sanasi kuni va undan keyingi 1 (bir) kun ichida telefon orqali qo\'ng\'iroq qilishi.\n\n',
                  fontSize: 9,
                },
                {
                  text: '6.2.2. To\'lov sanasidan keyingi 5 (besh) kun ichida telefon orqali aloqa o\'rnatish imkoni bo\'lmasa, Sotuvchi xodimlari qarzni muzokara yo\'li bilan hal qilish uchun (imkon bo\'lgan hududlarda) Xaridorning yashash joyiga tashrif buyurishi mumkin.\n\n',
                  fontSize: 9,
                },
                {
                  text: '6.2.3. Ushbu Shartnoma buyicha muddati o\'tgan to\'lovlarni Xaridorning shartnomada ko\'rsatilgan bank kartalaridan akseptsiz ravishda hisobdan chiqarish huquqi Sotuvchida mavjud. Xaridor Shartnomani imzolash orqali bunga rozilik bildiradi.\n\n',
                  fontSize: 9,
                },
                {
                  text: '6.3. Agar Xaridor to\'lovni 3 (uch) kalendar kuni ichida amalga oshirmasa, unga "iCloud" tizimi orqali ogohlantiruvchi xabarnoma yuboriladi.\n\n',
                  fontSize: 9,
                },
                {
                  text: '6.3.1. Agar Xaridor Tovar uchun to\'lovni belgilangan kundan 4 (to\'rt) kalendar kun kechiktirsa, mobil qurilma (Tovar) qonunchilikda ruxsat etilgan tartibda "iCloud" va/yoki "IMEI" tizimi orqali bloklash haqida ogohlantiriladi va Sotuvchi IMEI tizimi orqali bloklash jarayonini boshlaydi.\n\n',
                  fontSize: 9,
                },
                {
                  text: '6.3.2.Muddati o\'tgan to\'lov amalga oshirilgandan so\'ng 48 (qirq sakkiz) soat ichida mobil qurilma (Tovar) "IMEI" tizimi orqali blokdan ochiladi.\n\n',
                  fontSize: 9,
                },
                {
                  text: '6.3.3. Xaridor "iCloud" orqali bloklash natijasida ma\'lumotlarning avtomatik o\'chirilishi mumkinligidan ogohlantiriladi va to\'lov majburiyatini bajarmaganligi sababli, ma\'lumotlarning yo\'qotilishi uchun javobgarlikni o\'z zimmasiga oladi.\n\n',
                  fontSize: 9,
                },
                {
                  text: '6.3.4. Sotuvchi "iCloud" va "IMEI" tizimlaridan faqat shartnoma shartlarini buzgan Xaridorlarni aniqlash va bloklash maqsadida foydalanishini kafolatlaydi. Sotuvchi Tovar narxini to\'liq to\'lagandan so\'ng, ushbu tizimlardan foydalanmasligka va Xaridorning shaxsiy ma\'lumotlariga kirish huquqiga ega emasligini kafolatlaydi.\n\n',
                  fontSize: 9,
                },
                {
                  text: '6.4.1. Agar Xaridor ikki yoki undan ortiq tovar (mobil telefon va gadjetlar) sotib olsa va ulardan biri buyicha to\'lovni kechiktirsa yoki amalga oshirmasa, barcha sotib olingan tovarlar (shu jumladan, to\'lovi to\'liq amalga oshirilgan mobil telefon ham) kompaniya tomonidan bloklanishi mumkin.\n\n',
                  fontSize: 9,
                },
                {
                  text: '6.4.2. Barcha mahsulotlar blokdan chiqarilishi uchun barcha mahsulotlar buyicha qarzdorlikning to\'liq to\'lanishi zarur.\n\n',
                  fontSize: 9,
                },
                {
                  text: '6.5.1. Agar Xaridor tomonidan Tovar uchun oylik to‘lovlar ketma-ket 2 (ikki) marta yoki Shartnomaning butun amal qilish muddati davomida umumiy 3 (uch) marta 7 (yetti) kalendar kunidan ortiq muddatga kechiktirilsa, Sotuvchi Shartnomani bir tomonlama bekor qilish huquqiga ega.\n\n',
                  fontSize: 9,
                },
                {
                  text: '6.5.2. Agar bloklash chorasi (6.2-band) qo\'llanilgandan so\'ng 3 (uch) kalendar kun ichida ham to\'lov amalga oshirilmasa yoki nizo hal etilmasa (ya\'ni, to\'lov sanasidan 7 kun o\'tsa), Sotuvchi shartnomani bir tomonlama bekor qilish to\'g\'risida Xaridorga yozma xabar yuborishga haqli va nizo sud orqali hal qilinadi.\n\n',
                  fontSize: 9,
                },
                {
                  text:'6.5.3. Ushbu Shartnoma Sotuvchi tomonidan 6.5.1-band asosida bekor qilingan taqdirda, Xaridorning Tovar bo‘yicha to‘lanmagan butun qolgan asosiy qarz summasi muddatidan oldin undiruvga qaratiladi. Bunda 7-bo‘limga muvofiq qayta hisob-kitob amalga oshiriladi.\n\n',
                  fontSize: 9,
                },
                {
                  text: '6.6.1. Agar Xaridor tomonidan Tovar uchun oylik to\'lovlar 7 (etti) kalendar kunidan ortiq muddatga kechiktirilsa va bloklash mexanizmlari ishga solgan bo\'lsa-da, qarzdorlik bartaraf etilmasa:\n',
                  fontSize: 9,
                },
                {
                  text: 'Sotuvchi, Xaridorning yozma arizasi yoki og\'zaki roziligi asosida, Shartnomani to\'liq bekor qilish o\'rniga, Tovarni faqat vaqtinchalik saqlash uchun olib qo\'yish huquqiga ega.\n',
                  fontSize: 9,
                },
                {
                  text: 'Ushbu vaqtinchalik olib qo\'yish Xaridorning qolgan qarzdorlikni to\'lash majburiyati saqlanib qolishini tasdiqlaydi.\n\n',
                  fontSize: 9,
                },
                {
                  text: '6.6.2. Tovar vaqtinchalik olib qo\'yilgan vaqtda, Xaridor qarzdorlikni bartaraf etish majburiyatini saqlab qoladi. Barcha qarzdorlik to\'liq yopilgan kundan boshlab, Sotuvchi Tovarni 3 (uch) ish kuni ichida Xaridorga qaytarishga majbur.\n\n',
                  fontSize: 9,
                },
                {
                  text: '6.6.3. Agar Tovar vaqtinchalik olib qo\'yilgan kundan boshlab 30 (o\'ttiz) kalendar kun ichida Xaridor qarzdorlikni to\'liq bartaraf etmasa, ushbu vaqtinchalik olib qo\'yish avtomatik ravishda Shartnomani to\'liq bekor qilish sifatida tan olinadi va qayta hisob-kitob qilish jarayoni boshlanadi. Bu Shartnomani bir tomonlama bekor qilish uchun eng uzoq muddat (jami 37 kun) hisoblanadi.\n\n',
                  fontSize: 9,
                },
                {
                  text: '6.7.1. Agar Xaridor Tovarni uchinchi shaxslarga topshirsa yoki biror sababga ko\'ra o\'z egaligidan yo\'qotsa, Tovarni to\'lash majburiyati Xaridorda qoladi.\n\n',
                  fontSize: 9,
                },
                {
                  text: '6.7.2. Xaridor vafot etgan taqdirda, ushbu Shartnoma buyicha uning majburiyatlari qonun yoki vasiyatnoma buyicha merosxo\'rlariga o\'tadi.\n\n',
                  fontSize: 9,
                },
                {
                  text: '6.7.3. Yuqoridagi chorasi Sotuvchining ixtiyoriga ko\'ra amalga oshiriladi va ulardan birini qo\'llash qonun hujjatlarida nazarda tutilgan boshqa chorani qo\'llashni cheklamaydi.\n\n',
                  fontSize: 9,
                },
              ],
            },
            {
              width: '*',
              text: [
                { text: '6. ОТВЕТСТВЕННОСТЬ СТОРОН\n', fontSize: 10, bold: true },
                {
                  text: '6.1. За неисполнение или ненадлежащее исполнение обязательств по настоящему Договору стороны несут ответственность в соответствии с действующим законодательством Республики Узбекистан.\n\n',
                  fontSize: 9,
                },
                {
                  text: '6.2. В случае несвоевременного осуществления платежей Покупателем по настоящему Договору Продавец вправе принять следующие меры:\n\n',
                  fontSize: 9,
                },
                {
                  text: '6.2.1. Продавец имеет право напоминать Покупателю о приближении срока платежа или о его просрочке следующими способами:\n',
                  fontSize: 9,
                },
                {
                  text: '– за 3 (три) календарных дня до даты платежа направить SMS-уведомление;\n',
                  fontSize: 9,
                },
                {
                  text: '– в день платежа и в течение 1 (одного) дня после него позвонить Покупателю по телефону.\n\n',
                  fontSize: 9,
                },
                {
                  text: '6.2.2. Если в течение 5 (пяти) календарных дней после даты платежа не удаётся установить телефонный контакт с Покупателем, сотрудники Продавца могут (в регионах, где это возможно) посетить место проживания Покупателя для урегулирования задолженности путем переговоров.\n\n',
                  fontSize: 9,
                },
                {
                  text: '6.2.3. Продавец имеет право списывать просроченные платежи по настоящему Договору с банковских карт Покупателя, указанных в договоре, без акцепта. Подписывая Договор, Покупатель выражает согласие на это.\n\n',
                  fontSize: 9,
                },
                {
                  text: '6.3. Если Покупатель не произведет оплату в течение 3 (трёх) календарных дней, ему направляется уведомление через систему «iCloud».\n\n',
                  fontSize: 9,
                },
                {
                  text: '6.3.1. Если Покупатель задерживает оплату за Товар более чем на 4 (четыре) календарных дня с установленной даты, он уведомляется о возможности блокировки мобильного устройства (Товара) через системы «iCloud» и/или «IMEI» в порядке, разрешённом законодательством, после чего Продавец инициирует процесс блокировки через систему IMEI.\n\n',
                  fontSize: 9,
                },
                {
                  text: '6.3.2. После осуществления просроченного платежа мобильное устройство (Товар) разблокируется через систему IMEI в течение 48 (сорока восьми) часов.\n\n',
                  fontSize: 9,
                },
                {
                  text: '6.3.3. Покупатель уведомляется, что в результате блокировки через «iCloud» возможно автоматическое удаление данных, и принимает на себя ответственность за утрату данных, произошедшую из-за неисполнения обязательства по оплате.\n\n',
                  fontSize: 9,
                },
                {
                  text: '6.3.4. Продавец гарантирует использование систем «iCloud» и «IMEI» исключительно для выявления и блокировки Покупателей, нарушивших условия договора. Продавец обязуется не использовать эти системы и не иметь доступа к личным данным Покупателя после полной оплаты стоимости Товара.\n\n',
                  fontSize: 9,
                },
                {
                  text: '6.4.1. Если Покупатель приобрел два и более товара (мобильные телефоны и гаджеты) и допустил просрочку или неоплату хотя бы по одному из них, Продавец имеет право заблокировать все приобретённые товары, включая полностью оплаченные устройства.\n\n',
                  fontSize: 9,
                },
                {
                  text: '6.4.2. Разблокировка всех товаров производится только после полного погашения задолженности по всем приобретённым товарам.\n\n',
                  fontSize: 9,
                },
                {
                  text: '6.5.1. Если Покупатель задерживает ежемесячные платежи за Товар подряд 2 (два) раза или в общей сложности 3 (три) раза в течение всего срока действия Договора более чем на 7 (семь) календарных дней, Продавец имеет право в одностороннем порядке расторгнуть Договор.\n\n',
                  fontSize: 9,
                },
                {
                  text: '6.5.2. Если после применения мер блокировки (пункт 6.2) в течение 3 (трёх) календарных дней оплата не поступит или спор не будет урегулирован (т.е. по истечении 7 дней с даты платежа), Продавец вправе направить Покупателю письменное уведомление о расторжении договора в одностороннем порядке и передать спор на рассмотрение суда.\n\n',
                  fontSize: 9,
                },
                {
                  text: '6.5.3. В случае расторжения Договора Продавцом на основании пункта 6.5.1, вся оставшаяся неоплаченная основная сумма задолженности Покупателя по Товару подлежит досрочному взысканию. При этом производится перерасчет в соответствии с разделом 7 настоящего Договора.\n\n',
                  fontSize: 9,
                },
                {
                  text: '6.6.1. Если ежемесячные платежи по Товару задерживаются более чем на 7 (семь) календарных дней и, несмотря на применение мер блокировки, задолженность не погашена:\n',
                  fontSize: 9,
                },
                {
                  text: 'Продавец имеет право, на основании письменного заявления или устного согласия Покупателя, вместо полного расторжения договора временно изъять Товар для хранения.\n',
                  fontSize: 9,
                },
                {
                  text: 'Такое временное изъятие подтверждает, что обязанность Покупателя по погашению задолженности сохраняется.\n\n',
                  fontSize: 9,
                },
                {
                  text: '6.6.2. Во время временного изъятия Товара Покупатель сохраняет обязанность по погашению задолженности. После полного погашения долга Продавец обязан вернуть Товар Покупателю в течение 3 (трёх) рабочих дней.\n\n',
                  fontSize: 9,
                },
                {
                  text: '6.6.3. Если в течение 30 (тридцати) календарных дней с момента временного изъятия Товара Покупатель не погасит задолженность полностью, такое временное изъятие автоматически считается полным расторжением договора, и начинается процедура взаиморасчётов. Это считается максимальным сроком одностороннего расторжения договора (всего 37 дней).\n\n',
                  fontSize: 9,
                },
                {
                  text: '6.7.1. Если Покупатель передаст Товар третьим лицам или по какой-либо причине утратит владение им, обязательство по оплате Товара остаётся за Покупателем.\n\n',
                  fontSize: 9,
                },
                {
                  text: '6.7.2. В случае смерти Покупателя его обязательства по настоящему Договору переходят к наследникам в соответствии с законом или завещанием.\n\n',
                  fontSize: 9,
                },
                {
                  text: '6.7.3. Перечисленные выше меры применяются по усмотрению Продавца и не ограничивают право Продавца применять иные меры, предусмотренные законодательством.\n\n',
                  fontSize: 9,
                },
              ],
            },
          ],
          columnGap: 10,
        },

        // 7. TOVARNI QAYTARISH VA MOLIYAVIY HISOB-KITOBB
        {
          columns: [
            {
              width: '*',
              text: [
                { text: '7. TOVARNI QAYTARISH VA MOLIYAVIY HISOB-KITOBB TAMOYILI\n', fontSize: 10, bold: true },
                {
                  text: '7.1. Tovarni qaytarish va shu asosda Shartnoma buyicha hisob-kitob qilish quyidagi holatlarda amalga oshiriladi:\n',
                  fontSize: 9,
                },
                {
                  text: 'а) Xaridor moliyaviy qiynchiliklar sababli Shartnoma muddati tugashidan oldin Tovarni qaytarish va Shartnomani bekor qilish tashabbusini Sotuvchiga yozma ravishda bildirganda.\n',
                  fontSize: 9,
                },
                {
                  text: 'б) Sotuvchi Xaridor to\'lov intizomini qat\'iy buzganligi sababli Tovarni olib qo\'ygan va sotishga haqli bo\'lganda.\n\n',
                  fontSize: 9,
                },
                {
                  text: '7.2. 7.1-bandning (а) kichik bandi asosida qaytarilgan taqdirda, Xaridor Tovarni o\'z hisobidan 5 (besh) ish kuni ichida Sotuvchi ko\'rsatgan manzilga yetkazib berish majburiyatini oladi.\n\n',
                  fontSize: 9,
                },
                {
                  text: '7.3.Sotuvchi qaytarib olingan Tovarni qaytarish kunidagi bozor qiymatida (Tovarning holati, eskirish darajasi va nuqsonlarini hisobga olgan holda, tarafning o\'zaro kelishuvi yoki mustaqil baholovchi asosida) hisob-kitob qilishga majbur.\n\n',
                  fontSize: 9,
                },
                {
                  text: '7.4. Hisob-kitob quyidagi tartibda amalga oshiriladi:\n',
                  fontSize: 9,
                },
                {
                  text: 'Tovarning qayta sotib olish qiymatidan avvalo Xaridorning Sotuvchi oldidagi umumiy qarzi qoplanadi. Agar qayta sotib olish qiymati qarzdan yuqori bo\'lsa, ortgan mablag\' 10 (o\'n) ish kuni ichida Xaridorga qaytariladi. Agar qayta sotib olish qiymati qarzni to\'liq qoplamasa, yetishmayotgan qismi (Sotuvchining zarari) Xaridor tomonidan 3 (uch) ish kuni ichida qoplab beriladi.\n\n',
                  fontSize: 9,
                },
              ],
            },
            {
              width: '*',
              text: [
                { text: '7. ПРИНЦИП ВОЗВРАТА ТОВАРА И ФИНАНСОВОГО РАСЧЕТА\n', fontSize: 10, bold: true },
                {
                  text: '7.1. Возврат Товара и, на его основе, расчет по Договору осуществляются в следующих случаях:\n',
                  fontSize: 9,
                },
                {
                  text: 'а) Когда Покупатель по причине финансовых затруднений инициирует письменное уведомление Продавца о желании вернуть Товар и расторгнуть Договор до истечения его срока.\n',
                  fontSize: 9,
                },
                {
                  text: 'б) Когда Продавец изымает Товар и имеет право на его продажу по причине строгого нарушения Покупателем платежной дисциплины.\n\n',
                  fontSize: 9,
                },
                {
                  text: '7.2. При возврате на основании подпункта (а) пункта 7.1, Покупатель обязан доставить Товар за свой счет по адресу, указанному Продавцом, в течение 5 (пяти) рабочих дней.\n\n',
                  fontSize: 9,
                },
                {
                  text: '7.3. Продавец обязан произвести расчет возвращенного Товара по его рыночной стоимости на дату возврата (с учетом состояния, степени износа и дефектов Товара, на основании взаимного соглашения сторон или независимого оценщика).\n\n',
                  fontSize: 9,
                },
                {
                  text: '7.4. Расчет осуществляется в следующем порядке:\n',
                  fontSize: 9,
                },
                {
                  text: 'Из стоимости обратного выкупа Товара в первую очередь погашается общая задолженность Покупателя перед Продавцом. Если стоимость обратного выкупа превышает задолженность, разница возвращается Покупателю в течение 10 (десяти) рабочих дней.\n',
                  fontSize: 9,
                },
                {
                  text: 'Если стоимость обратного выкупа не покрывает задолженность полностью, недостающая часть (убыток Продавца) покрывается Покупателем в течение 3 (трех) рабочих дней.\n\n',
                  fontSize: 9,
                },
              ],
            },
          ],
          columnGap: 10,
        },

        // 8. MAXFIYLIK VA SHAXSIY MA'LUMOTLARNI HIMOYA QILISH
        {
          columns: [
            {
              width: '*',
              text: [
                { text: '8. MAXFIYLIK VA SHAXSIY MA\'LUMOTLARNI HIMOYA QILISH\n', fontSize: 10, bold: true },
                {
                  text: '8.1. Taraf ushbu Shartnoma shartlarini, jumladan Tovar narxi, moliyaviy hisob-kitoblar va To\'lov jadvali ma\'lumotlarini maxfiy deb hisoblaydilar va qonunchilikda belgilangan holatlardan tashqari, uchinchi shaxslarga oshkor qilmaslik majburiyatini oladilar.\n\n',
                  fontSize: 9,
                },
                {
                  text: '8.2. Xaridor ushbu Shartnomani imzolash orqali, Sotuvchiga o\'z shaxsiy ma\'lumotlarini (F.I.Sh., pasport/ID ma\'lumotlari, JSHSHIR, yashash manzili, telefon raqami va boshqalar) O\'zbekiston Respublikasining "Shaxsiy ma\'lumotlar to\'g\'risida"gi Qonuni talablariga muvofiq qayta ishlash, saqlash va foydalanishga o\'z roziligini beradi.\n\n',
                  fontSize: 9,
                },
                {
                  text: '8.3.Sotuvchi Xaridorning shaxsiy ma\'lumotlaridan faqat quyidagi maqsadlarda foydalanish huquqiga ega:\n',
                  fontSize: 9,
                },
                {
                  text: 'Shartnoma buyicha majburiyatlarni bajarish (Tovarni yetkazib berish, to\'lovlarni hisobga olish, kafolat xizmati);\n',
                  fontSize: 9,
                },
                {
                  text: 'Xaridorning to\'lov intizomi va kredit tarixini baholash va monitoring qilish.\n\n',
                  fontSize: 9,
                },
                {
                  text: '8.4. Xaridor, shuningdek, Sotuvchiga ushbu Shartnoma buyicha to\'lov intizomi, muddati o\'tgan qarzdorlik yoki Shartnomaning bajarilishi haqidagi ma\'lumotlarni O\'zbekiston Respublikasida faoliyat yurituvchi Kredit axborotlari byurolariga (shu jumladan, "Kredit axboroti almashinuvi to\'g\'risida"gi Qonunga asosan) uzatishga va qayta ishlashga to\'liq rozilik beradi.\n\n',
                  fontSize: 9,
                },
                {
                  text: '8.5. Sotuvchi Shaxsiy ma\'lumotlarning ruxsatsiz kirish, o\'zgartirish yoki yo\'q qilinishdan himoya qilinishini ta\'minlash uchun zarur tashkiliy va texnik chorani ko\'rish majburiyatini oladi.\n\n',
                  fontSize: 9,
                },
              ],
            },
            {
              width: '*',
              text: [
                { text: '8. КОНФИДЕНЦИАЛЬНОСТЬ И ЗАЩИТА ПЕРСОНАЛЬНЫХ ДАННЫХ\n', fontSize: 10, bold: true },
                {
                  text: '8.1.Стороны считают условия настоящего Договора, включая цену Товара, финансовые расчеты и данные Графика Платежей, конфиденциальными и обязуются не разглашать их третьим лицам, за исключением случаев, установленных законодательством.\n\n',
                  fontSize: 9,
                },
                {
                  text: '8.2. Покупатель, подписывая настоящий Договор, дает свое согласие Продавцу на обработку, хранение и использование своих персональных данных (Ф.И.О., паспортные/ID данные, ЖШШИР, адрес проживания, номер телефона и прочее) в соответствии с требованиями Закона Республики Узбекистан "О персональных данных".\n\n',
                  fontSize: 9,
                },
                {
                  text: '8.3. Продавец имеет право использовать персональные данные Покупателя исключительно в следующих целях:\n',
                  fontSize: 9,
                },
                {
                  text: 'Исполнение обязательств по Договору (доставка Товара, учет платежей, гарантийное обслуживание);\n',
                  fontSize: 9,
                },
                {
                  text: 'Оценка и мониторинг платежной дисциплины и кредитной истории Покупателя.\n\n',
                  fontSize: 9,
                },
                {
                  text: '8.4. Покупатель также дает полное согласие Продавцу на передачу и обработку информации о платежной дисциплине, просроченной задолженности или исполнении настоящего Договора Кредитным информационным бюро, осуществляющим деятельность в Республике Узбекистан (в том числе на основании Закона "Об обмене кредитной информацией").\n\n',
                  fontSize: 9,
                },
                {
                  text: '8.5. Продавец обязуется принять необходимые организационные и технические меры для обеспечения защиты Персональных данных от несанкционированного доступа, изменения или уничтожения.\n\n',
                  fontSize: 9,
                },
              ],
            },
          ],
          columnGap: 10,
        },

        // 9. FORS-MAJOR HOLATLARI
        {
          columns: [
            {
              width: '*',
              text: [
                { text: '9. FORS-MAJOR HOLATLARI\n', fontSize: 10, bold: true },
                {
                  text: '9.1.Tomonlar ushbu Shartnoma buyicha majburiyatlarni qisman yoki to\'liq bajarmaganliklari uchun javobgarlikdan ozod qilinadi, agar ushbu bajarlmagan holatlar shartnoma tuzilgandan keyin tomonlar oldindan ko\'ra olmaydigan yoki oldini ololmaydigan favqulodda holatlar (fors-major holatlari) natijasida yuzaga kelgan bo\'lsa. Fors-major holatlariga quyidagilar kiradi: urush, favqulodda holat joriy etish, yong\'in, boshqa avariyalar, tabiiy ofat, epidemiya, pandemiya, ish tashlashlar (lokaut, boykot, blokada), O\'zbekiston Respublikasining normativ-huquqiy hujjatlari, maxsus komissiyalar va vakolatli mansabdor shaxslarning qarorlari, agar ularning kuchga kirishi shartnomani bajarishni imkonsiz qiladi.\n\n',
                  fontSize: 9,
                },
                {
                  text: '9.2. Ushbu Shartnomaning 8.1-bandda ko\'rsatilgan holatlar yuzaga kelganda, har bir tomon boshqa tomonni 3 (uch) kalendar kun ichida ular to\'g\'risida yozma ravishda xabardor qilishi kerak. Bildirishnomada vaziyatlarning mohiyati to\'g\'risidagi ma\'lumotlar, shuningdek ushbu holatlarning mavjudligini tasdiqlovchi va iloji bo\'lsa, ularning shartnoma buyicha o\'z majburiyatlarini bajarish qobiliyatiga ta\'sirini baholaydigan rasmiy hujjatlar bo\'lishi kerak.\n\n',
                  fontSize: 9,
                },
                {
                  text: '9.3. Agar tomon ushbu Shartnomaning 8.2-bandida nazarda tutilgan bildirishnomani yubormasa yoki o\'z vaqtida yubormasa, agar xabar berishning iloji yo\'qligi Shartnomaning 8.1-bandida ko\'rsatilgan holatlarning ta\'siridan kelib chiqmasa, u ikkinchi tomonga yetkazilgan zararlarni qoplashi shart.\n\n',
                  fontSize: 9,
                },
                {
                  text: '9.4. Ushbu Shartnomaning 8.1-bandida nazarda tutilgan holatlar yuzaga kelgan hollarda, shartnoma buyicha majburiyatlarni bajarish muddati ushbu holatlar va ularning oqibatlari amal qiladigan vaqtga, lekin bir oydan oshmasdan, mutanosib ravishda uzaytiriladi.\n\n',
                  fontSize: 9,
                },
                {
                  text: '9.5. Agar ushbu Shartnomaning 8.1 - bandida keltirilgan holatlar va ularning oqibatlari bir oydan ortiq davom etsa, ushbu Shartnoma tomonlarning o\'zaro roziligi bilan bekor qilinishi mumkin.\n\n',
                  fontSize: 9,
                },
              ],
            },
            {
              width: '*',
              text: [
                { text: '9. ФОРС-МАЖОР\n', fontSize: 10, bold: true },
                {
                  text: '9.1. Стороны освобождаются от ответственности за частичное или полное неисполнение своих обязательств по настоящему Договору, если это неисполнение является следствием чрезвычайных обстоятельств (форс-мажорных обстоятельств), возникших после заключения Договора, которые стороны не могли предвидеть или предотвратить. К обстоятельствам непреодолимой силы относятся: война, чрезвычайное положение, пожар, иные происшествия, стихийное бедствие, эпидемия, пандемия, забастовки (локаут, бойкот, блокада), нормативные правовые акты Республики Узбекистан, решения специальных комиссий и уполномоченных должностных лиц, если их вступление в силу делает невозможным исполнение договора.\n\n',
                  fontSize: 9,
                },
                {
                  text: '9.2. В случае наступления обстоятельств, указанных в пункте 9.1 настоящего Договора, каждая сторона обязана уведомить об этом другую сторону в письменной форме в течение 3 (трех) календарных дней. Уведомление должно содержать сведения о характере обстоятельств, а также официальные документы, подтверждающие наличие этих обстоятельств и, по возможности, оценку их влияния на возможность выполнения своих обязательств по Договору.\n\n',
                  fontSize: 9,
                },
                {
                  text: '9.3. Если сторона не направляет уведомление, предусмотренное пунктом 9.2 настоящего Договора, или не направляет его в срок, за исключением случаев, когда невозможность уведомления вызвана обстоятельствами, указанными в пункте 9.1 Договора, она возмещает другой стороне убытки.\n\n',
                  fontSize: 9,
                },
                {
                  text: '9.4. При наступлении обстоятельств, предусмотренных пунктом 9.1 настоящего Договора, срок исполнения обязательств по договору продлевается пропорционально времени действия этих обстоятельств и их последствий, но не более чем на один месяц.\n\n',
                  fontSize: 9,
                },
                {
                  text: '9.5. Если обстоятельства, указанные в пункте 9.1 настоящего Договора, и их последствия длятся более одного месяца, настоящий Договор может быть расторгнут по обоюдному согласию сторон.\n\n',
                  fontSize: 9,
                },
              ],
            },
          ],
          columnGap: 10,
        },

        // 10. NIZOLARNI HAL QILISH TARTIBI
        {
          columns: [
            {
              width: '*',
              text: [
                { text: '10. NIZOLARNI HAL QILISH TARTIBI\n', fontSize: 10, bold: true },
                {
                  text: '10.1.Tomonlar ushbu Shartnoma yuzasidan kelib chiqishi mumkin bo\'lgan kelishmovchilik va nizolarni muzokara yo\'li bilan hal qilishga harakat qiladilar.\n\n',
                  fontSize: 9,
                },
                {
                  text: '10.2. Xaridorning ushbu Shartnoma bilan bog\'liq rasmiy yozma talabnomalarni ko\'rib chiqish muddati 7 (etti) kalendar kumni tashkil etadi.\n\n',
                  fontSize: 9,
                },
                {
                  text: '10.3.Ushbu Shartnoma buyicha Sotuvchidan mobil qurilma yuborilgan sms-xabarnomalarni (shu jumladan "ICloud orqali") yozma shaklga teng hisoblanadi.\n\n',
                  fontSize: 9,
                },
                {
                  text: '10.4. Agar ko\'rsatib o\'tilgan kelishmovchilik va nizolar muzokaralar yo\'li bilan hal etilmasa, ular O\'zbekiston Respublikasining amaldagi qonunchiligi asosida Sotuvchi hududi buyicha Fuqarolik sudda hal etiladi.\n\n',
                  fontSize: 9,
                },
              ],
            },
            {
              width: '*',
              text: [
                { text: '10. ПОРЯДОК РАЗРЕШЕНИЯ СПОРОВ\n', fontSize: 10, bold: true },
                {
                  text: '10.1. Любые разногласия и споры, которые могут возникнуть в связи с настоящим Договором, стороны будут стараться решать путем переговоров.\n\n',
                  fontSize: 9,
                },
                {
                  text: '10.2. Срок рассмотрения официальных письменных претензий Покупателя составляет 7 (семь) календарных дней.\n\n',
                  fontSize: 9,
                },
                {
                  text: '10.3. Направление смс-уведомлений (в том числе через "ICloud") от Продавца на мобильное устройство по настоящему Договору считается соблюдением письменной формы.\n\n',
                  fontSize: 9,
                },
                {
                  text: '10.4. Если указанные разногласия и споры не могут быть разрешены путем переговоров, они будут решаться в гражданском суде согласно действующему законодательству Республики Узбекистан по месторасположению Продавца.\n\n',
                  fontSize: 9,
                },
              ],
            },
          ],
          columnGap: 10,
        },

        // 11. YAKUNIY SHARTLAR
        {
          columns: [
            {
              width: '*',
              text: [
                { text: '11. YAKUNIY SHARTLAR\n', fontSize: 10, bold: true },
                {
                  text: '11.1. Ushbu Shartnomasi Sotuvchidan Tovarni olgan kundan boshlab kuchga kiradi va Xaridor o\'z majburiyatlarni bajarguncha qadar amal qiladi.\n\n',
                  fontSize: 9,
                },
                {
                  text: '11.2. Ushbu Shartnomaga qo\'shimcha va o\'zgartirishlar kiritish Tomonlarning roziligi bilan qo\'shimcha kelishuv bitimi tuzish yo\'li bilan amalga oshiriladi.\n\n',
                  fontSize: 9,
                },
                {
                  text: '11.3. Ushbu Shartnomada ko\'rsatilmagan holatlar, O\'zbekiston Respublikasining amaldagi qonunchiligi orqali hal etiladi.\n\n',
                  fontSize: 9,
                },
                {
                  text: '11.4 Tomonlarning manzillari va revizitlari o\'zgartirilgan taqdirda, Tomon ma\'lumotlarni o\'zgartirgan paytdan boshlab 3 (uch) kun ichida boshqa Tomonni xabardor qilishi shart.\n\n',
                  fontSize: 9,
                },
                {
                  text: '11.5. Ushbu Shartnoma bir xil yuridik kuchga ega bo\'lgan ikki nusxada tuzilib, Tomonlarning har biriga bir nusxadan beriladi.\n\n',
                  fontSize: 9,
                },
                {
                  text: '11.6. Xaridor, Shartnoma buyicha savollar yoki murojaatlar uchun quyidagi aloqa ma\'lumotlaridan foydalanishi mumkin:\n',
                  fontSize: 9,
                },
                {
                  text: 'Telefon raqami: +998781134774\n',
                  fontSize: 9,
                },
                {
                  text: 'Elektron pochta: oybarchineshimova61@gmail.com\n\n',
                  fontSize: 9,
                },
              ],
            },
            {
              width: '*',
              text: [
                { text: '11. ЗАКЛЮЧИТЕЛЬНЫЕ ПОЛОЖЕНИЯ\n', fontSize: 10, bold: true },
                {
                  text: '11.1. Настоящий Договор вступает в силу с момента получения Товара от Продавца и действует до момента исполнения Покупателем своих обязательств.\n\n',
                  fontSize: 9,
                },
                {
                  text: '11.2. Любые изменения и дополнения к настоящему Договору вносятся путем заключения дополнительного соглашения по взаимному согласию Сторон.\n\n',
                  fontSize: 9,
                },
                {
                  text: '11.3. Во всем, что не предусмотрено настоящим Договором, стороны руководствуются действующим законодательством Республики Узбекистан.\n\n',
                  fontSize: 9,
                },
                {
                  text: '11.4. В случае изменения адресов и реквизитов Сторона обязана уведомить об этом другую Сторону в течение 3 (трех) дней с момента изменения сведений.\n\n',
                  fontSize: 9,
                },
                {
                  text: '11.5. Настоящий Договор составлен в двух экземплярах, имеющих одинаковую юридическую силу, по одному экземпляру для каждой из Сторон.\n\n',
                  fontSize: 9,
                },
                {
                  text: '11.6. Покупатель может воспользоваться следующими контактными данными для вопросов или обращений по Договору:\n',
                  fontSize: 9,
                },
                {
                  text: 'Телефон: +998781134774\n',
                  fontSize: 9,
                },
                {
                  text: 'Электронная почта: oybarchineshimova61@gmail.com\n\n',
                  fontSize: 9,
                },
              ],
            },
          ],
          columnGap: 10,
        },

        // ========== SAHIFA 12: Tomonlarning manzillari ==========
        { text: '', pageBreak: 'before' },
        {
          columns: [
            {
              width: '*',
              text: [
                { text: '12. TOMONLARNING MANZILLARI VA REKVIZITLARI\n', fontSize: 10, bold: true },
                { text: 'SOTUVCHI:', fontSize: 9, bold: true },
                { text: ' «PROBOX GROUP CO» MChJ\n', fontSize: 9 },
                { text: 'Manzil: ' , fontSize: 9 },
                { text: 'Toshkent sh., Olmazor tumani, Nurafshon ko\'chasi, 1-uy. 12-xonadon.\n', fontSize: 9 },
                { text: 'Bank: ATB «ASIA ALLIANCE BANK»\n', fontSize: 9 },
                { text: 'Bank kodi: 01095\n', fontSize: 9 },
                { text: 'X/p: 20208000705125899001\n', fontSize: 9 },
                { text: 'STIR: 306737779\n', fontSize: 9 },
                { text: 'XARIDOR\n', fontSize: 9, bold: true },
                { text: 'F.I.Sh.: ', fontSize: 9 },
                { text: `${clientName || '_______________________'}\n`, fontSize: 9, bold: true },
                { text: 'Pasport/id seriyasi va raqami: ', fontSize: 9 },
                { text: `${passportId || '______________'}`, fontSize: 9, bold: true },
                { text: ', JSHSHIR: ', fontSize: 9 },
                { text: `${jshshir || '______________'}\n`, fontSize: 9, bold: true },
                { text: 'Manzil: ', fontSize: 9 },
                { text: `${clientAddress || '______________'}\n`, fontSize: 9, bold: true },
                { text: 'Tel.raqami: ', fontSize: 9 },
                { text: `${clientPhone || '_______________________'}\n`, fontSize: 9, bold: true },
                { text: 'Shartnoma 11 (o\'n bir) varoqdan iborat.\n', fontSize: 8 },
                {
                  text: 'Muddatli to\'lov asosida sotish-xarid qilish shartnomasiga № ',
                  fontSize: 8,
                },
                {
                  text: `${leadId || '____'}`,
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: ` ${year} yil "`,
                  fontSize: 8,
                },
                {
                  text: `${day}`,
                  fontSize: 8,
                  bold: true,
                },
                {
                  text: `" ${month} dagi 1-son Ilova\n`,
                  fontSize: 8,
                },
              ],
            },
            // in russian
            {
              width: '*',
              text: [
                { text: '12. АДРЕСА И РЕКВИЗИТЫ СТОРОН\n', fontSize: 10, bold: true },
                { text: 'ПРОДАВЕЦ:', fontSize: 9, bold: true },
                { text: ' OOO «PROBOX GROUP CO»\n', fontSize: 9 },
                { text: 'Адрес: ', fontSize: 9 },
                { text: 'Т.Ташкент, Oламазарский р-н, ул. Нурафшон, 1-дом, 12-квартира.\n', fontSize: 9 },
                { text: 'Банк: АТБ «ASIA ALLIANCE BANK»\n', fontSize: 9 },
                { text: 'МФО: 01095\n', fontSize: 9 },
                { text: 'P/c: 20208000705125899001\n', fontSize: 9 },
                { text: 'ИНН: 306737779\n', fontSize: 9 },
                { text: 'ПОКУПАТЕЛЬ\n', fontSize: 9, bold: true },
                { text: 'Ф.И.О: ', fontSize: 9 },
                { text: `${clientName || '_______________________'}\n`, fontSize: 9, bold: true },
                { text: 'Серия и номер паспорта/ id: ', fontSize: 9 },
                { text: `${passportId || '______________'}`, fontSize: 9, bold: true },
                { text: ', ПИНФЛ: ', fontSize: 9 },
                { text: `${jshshir || '______________'}\n`, fontSize: 9, bold: true },
                { text: 'Адрес: ', fontSize: 9 },
                { text: `${clientAddress || '______________'}\n`, fontSize: 9, bold: true },
                { text: 'Тел.номер: ', fontSize: 9 },
                { text: `${clientPhone || '_______________________'}\n`, fontSize: 9, bold: true },
                { text: 'Договор состоит из 11 (одиннадцати) страниц.\n', fontSize: 8 },
                {
                  text: [
                    'Приложение №1 к Договору купли-продажи на основе рассрочки № ',
                    { text: `${leadId || '____'}`, bold: true },
                    ` от "`,
                    { text: `${day}`, bold: true },
                    `" ${monthRu} `,
                    { text: `${year}`, bold: true },
                    ' г.\n',
                  ],
                  fontSize: 8,
                },
              ],
            },
          ],
          columnGap: 10,
        },

        // ========== SAHIFA 3: To'lov jadvali ==========
        { text: '', pageBreak: 'before' },
        {
          text: 'TO\'LOV JADVALI/GRAFIK PLATYAJEY',
          fontSize: 12,
          bold: true,
          alignment: 'center',
          margin: [0, 0, 0, 10],
        },
        {
          table: {
            headerRows: 1,
            widths: ['auto', '*', '*', '*'],
            body: [
              [
                { text: '№', bold: true, fillColor: '#f0f0f0' },
                { text: 'Sana/Дата', bold: true, fillColor: '#f0f0f0' },
                { text: 'To\'lov miqdori/Сумма оплаты (sum)', bold: true, fillColor: '#f0f0f0' },
                { text: 'Qolgan miqdori/Остаток (sum)', bold: true, fillColor: '#f0f0f0' },
              ],
              // To'lov jadvali qatorlari (dinamik - faqat kerakli oylar soni)
              ...(paymentSchedule.length > 0 
                ? paymentSchedule.map((scheduleItem) => [
                    scheduleItem.number.toString(),
                    scheduleItem.date,
                    { text: scheduleItem.amount.toLocaleString('uz-UZ'), bold: true }, // Faqat oylik to'lov - bold
                    '0', // Qolgan miqdor har doim 0
                  ])
                : [] // Agar jadval bo'sh bo'lsa, hech narsa ko'rsatilmaydi
              ),
              [
                { text: 'JAMI/ITOGO:', bold: true, colSpan: 2 },
                '',
                { text: paymentScheduleTotalFormatted, bold: true }, // Jadvaldagi oylik summalar yig'indisi
                '0',
              ],
            ],
          },
          layout: {
            hLineWidth: () => 0.3,
            vLineWidth: () => 0.3,
            paddingLeft: () => 2,
            paddingRight: () => 2,
            paddingTop: () => 2,
            paddingBottom: () => 2,
          },
        },
        { text: '\n' },
        {
          columns: [
            {
              width: '*',
              stack: [
                { text: 'SOTUVCHI/PRODAVETS\n', fontSize: 9, bold: true },
                { text: 'ООО «PROBOX GROUP CO»\n', fontSize: 9 },
                { text: 'Manzil: Toshkent sh., Olmazor tumani, Nurafshon ko\'chasi, 1-uy. 12-xonadon.\n', fontSize: 9 },
                { text: 'Bank: ATB «ASIA ALLIANCE BANK»\n', fontSize: 9 },
                { text: 'Bank kodi: 01095\n', fontSize: 9 },
                { text: 'X/p: 20208000705125899001\n', fontSize: 9 },
                { text: 'STIR: 306737779\n\n', fontSize: 9 },
                { text: 'S o t u v c h i konsultant: ', fontSize: 9 },
                { text: `${finalSellerName || '_________________'}\n\n`, fontSize: 9, bold: true },
                { text: 'Direktor: Nigmatov O.X.\n', fontSize: 9, bold: true },
                ...(signatureImage ? [
                  {
                    image: signatureImage,
                    width: 290,
                    height: 150,
                    margin: [0, 5, 0, 0],
                  },
                ] : [
                  { text: '_________________\n', fontSize: 9 },
                ]),
              ],
            },
            {
              width: '*',
              stack: [
                { text: 'XARIDOR/POKUPATEL\n', fontSize: 9, bold: true },
                {
                  text: [
                    { text: 'F.I.Sh.: ', fontSize: 9 },
                    {
                      text: softWrapLongTokens(
                        clientName || '_______________________'
                      ),
                      fontSize: 9,
                      bold: true,
                    },
                    { text: '\n\n', fontSize: 9 },
                  ],
                },
                { text: 'Imzo: ', fontSize: 9 },
                ...(userSignature ? [
                  {
                    image: userSignature,
                    width: 150,
                    height: 60,
                    margin: [0, 2, 0, 0],
                  },
                ] : [
                  { text: '_________________\n', fontSize: 9 },
                ]),
              ],
            },
          ],
          columnGap: 10,
        },
      ],
    };

    // PDF yaratish va yuklab olish
    const fileName = `${clientName}-${invoiceDocNum  || 'unknown'}-${new Date().toISOString().slice(0, 10)}.pdf`;
    
    const pdfDoc = pdfMake.createPdf(docDefinition);
    
    // PDF faylni yuklab olish
    pdfDoc.download(fileName);
    
    // PDF faylni blob sifatida qaytarish (serverga yuborish uchun)
    return new Promise((resolve, reject) => {
      pdfDoc.getBlob((blob) => {
        const file = new File([blob], fileName, { type: 'application/pdf' });
        resolve(file);
      });
    });
  } catch (error) {
    console.error('PDF fayl yaratishda xatolik:', error);
    throw error;
  }
};