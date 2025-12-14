import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

// pdfmake fontlarni yuklash
try {
  if (pdfFonts && pdfFonts.pdfMake && pdfFonts.pdfMake.vfs) {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
  } else if (pdfFonts && pdfFonts.pdfMake) {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
  } else if (pdfFonts) {
    pdfMake.vfs = pdfFonts;
  } else if (typeof pdfFonts !== 'undefined') {
    pdfMake.vfs = pdfFonts;
  }
} catch (error) {
  console.warn('pdfmake fontlarni yuklashda xatolik:', error);
}

/**
 * Rasmni base64 formatiga o'tkazadi
 * @param {string} imagePath - Rasm fayl yo'li
 * @returns {Promise<string>} Base64 string
 */
export const imageToBase64 = async (imagePath) => {
  try {
    const response = await fetch(imagePath);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Rasmni yuklashda xatolik:', error);
    return null;
  }
};

/**
 * PDF fayl yaratadi va yuklab oladi
 * @param {Object} docDefinition - PDF document definition
 * @param {string} fileName - Fayl nomi
 */
export const createAndDownloadPdf = (docDefinition, fileName) => {
  pdfMake.createPdf(docDefinition).download(fileName);
};

export { pdfMake };
