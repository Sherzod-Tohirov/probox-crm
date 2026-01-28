import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Button, Modal, Typography } from '@/components/ui';
import styles from './ImeiScannerModal.module.scss';

export default function ImeiScannerModal({ isOpen, onClose, onScan }) {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);
  const html5QrCodeRef = useRef(null);

  useEffect(() => {
    if (isOpen && !html5QrCodeRef.current) {
      html5QrCodeRef.current = new Html5Qrcode('imei-scanner');
    }

    return () => {
      // Scanner ishlab turganini tekshirish va to'xtatish
      if (html5QrCodeRef.current && isScanning) {
        const state = html5QrCodeRef.current.getState();
        // Faqat SCANNING yoki PAUSED holatida to'xtatish
        if (state === 2 || state === 3) {
          html5QrCodeRef.current
            .stop()
            .catch((err) =>
              console.error("Scanner to'xtatishda xatolik:", err)
            );
        }
      }
    };
  }, [isOpen, isScanning]);

  const startScanning = async () => {
    setError(null);
    setIsScanning(true);

    try {
      // Mobil qurilmalar uchun kamera sozlamalari
      const cameraConfig = {
        facingMode: { exact: 'environment' },
      };

      await html5QrCodeRef.current.start(
        cameraConfig,
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        (decodedText) => {
          // IMEI kodini ajratib olish
          const imeiMatch = decodedText.match(/IMEI[1-2]?[:\s]*(\d{15})/i);
          const imei = imeiMatch ? imeiMatch[1] : decodedText;

          onScan(imei);
          stopScanning();
          onClose();
        },
        () => {
          // Skanerlash xatoliklarini e'tiborsiz qoldirish
        }
      );
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

      setError(errorMessage);
      setIsScanning(false);
    }
  };

  const stopScanning = async () => {
    if (html5QrCodeRef.current && isScanning) {
      try {
        const state = html5QrCodeRef.current.getState();
        // Faqat SCANNING (2) yoki PAUSED (3) holatida to'xtatish
        if (state === 2 || state === 3) {
          await html5QrCodeRef.current.stop();
        }
        setIsScanning(false);
      } catch (err) {
        console.error("Scanner to'xtatishda xatolik:", err);
        setIsScanning(false);
      }
    }
  };

  const handleClose = () => {
    stopScanning();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="IMEI Skanerlash">
      <div className={styles.scannerContainer}>
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
          IMEI shtrix-kodini yoki QR-kodini kamera orqali skanerlang
        </Typography>
      </div>
    </Modal>
  );
}
