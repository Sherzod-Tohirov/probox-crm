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
      if (html5QrCodeRef.current && isScanning) {
        html5QrCodeRef.current
          .stop()
          .catch((err) => console.error('Error stopping scanner:', err));
      }
    };
  }, [isOpen, isScanning]);

  const startScanning = async () => {
    setError(null);
    setIsScanning(true);

    try {
      await html5QrCodeRef.current.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          // Extract IMEI from decoded text
          const imeiMatch = decodedText.match(/IMEI[1-2]?[:\s]*(\d{15})/i);
          const imei = imeiMatch ? imeiMatch[1] : decodedText;

          onScan(imei);
          stopScanning();
          onClose();
        },
        () => {
          // Scanning error - ignore
        }
      );
    } catch (err) {
      setError('Kamerani ishga tushirishda xatolik: ' + err.message);
      setIsScanning(false);
    }
  };

  const stopScanning = async () => {
    if (html5QrCodeRef.current && isScanning) {
      try {
        await html5QrCodeRef.current.stop();
        setIsScanning(false);
      } catch (err) {
        console.error('Error stopping scanner:', err);
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
          <Typography color="error" className={styles.error}>
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
