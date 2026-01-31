import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
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

    // Kategoriya uchun badge rang
    const getCategoryColor = (category) => {
      const colors = {
        iPhone: '#0EA5E9',
        'Maishiy texnika': '#F59E0B',
        Noutbuklar: '#8B5CF6',
        Planshetlar: '#EC4899',
      };
      return colors[category] || '#0EA5E9';
    };

    // Holat uchun badge rang
    const getStatusColor = (status) => {
      const colors = {
        Yangi: '#10B981',
        'B/U': '#EF4444',
      };
      return colors[status] || '#6B7280';
    };

    // Foiz uchun badge rang
    const getBatteryColor = (battery) => {
      const percent = parseInt(battery);
      if (percent >= 95) return '#10B981'; // Yashil
      if (percent >= 85) return '#F59E0B'; // Sariq
      return '#EF4444'; // Qizil
    };

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
        { text: item.product_name || '-', fontSize: 8, bold: false },
        { text: item.product_code || '-', fontSize: 8, color: '#6B7280' },
        {
          text: item.category || '-',
          color: getCategoryColor(item.category),
          fontSize: 8,
          bold: true,
        },
        { text: item.imei || '-', fontSize: 8, color: '#374151' },
        {
          text: item.status || '-',
          alignment: 'center',
          fontSize: 8,
          color: getStatusColor(item.status),
          bold: true,
        },
        {
          text: item.battery ? `${item.battery}%` : '-',
          color: getBatteryColor(item.battery),
          alignment: 'center',
          fontSize: 8,
          bold: true,
        },
        { text: item.count || 1, alignment: 'center', fontSize: 8 },
        {
          text: formatterCurrency(item.price, item?.currency),
          alignment: 'right',
          color: '#0EA5E9',
          fontSize: 8,
          bold: true,
        },
      ]),
    ];

    const docDefinition = {
      pageSize: 'A4',
      pageMargins: [40, 60, 40, 80],
      content: [
        {
          columns: [
            {
              width: '*',
              stack: [
                {
                  text: 'Probox',
                  fontSize: 18,
                  bold: true,
                  color: '#1E293B',
                  margin: [0, 0, 0, 2],
                },
                {
                  text: 'Where Experts Meet',
                  fontSize: 8,
                  color: '#64748B',
                  italics: true,
                },
              ],
            },
            {
              width: '*',
              text: `Sana: ${date}`,
              alignment: 'right',
              fontSize: 10,
              color: '#1E293B',
            },
          ],
          margin: [0, 0, 0, 20],
        },
        {
          text: `Yuk xati - N° ${contractNo}`,
          fontSize: 16,
          bold: true,
          color: '#1E293B',
          alignment: 'center',
          margin: [0, 0, 0, 20],
        },
        {
          columns: [
            {
              width: '33%',
              stack: [
                {
                  text: 'Yetkazib beruvchi',
                  fontSize: 8,
                  color: '#94A3B8',
                  margin: [0, 0, 0, 3],
                },
                {
                  text: supplier,
                  fontSize: 10,
                  bold: true,
                  color: '#1E293B',
                },
              ],
            },
            {
              width: '33%',
              stack: [
                {
                  text: 'Telefon raqami',
                  fontSize: 8,
                  color: '#94A3B8',
                  margin: [0, 0, 0, 3],
                },
                {
                  text: supplierPhone,
                  fontSize: 10,
                  bold: true,
                  color: '#1E293B',
                },
              ],
            },
            {
              width: '33%',
              stack: [
                {
                  text: 'Qabul qiluvchi',
                  fontSize: 8,
                  color: '#94A3B8',
                  margin: [0, 0, 0, 3],
                },
                {
                  text: receiver,
                  fontSize: 10,
                  bold: true,
                  color: '#1E293B',
                },
              ],
            },
          ],
          margin: [0, 0, 0, 10],
        },
        {
          columns: [
            {
              width: '33%',
              stack: [
                {
                  text: 'Telefon raqami',
                  fontSize: 8,
                  color: '#94A3B8',
                  margin: [0, 0, 0, 3],
                },
                {
                  text: receiverPhone,
                  fontSize: 10,
                  bold: true,
                  color: '#1E293B',
                },
              ],
            },
            {
              width: '33%',
              stack: [
                {
                  text: 'Ombor',
                  fontSize: 8,
                  color: '#94A3B8',
                  margin: [0, 0, 0, 3],
                },
                {
                  text: warehouse,
                  fontSize: 10,
                  bold: true,
                  color: '#1E293B',
                },
              ],
            },
            {
              width: '33%',
              stack: [
                {
                  text: 'Filial',
                  fontSize: 8,
                  color: '#94A3B8',
                  margin: [0, 0, 0, 3],
                },
                {
                  text: branch,
                  fontSize: 10,
                  bold: true,
                  color: '#1E293B',
                },
              ],
            },
          ],
          margin: [0, 0, 0, 20],
        },
        {
          table: {
            headerRows: 1,
            widths: [15, 120, 40, 50, 70, 30, 25, 30, 60],
            body: tableBody,
          },
          layout: {
            fillColor: (rowIndex) => (rowIndex === 0 ? '#F8FAFC' : null),
            hLineWidth: () => 0.5,
            vLineWidth: () => 0.5,
            hLineColor: () => '#E2E8F0',
            vLineColor: () => '#E2E8F0',
            paddingLeft: () => 4,
            paddingRight: () => 4,
            paddingTop: () => 6,
            paddingBottom: () => 6,
          },
        },
        {
          text: `${items.length} ta mahsulot - ${formatterCurrency(totalAmount, 'UZS')}`,
          fontSize: 12,
          bold: true,
          color: '#0EA5E9',
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
