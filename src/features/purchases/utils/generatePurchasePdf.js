import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import formatterCurrency from '@/utils/formatterCurrency';
import { imageToBase64 } from '@/utils/pdfHelpers';
import logoImage from '@/assets/images/new_logo.png';

pdfMake.vfs = pdfFonts.vfs;

export async function generatePurchasePdf(purchaseData) {
  const qrCodeUrl =
    import.meta.env.VITE_API_URL +
    `/public/purchases/pdfs/${purchaseData?.docEntry}`;

  let logoBase64 = null;
  try {
    logoBase64 = await imageToBase64(logoImage);
  } catch (e) {
    console.error('Logo yuklashda xatolik:', e);
  }

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

    const totalAmount = items.reduce(
      (sum, item) => sum + item.price * (item.quantity || 1),
      0
    );

    // Helper functions for badge colors
    const getCategoryColors = (category) => {
      const map = {
        iPhone: { fill: '#E0F2FE', text: '#0284C7' },
        'Maishiy texnika': { fill: '#FEF3C7', text: '#D97706' },
        Noutbuklar: { fill: '#EDE9FE', text: '#7C3AED' },
        Planshetlar: { fill: '#FCE7F3', text: '#DB2777' },
        Telefonlar: { fill: '#E0F2FE', text: '#0284C7' },
      };
      return map[category] || { fill: '#E0F2FE', text: '#0284C7' };
    };

    const getStatusColors = (status) => {
      const map = {
        Yangi: { fill: '#D1FAE5', text: '#059669' },
        'B/U': { fill: '#FEE2E2', text: '#DC2626' },
      };
      return map[status] || { fill: '#F3F4F6', text: '#4B5563' };
    };

    const getBatteryColors = (battery) => {
      if (!battery) return { fill: '#F3F4F6', text: '#4B5563' };
      const percent = parseInt(battery);
      if (percent >= 95) return { fill: '#D1FAE5', text: '#059669' };
      if (percent >= 80) return { fill: '#FEE2E2', text: '#DC2626' };
      return { fill: '#FEE2E2', text: '#DC2626' };
    };

    const tableBody = [
      // Header Row
      [
        { text: '№', style: 'tableHeader', alignment: 'center' },
        { text: 'Mahsulot nomi', style: 'tableHeader' },
        { text: 'Kodi', style: 'tableHeader' },
        { text: 'Kategoriyalar', style: 'tableHeader' },
        { text: 'IMEI raqami', style: 'tableHeader' },
        { text: 'Holati', style: 'tableHeader', alignment: 'center' },
        { text: 'Foizi', style: 'tableHeader', alignment: 'center' },
        { text: 'Miqdor', style: 'tableHeader', alignment: 'center' },
        { text: 'Narxi', style: 'tableHeader', alignment: 'right' },
      ],
      // Data Rows
      ...items.map((item, index) => {
        const catColors = getCategoryColors(item.category);
        const statusColors = getStatusColors(item.status);
        const batteryColors = getBatteryColors(item.batteryCapacity);

        return [
          { text: index + 1, style: 'tableCell', alignment: 'center' },
          { text: item.product_name || '-', style: 'tableCell', bold: true },
          {
            text: item.product_code || '-',
            style: 'tableCell',
            color: '#6B7280',
          },
          {
            text: item.category || '-',
            style: 'badge',
            fillColor: catColors.fill,
            color: catColors.text,
            alignment: 'center',
          },
          { text: item.imei || '-', style: 'tableCell', color: '#6B7280' },
          {
            text: item.status || '-',
            style: 'badge',
            fillColor: statusColors.fill,
            color: statusColors.text,
            alignment: 'center',
          },
          {
            text: item.batteryCapacity ? `${item.batteryCapacity}` : '',
            style: 'badge',
            fillColor: item.batteryCapacity ? batteryColors.fill : undefined,
            color: item.batteryCapacity ? batteryColors.text : undefined,
            alignment: 'center',
          },
          { text: item.count || 1, style: 'tableCell', alignment: 'center' },
          {
            text: formatterCurrency(item.price, item?.currency),
            style: 'tableCell',
            alignment: 'right',
            color: '#0EA5E9',
            bold: true,
          },
        ];
      }),
    ];

    const docDefinition = {
      pageSize: 'A4',
      pageMargins: [30, 40, 30, 40],
      content: [
        // Header Logo & Date
        {
          columns: [
            { width: '*', text: '' },
            {
              width: 'auto',
              stack: [
                logoBase64
                  ? {
                      image: logoBase64,
                      width: 80,
                      alignment: 'center',
                    }
                  : {
                      text: 'Probox',
                      fontSize: 22,
                      bold: true,
                      color: '#1E293B',
                      alignment: 'center',
                    },
              ],
              alignment: 'center',
            },
            {
              width: '*',
              stack: [
                {
                  text: [
                    { text: 'Sana: ', color: '#64748B', fontSize: 8 },
                    { text: date, bold: true, color: '#1E293B', fontSize: 8 },
                  ],
                  alignment: 'right',
                },
              ],
            },
          ],
          margin: [0, 0, 0, 30],
        },

        // Title
        {
          text: `Yuk xati - N° ${contractNo}`,
          fontSize: 12,
          bold: true,
          color: '#1E293B',
          alignment: 'center',
          margin: [0, 0, 0, 15],
        },

        // Info Grid (Supplier/Receiver details)
        {
          table: {
            widths: ['*', 'auto', '*'],
            body: [
              [
                // Left Column
                {
                  stack: [
                    {
                      columns: [
                        {
                          text: 'Yetkazib beruvchi',
                          width: 80,
                          style: 'label',
                        },
                        { text: supplier, width: '*', style: 'value' },
                      ],
                      margin: [0, 0, 0, 4],
                    },
                    {
                      columns: [
                        { text: 'Telefon raqami', width: 80, style: 'label' },
                        { text: supplierPhone, width: '*', style: 'value' },
                      ],
                      margin: [0, 0, 0, 4],
                    },
                    {
                      columns: [
                        { text: 'Ombor', width: 80, style: 'label' },
                        { text: warehouse, width: '*', style: 'value' },
                      ],
                    },
                  ],
                },
                // Spacer
                { text: '', width: 20 },
                // Right Column
                {
                  stack: [
                    {
                      columns: [
                        { text: 'Qabul qiluvchi', width: 80, style: 'label' },
                        { text: receiver, width: '*', style: 'value' },
                      ],
                      margin: [0, 0, 0, 4],
                    },
                    {
                      columns: [
                        { text: 'Telefon raqami', width: 80, style: 'label' },
                        { text: receiverPhone, width: '*', style: 'value' },
                      ],
                      margin: [0, 0, 0, 4],
                    },
                    {
                      columns: [
                        { text: 'Filial', width: 80, style: 'label' },
                        { text: branch, width: '*', style: 'value' },
                      ],
                    },
                  ],
                },
              ],
            ],
          },
          layout: 'noBorders',
          margin: [0, 0, 0, 20],
        },

        // Product Table
        {
          table: {
            headerRows: 1,
            widths: [15, '*', 45, 55, 70, 35, 30, 25, 60],
            body: tableBody,
          },
          layout: {
            hLineWidth: () => 0.5,
            vLineWidth: () => 0,
            hLineColor: '#E2E8F0',
            paddingLeft: (i) => (i === 3 || i === 5 || i === 6 ? 0 : 4),
            paddingRight: (i) => (i === 3 || i === 5 || i === 6 ? 0 : 4),
            paddingTop: (i) => (i === 3 || i === 5 || i === 6 ? 0 : 2),
            paddingBottom: (i) => (i === 3 || i === 5 || i === 6 ? 0 : 2),
          },
        },

        // Total Footer
        {
          columns: [
            { width: '*', text: '' },
            {
              width: 'auto',
              text: [
                { text: `${items.length}`, bold: true, fontSize: 9 },
                { text: ' ta mahsulot - ', fontSize: 9, color: '#1E293B' },
                {
                  text: formatterCurrency(
                    totalAmount,
                    items[0]?.currency || 'UZS'
                  ),
                  bold: true,
                  fontSize: 10,
                  color: '#0EA5E9',
                  alignment: 'center',
                },
              ],
              margin: [0, 10, 0, 0],
            },
            { width: '*', text: '' },
          ],
        },

        // QR Code Section
        {
          columns: [
            { width: '*', text: '' },
            {
              width: 'auto',
              table: {
                body: [
                  [
                    {
                      qr: qrCodeUrl,
                      fit: 66,
                      alignment: 'center',
                    },
                  ],
                ],
              },
              layout: {
                hLineWidth: () => 0.8,
                vLineWidth: () => 0.8,
                hLineColor: '#CBD5E1',
                vLineColor: '#CBD5E1',
                paddingLeft: () => 5,
                paddingRight: () => 5,
                paddingTop: () => 5,
                paddingBottom: () => 5,
              },
            },
            { width: '*', text: '' },
          ],
          margin: [0, 30, 0, 6],
        },
        {
          text: '*siz bu QR kod orqali hujjatni elektron nusxasini\nyuklab olishingiz mumkin!',
          style: 'footerNote',
        },
      ],
      styles: {
        label: {
          fontSize: 7,
          color: '#94A3B8',
          bold: true,
        },
        value: {
          fontSize: 8,
          color: '#1E293B',
          bold: true,
          alignment: 'right',
        },
        tableHeader: {
          fontSize: 7,
          bold: true,
          color: '#1E293B',
          margin: [0, 2, 0, 2],
        },
        tableCell: {
          fontSize: 7,
          color: '#1E293B',
        },
        badge: {
          fontSize: 7,
          bold: true,
          margin: [0, 4, 0, 4], // Add padding INSIDE the cell for text, while cell has 0 padding
          alignment: 'center',
        },
        footerNote: {
          fontSize: 6,
          color: '#94A3B8',
          alignment: 'center',
          lineHeight: 1.3,
        },
      },
      defaultStyle: {
        font: 'Roboto',
      },
    };

    const fileName = `Yuk_xati_${contractNo}.pdf`;
    const pdfDoc = pdfMake.createPdf(docDefinition);
    pdfDoc.download(fileName);
    return new Promise((resolve) => {
      pdfDoc.getBlob((blob) => resolve(blob));
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('PDF yaratishda xatolik yuz berdi: ' + error.message);
  }
}
