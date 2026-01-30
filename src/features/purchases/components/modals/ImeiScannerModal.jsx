import { useEffect, useRef, useState, useCallback } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Button, Modal, Typography } from '@/components/ui';
import styles from './ImeiScannerModal.module.scss';
import useIsMobile from '@/hooks/useIsMobile';

export default function ImeiScannerModal({ isOpen, onClose, onScan }) {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);
  const [scanMode, setScanMode] = useState('imei'); // 'imei' yoki 'serial'
  const html5QrCodeRef = useRef(null);
  const { isMobile } = useIsMobile({ withDetails: true });
  const isMountedRef = useRef(true); // Component mounted holatini kuzatish
  const hasScannedRef = useRef(false); // Takroriy skanerlashni oldini olish

  // stopScanning funksiyasini useCallback bilan o'rash
  const stopScanning = useCallback(async () => {
    if (html5QrCodeRef.current) {
      try {
        const state = html5QrCodeRef.current.getState();
        // Faqat SCANNING (2) yoki PAUSED (3) holatida to'xtatish
        if (state === 2 || state === 3) {
          await html5QrCodeRef.current.stop();
        }
        // Faqat component mounted bo'lsa state ni yangilash
        if (isMountedRef.current) {
          setIsScanning(false);
        }
      } catch (err) {
        console.error("Scanner to'xtatishda xatolik:", err);
        if (isMountedRef.current) {
          setIsScanning(false);
        }
      }
    }
  }, []);

  // Modal yopilganda scanner ni to'xtatish va state ni reset qilish
  useEffect(() => {
    if (isOpen) {
      // Modal ochilganda
      if (!html5QrCodeRef.current) {
        html5QrCodeRef.current = new Html5Qrcode('imei-scanner');
      }
      // State larni reset qilish
      setError(null);
      hasScannedRef.current = false;
      isMountedRef.current = true;
      setScanMode('imei'); // Default - IMEI
    } else {
      // Modal yopilganda scanner ni to'xtatish va state ni reset qilish
      if (html5QrCodeRef.current && isScanning) {
        stopScanning();
      }
      // State larni tozalash
      setIsScanning(false);
      setError(null);
      hasScannedRef.current = false;
      setScanMode('imei'); // Default ga qaytarish
    }

    return () => {
      // Component unmount bo'lganini belgilash
      isMountedRef.current = false;

      // Component unmount bo'lganda scanner ni to'xtatish
      if (html5QrCodeRef.current) {
        const state = html5QrCodeRef.current.getState();
        if (state === 2 || state === 3) {
          html5QrCodeRef.current
            .stop()
            .catch((err) =>
              console.error("Scanner to'xtatishda xatolik:", err)
            );
        }
      }
    };
  }, [isOpen, isScanning, stopScanning]);

  const startScanning = async () => {
    setError(null);
    setIsScanning(true);
    hasScannedRef.current = false; // Skanerlashni qayta boshlash

    try {
      // Kamera sozlamalari - horizontal barcode uchun
      const scanConfig = {
        fps: 80,
        qrbox: { width: isMobile ? 200 : 300, height: isMobile ? 100 : 150 }, // Horizontal barcode uchun keng va past box
        aspectRatio: 1.0,
        disableFlip: false,
      };

      const onScanSuccess = async (decodedText) => {
        // Takroriy skanerlashni oldini olish - faqat birinchi marta ishlaydi
        if (hasScannedRef.current) {
          return;
        }
        hasScannedRef.current = true;

        console.log('Skanerlangan matn:', decodedText);

        let scannedValue = null;

        if (scanMode === 'imei') {
          // IMEI kodini ajratib olish - turli formatlar uchun
          // 1. IMEI yozuvi bilan - IMEI: 123456789012345 yoki IMEI1: ...
          const imeiWithLabel = decodedText.match(/IMEI[1-2]?[:\s]*(\d{15})/i);
          if (imeiWithLabel) {
            scannedValue = imeiWithLabel[1];
          }

          // 2. Faqat 15 raqam - to'g'ridan-to'g'ri barcode
          if (!scannedValue && /^\d{15}$/.test(decodedText.trim())) {
            scannedValue = decodedText.trim();
          }

          // 3. Matnda biror joyda 15 raqam bor
          if (!scannedValue) {
            const numbersOnly = decodedText.match(/\d{15}/);
            if (numbersOnly) {
              scannedValue = numbersOnly[0];
            }
          }
        } else {
          // Serial Number - har qanday matn yoki raqam ketma-ketligi
          scannedValue = decodedText.trim();
        }

        console.log('Ajratib olingan qiymat:', scannedValue);
        //       `Noto'g'ri IMEI kod. Skanerlangan: "${decodedText}". IMEI 15 ta raqamdan iborat bo'lishi kerak.`
        //     );
        //   }
        //   return;
        // }

        // Darhol scanner ni to'xtatish
        try {
          if (html5QrCodeRef.current) {
            const state = html5QrCodeRef.current.getState();
            if (state === 2 || state === 3) {
              await html5QrCodeRef.current.stop();
            }
          }
        } catch (err) {
          console.error("Scanner to'xtatishda xatolik:", err);
        }

        // Qiymatni yuborish va modal ni yopish
        if (isMountedRef.current && scannedValue) {
          setIsScanning(false);
          onScan(scannedValue);
          onClose();
        }
      };

      const onScanError = () => {
        // Skanerlash xatoliklarini e'tiborsiz qoldirish
      };

      try {
        // Avval orqa kamerani sinab ko'rish
        await html5QrCodeRef.current.start(
          { facingMode: 'environment' },
          scanConfig,
          onScanSuccess,
          onScanError
        );
      } catch (backCameraError) {
        console.log(
          'Orqa kamera ishlamadi, har qanday kamerani ishlatish:',
          backCameraError
        );
        // Orqa kamera ishlamasa, har qanday mavjud kamerani ishlatish
        try {
          await html5QrCodeRef.current.start(
            { facingMode: 'user' },
            scanConfig,
            onScanSuccess,
            onScanError
          );
        } catch (frontCameraError) {
          console.log(
            'Old kamera ham ishlamadi, default kamerani ishlatish:',
            frontCameraError
          );
          // Ikkala kamera ham ishlamasa, default kamerani ishlatish
          await html5QrCodeRef.current.start(
            undefined,
            scanConfig,
            onScanSuccess,
            onScanError
          );
        }
      }
    } catch (err) {
      console.error('Kamera xatoligi:', err);

      // Xatolik xabarini aniqlash
      let errorMessage = 'Kameraga kirishda xatolik';

      if (err?.name === 'NotAllowedError') {
        errorMessage =
          'Kamera ruxsati berilmagan. Sozlamalardan kamera ruxsatini yoqing.';
      } else if (err?.name === 'NotFoundError') {
        errorMessage =
          'Kamera topilmadi. Qurilmangizda kamera mavjudligini tekshiring.';
      } else if (err?.name === 'NotReadableError') {
        errorMessage =
          'Kamera band. Boshqa ilovalar kamerani ishlatayotganini tekshiring.';
      } else if (err?.message) {
        errorMessage = 'Kamera xatoligi: ' + err.message;
      }

      // Faqat component mounted bo'lsa state ni yangilash
      if (isMountedRef.current) {
        setError(errorMessage);
        setIsScanning(false);
      }
    }
  };

  const handleClose = () => {
    stopScanning();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={
        scanMode === 'imei' ? 'IMEI Skanerlash' : 'Serial Number Skanerlash'
      }
    >
      <div className={styles.scannerContainer}>
        {/* Scan mode tanlash - faqat scanner ishlamayotganda */}
        {!isScanning && (
          <div className={styles.modeSelector}>
            <Button
              onClick={() => setScanMode('imei')}
              variant={scanMode === 'imei' ? 'filled' : 'outlined'}
              size="small"
              style={{ flex: 1, marginRight: '8px' }}
            >
              IMEI
            </Button>
            <Button
              onClick={() => setScanMode('serial')}
              variant={scanMode === 'serial' ? 'filled' : 'outlined'}
              size="small"
              style={{ flex: 1 }}
            >
              Serial Number
            </Button>
          </div>
        )}

        <div id="imei-scanner" className={styles.scanner} />

        {error && (
          <Typography variant="caption" color="error" className={styles.error}>
            {error}
          </Typography>
        )}

        <div className={styles.actions}>
          {!isScanning ? (
            <Button onClick={startScanning} fullWidth>
              Skanerlashni boshlash
            </Button>
          ) : (
            <Button onClick={stopScanning} variant="outlined" fullWidth>
              To'xtatish
            </Button>
          )}
        </div>

        <Typography variant="caption" className={styles.hint}>
          {scanMode === 'imei'
            ? 'IMEI shtrix-kodini yoki QR-kodini kamera orqali skanerlang'
            : 'Serial Number shtrix-kodini yoki QR-kodini kamera orqali skanerlang'}
        </Typography>
      </div>
    </Modal>
  );
}
