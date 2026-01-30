import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { formatCurrencyUZS } from '@/features/leads/utils/deviceUtils';
import formatterCurrency from '@/utils/formatterCurrency';

pdfMake.vfs = pdfFonts.vfs;

export function generatePurchasePdf(purchaseData) {
  //   console.log('generatePurchasePdf called with:', purchaseData);

  try {
    const {
      contractNo = '83745',
      supplier = 'Alisher Alisherov',
      receiver = 'Alisher Alisherov',
      supplierPhone = '+998 90 000 00 02',
      receiverPhone = '+998 90 000 00 02',
      warehouse = 'Malika B-12',
      branch = 'Bosh office',
      date = new Date().toLocaleDateString('ru-RU'),
      items = [],
    } = purchaseData;

    // console.log('Items count:', items.length);

    const totalAmount = items.reduce(
      (sum, item) => sum + item.price * item.count,
      0
    );

    const tableBody = [
      [
        { text: '№', style: 'tableHeader', alignment: 'center', fontSize: 8 },
        { text: 'Mahsulot nomi', style: 'tableHeader', fontSize: 8 },
        { text: 'Kodi', style: 'tableHeader', fontSize: 8 },
        { text: 'Kategoriyalar', style: 'tableHeader', fontSize: 8 },
        { text: 'IMEI raqami', style: 'tableHeader', fontSize: 8 },
        {
          text: 'Holati',
          style: 'tableHeader',
          alignment: 'center',
          fontSize: 8,
        },
        {
          text: 'Foizi',
          style: 'tableHeader',
          alignment: 'center',
          fontSize: 8,
        },
        {
          text: 'Miqdor',
          style: 'tableHeader',
          alignment: 'center',
          fontSize: 8,
        },
        {
          text: 'Narxi',
          style: 'tableHeader',
          alignment: 'right',
          fontSize: 8,
        },
      ],
      ...items.map((item, index) => [
        { text: index + 1, alignment: 'center', fontSize: 8 },
        { text: item.product_name || '-', fontSize: 8 },
        { text: item.product_code || '-', fontSize: 8 },
        { text: item.category || '-', color: '#3B82F6', fontSize: 8 },
        { text: item.imei || '-', fontSize: 8 },
        { text: item.status || '-', alignment: 'center', fontSize: 8 },
        {
          text: item.battery || '-',
          color: '#10B981',
          alignment: 'center',
          fontSize: 8,
        },
        { text: item.count || 1, alignment: 'center', fontSize: 8 },
        {
          text: formatterCurrency(item.price, item?.currency),
          alignment: 'right',
          color: '#3B82F6',
          fontSize: 8,
        },
      ]),
    ];

    const docDefinition = {
      pageSize: 'A4',
      pageMargins: [40, 60, 40, 80],
      content: [
        {
          columns: [
            { width: '*', text: '' },
            {
              text: 'PROBOX',
              style: 'logo',
              alignment: 'center',
            },
            {
              width: '*',
              text: `Sana: ${date}`,
              alignment: 'right',
              fontSize: 10,
            },
          ],
          margin: [0, 0, 0, 20],
        },
        {
          text: `Yuk xati - N° ${contractNo}`,
          style: 'header',
          alignment: 'center',
          margin: [0, 0, 0, 20],
        },
        {
          columns: [
            {
              width: '33%',
              stack: [
                { text: 'Yetkazib beruvchi', style: 'label' },
                { text: supplier, style: 'value' },
              ],
            },
            {
              width: '33%',
              stack: [
                { text: 'Telefon raqami', style: 'label' },
                { text: supplierPhone, style: 'value' },
              ],
            },
            {
              width: '33%',
              stack: [
                { text: 'Qabul qiluvchi', style: 'label' },
                { text: receiver, style: 'value' },
              ],
            },
          ],
          margin: [0, 0, 0, 8],
        },
        {
          columns: [
            {
              width: '33%',
              stack: [
                { text: 'Telefon raqami', style: 'label' },
                { text: receiverPhone, style: 'value' },
              ],
            },
            {
              width: '33%',
              stack: [
                { text: 'Ombor', style: 'label' },
                { text: warehouse, style: 'value' },
              ],
            },
            {
              width: '33%',
              stack: [
                { text: 'Filial', style: 'label' },
                { text: branch, style: 'value' },
              ],
            },
          ],
          margin: [0, 0, 0, 15],
        },
        {
          table: {
            headerRows: 1,
            widths: [25, '*', 60, 70, 70, 30, 30, 30, 90],
            body: tableBody,
          },
          layout: {
            fillColor: (rowIndex) => (rowIndex === 0 ? '#f3f4f6' : null),
            hLineWidth: () => 0.5,
            vLineWidth: () => 0.5,
            hLineColor: () => '#e5e7eb',
            vLineColor: () => '#e5e7eb',
          },
        },
        {
          text: `${items.length} ta mahsulot - ${formatCurrencyUZS(totalAmount)}`,
          style: 'total',
          alignment: 'center',
          margin: [0, 15, 0, 30],
        },
        {
          stack: [
            {
              qr: `https://probox.uz/purchase/${contractNo}`,
              fit: 75,
              alignment: 'center',
            },
          ],
          margin: [0, 0, 0, 8],
          alignment: 'center',
        },
        {
          text: '*siz bu QR kod orqali hujjatni elektron nusxasini\nyuklab olishingiz mumkin!',
          fontSize: 7,
          alignment: 'center',
          color: '#6b7280',
        },
      ],
      styles: {
        logo: {
          fontSize: 14,
          bold: true,
          color: '#1f2937',
        },
        header: {
          fontSize: 14,
          bold: true,
          color: '#1f2937',
        },
        label: {
          fontSize: 7,
          color: '#6b7280',
          margin: [0, 0, 0, 2],
        },
        value: {
          fontSize: 9,
          bold: true,
          color: '#1f2937',
        },
        tableHeader: {
          fontSize: 7,
          bold: true,
          color: '#374151',
          margin: [0, 4, 0, 4],
        },
        total: {
          fontSize: 11,
          bold: true,
          color: '#3B82F6',
        },
      },
      defaultStyle: {
        fontSize: 8,
        color: '#1f2937',
      },
    };

    // console.log('Creating PDF with docDefinition');
    pdfMake.createPdf(docDefinition).download(`Yuk_xati_${contractNo}.pdf`);
    // console.log('PDF download initiated');
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('PDF yaratishda xatolik yuz berdi: ' + error.message);
  }
}
