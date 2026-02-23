import { useState, useMemo, useCallback } from 'react';
import { Modal, Row, Col, Typography, Input, Button } from '@components/ui';
import {
  extractNumericValue,
  formatNumberWithSeparators,
} from '../../../utils/deviceUtils';
import styles from './invoicePaymentModal.module.scss';
import { Magnet } from 'lucide-react';
import { alert } from '@/utils/globalAlert';

export default function InvoicePaymentModal({
  isOpen,
  onClose,
  selectedDeviceData,
  onConfirm,
  isLoading = false,
  leadId: _leadId,
  leadData: _leadData,
  selectedDevices: _selectedDevices,
  calculationTypeFilter: _calculationTypeFilter,
}) {
  // Birinchi to'lovni hisoblash
  const totalFirstPayment = useMemo(() => {
    return selectedDeviceData.reduce((sum, device) => {
      const firstPayment = device.firstPayment;
      if (
        firstPayment === '' ||
        firstPayment === null ||
        firstPayment === undefined
      ) {
        return sum;
      }
      const numericValue =
        typeof firstPayment === 'number'
          ? firstPayment
          : extractNumericValue(firstPayment);
      return sum + (numericValue || 0);
    }, 0);
  }, [selectedDeviceData]);

  // To'lov inputlarini state'da saqlash
  const [cashPayment, setCashPayment] = useState(0);
  const [cardPayment, setCardPayment] = useState(0);
  const [terminalPayment, setTerminalPayment] = useState(0);

  // Input formatlangan qiymatni qaytarish
  const formatInputValue = useCallback((value) => {
    if (!value || value === 0) return '';
    const numericValue =
      typeof value === 'number' ? value : extractNumericValue(value);
    return numericValue ? formatNumberWithSeparators(numericValue) : '';
  }, []);

  // Input qiymatini o'zgartirish
  const handleInputChange = useCallback((e, setter) => {
    const rawValue = e?.target?.value ?? e ?? '';
    const sanitized = String(rawValue).replace(/[^\d]/g, '');
    const numericValue = sanitized ? Number(sanitized) : 0;
    setter(numericValue);
  }, []);

  // Magnit icon bosilganda qolgan summani hisoblash
  const handleMagnetClick = useCallback(
    (type) => {
      const currentCash = cashPayment || 0;
      const currentCard = cardPayment || 0;
      const currentTerminal = terminalPayment || 0;

      // Boshqa inputlardagi summalarni hisoblash
      let otherPayments = 0;
      if (type === 'cash') {
        otherPayments = currentCard + currentTerminal;
      } else if (type === 'card') {
        otherPayments = currentCash + currentTerminal;
      } else if (type === 'terminal') {
        otherPayments = currentCash + currentCard;
      }

      // Qolgan summani hisoblash
      const remaining = Math.max(0, totalFirstPayment - otherPayments);

      if (type === 'cash') {
        setCashPayment(remaining);
      } else if (type === 'card') {
        setCardPayment(remaining);
      } else if (type === 'terminal') {
        setTerminalPayment(remaining);
      }
    },
    [cashPayment, cardPayment, terminalPayment, totalFirstPayment]
  );

  // Jami kiritilgan to'lov
  const totalEntered = useMemo(() => {
    return (cashPayment || 0) + (cardPayment || 0) + (terminalPayment || 0);
  }, [cashPayment, cardPayment, terminalPayment]);

  // Birinchi to'lov to'liq to'ldirilganligini tekshirish
  const isPaymentComplete = useMemo(() => {
    return totalEntered >= totalFirstPayment;
  }, [totalEntered, totalFirstPayment]);

  // Modal yopilganda state'ni tozalash
  const handleClose = useCallback(() => {
    setCashPayment(0);
    setCardPayment(0);
    setTerminalPayment(0);
    onClose();
  }, [onClose]);

  // Yuborish bosilganda
  const handleSubmit = useCallback(async () => {
    if (!isPaymentComplete) return;

    // Agar onConfirm funksiyasi mavjud bo'lsa, unga payments qo'shib yuboramiz
    if (onConfirm) {
      // Avvalgi logika: useInvoice hook'idan foydalanish
      // Lekin payments array'ni qo'shish uchun, onConfirm'ga paymentData yuboramiz
      onConfirm({
        cash: cashPayment || 0,
        card: cardPayment || 0,
        terminal: terminalPayment || 0,
      });
      return;
    }

    // Agar onConfirm bo'lmasa, to'g'ridan-to'g'ri yuborish (bu holat bo'lmasligi kerak)
    alert('Xatolik: onConfirm funksiyasi topilmadi', { type: 'error' });
  }, [isPaymentComplete, cashPayment, cardPayment, terminalPayment, onConfirm]);

  // Modal footer
  const modalFooter = (
    <Row gap={2} justify="space-between" direction="row">
      <Button variant="outlined" onClick={handleClose} disabled={isLoading}>
        Bekor qilish
      </Button>
      <Button
        variant="filled"
        onClick={handleSubmit}
        disabled={!isPaymentComplete || isLoading}
        isLoading={isLoading}
      >
        Yuborish
      </Button>
    </Row>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Invoice yuborish"
      footer={modalFooter}
      size="md"
      preventScroll
    >
      <div className={styles['invoice-payment-modal']}>
        {/* Selected devices info */}
        <div className={styles['devices-info']}>
          <div className={styles['info-icon-wrapper']}>
            <span className={styles['info-icon']}>i</span>
          </div>
          <Typography element="p" className={styles['info-text']}>
            Diqqat siz ushbu{' '}
            {selectedDeviceData.length === 1 && selectedDeviceData[0]?.name ? (
              <>
                '<strong>{selectedDeviceData[0].name}</strong>' qurilmasi
                bo'yicha
              </>
            ) : (
              "qurilmalari bo'yicha"
            )}{' '}
            boshlang'ich{' '}
            <strong className={styles['amount-highlight']}>
              {formatNumberWithSeparators(totalFirstPayment)} uzs
            </strong>{' '}
            miqdorida to'lov qilishingiz kerak.
          </Typography>
        </div>

        {/* Payment inputs */}
        <div className={styles['payment-inputs']}>
          <Row direction="column" gap={3}>
            {/* Naqd pul */}
            <Col fullWidth>
              <div className={styles['input-with-magnet']}>
                <Input
                  type="text"
                  label="Naqd pulda"
                  value={formatInputValue(cashPayment)}
                  onChange={(e) => handleInputChange(e, setCashPayment)}
                  placeholder="0 uzs"
                  inputMode="numeric"
                  variant="outlined"
                  width="100%"
                />
                <div
                  className={styles['magnet-icon']}
                  onClick={() => handleMagnetClick('cash')}
                  title="Qolgan summani to'ldirish"
                >
                  <Magnet size={18} />
                </div>
              </div>
            </Col>

            {/* Karta orqali */}
            <Col fullWidth>
              <div className={styles['input-with-magnet']}>
                <Input
                  type="text"
                  label="Karta orqali"
                  value={formatInputValue(cardPayment)}
                  onChange={(e) => handleInputChange(e, setCardPayment)}
                  placeholder="0 uzs"
                  inputMode="numeric"
                  variant="outlined"
                  width="100%"
                />
                <div
                  className={styles['magnet-icon']}
                  onClick={() => handleMagnetClick('card')}
                  title="Qolgan summani to'ldirish"
                >
                  <Magnet size={18} />
                </div>
              </div>
            </Col>

            {/* Terminal orqali */}
            <Col fullWidth>
              <div className={styles['input-with-magnet']}>
                <Input
                  type="text"
                  label="Terminal orqali"
                  value={formatInputValue(terminalPayment)}
                  onChange={(e) => handleInputChange(e, setTerminalPayment)}
                  placeholder="0 uzs"
                  inputMode="numeric"
                  variant="outlined"
                  width="100%"
                />
                <div
                  className={styles['magnet-icon']}
                  onClick={() => handleMagnetClick('terminal')}
                  title="Qolgan summani to'ldirish"
                >
                  <Magnet size={18} />
                </div>
              </div>
            </Col>
          </Row>
        </div>

        {/* Success message */}
        {isPaymentComplete && (
          <div className={styles['success-message']}>
            <Row align="center" gap={5} justify="center" direction="row">
              <span className={styles['check-icon']}>✓</span>
              <Typography element="p" className={styles['success-text']}>
                Shartnoma tuzish uchun hamma narsa yetarli 😊
              </Typography>
            </Row>
          </div>
        )}
      </div>
    </Modal>
  );
}
