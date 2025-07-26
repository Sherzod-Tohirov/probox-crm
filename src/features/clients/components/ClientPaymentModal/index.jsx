import moment from 'moment';
import styles from './clientPaymentModal.module.scss';
import { AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { memo, useEffect, useMemo, useState } from 'react';
import { Modal, Input, Typography, Row, Col, Button } from '@components/ui';
import RadioInput from './RadioInput';
import useFetchCurrency from '@hooks/data/useFetchCurrency';
import formatterCurrency from '@utils/formatterCurrency';
import {
  CURRENCY_MAP,
  PAYMENT_ACCOUNTS,
  CLIENT_PAYMENT_ERROR_MESSAGES,
} from '@utils/constants';
import useMutateClientPaymentModal from '@hooks/data/clients/useMutateClientPayment';
import { useQueryClient } from '@tanstack/react-query';
import { ClipLoader } from 'react-spinners';

const ModalFooter = memo(({ onClose, isLoading = false, isValid = false }) => (
  <Row direction="row" align="center" justify="center" gutter={4}>
    <Col flexGrow>
      <Button fullWidth variant="filled" color="danger" onClick={onClose}>
        Bekor qilish
      </Button>
    </Col>
    <Col flexGrow>
      <Button
        fullWidth
        form="payment_form"
        variant="filled"
        isLoading={isLoading}
        disabled={!isValid}
        type="submit"
      >
        Tasdiqlash
      </Button>
    </Col>
  </Row>
));

export default function ClientPaymentModal({ isOpen, onClose }) {
  const { register, handleSubmit, control, reset, setValue, watch } = useForm({
    mode: 'onChange',
    defaultValues: {
      sum: 0,
      date: moment().format('DD.MM.YYYY'),
      paymentType: 'cash',
      account: '5040',
    },
  });

  const [currencyDate, setCurrencyDate] = useState(
    moment().format('YYYY.MM.DD')
  );
  const [isValid, setIsValid] = useState(true);
  const [hasError, setHasError] = useState({ sum: false });
  const queryClient = useQueryClient();
  const paymentType = watch('paymentType');
  const sum = watch('sum');
  const date = watch('date');
  const { data: currencyData, isLoading: isCurrencyLoading } = useFetchCurrency(
    { date: currencyDate }
  );

  const currenctClient = useSelector(
    (state) => state.page.clients.currentClient
  );

  useEffect(() => {
    const formattedDate = moment(date, 'DD.MM.YYYY').format('YYYY.MM.DD');
    if (!moment(formattedDate).isSame(currencyDate)) {
      setCurrencyDate(formattedDate);
      queryClient.invalidateQueries({ queryKey: ['currency', formattedDate] });
    }
  }, [date, queryClient]);

  useEffect(() => {
    let currenctClientSum = Number(currenctClient['InsTotal']);
    if (!(paymentType === 'cash' || paymentType === 'visa')) {
      currenctClientSum *= Number(currencyData?.['Rate']);
    }

    if (sum > currenctClientSum) {
      setHasError((prev) => ({ ...prev, sum: 'sumNotGreaterThanInsTotal' }));
      setIsValid(false);
    } else {
      setHasError((prev) => ({ ...prev, sum: false }));
      setIsValid(true);
    }
  }, [sum, paymentType, currencyData, currenctClient]);

  const branchOptions = useMemo(
    () => [
      { value: '5040', label: 'Qoratosh' },
      { value: '5010', label: "Sag'bon" },
    ],
    []
  );

  const currency = useMemo(
    () => (paymentType === 'cash' || paymentType === 'visa' ? 'USD' : 'UZS'),
    [paymentType]
  );

  const mutation = useMutateClientPaymentModal({
    onSuccess: () => {
      onClose();
      reset();
    },
  });

  // Validation for sum
  // const validateSum = (value) => {
  //   let currenctClientSum = currenctClient?.InsTotal || 0;
  //   if (currency === "UZS" && currencyData?.Rate) {
  //     currenctClientSum = currenctClientSum * currencyData.Rate;
  //   }
  //   if (Number(value) > currenctClientSum) {
  //     return CLIENT_PAYMENT_ERROR_MESSAGES.sumNotGreaterThanInsTotal;
  //   }
  //   return true;
  // };

  const handlePriceChange = (e) => {
    let value = e.target.value.replace(/[^0-9.,-]/g, '');
    if (value === '' || value === '.' || value === '-') {
      setValue('sum', value);
      return;
    }
    const numericValue = Number(value.replace(/,/g, ''));
    setValue('sum', numericValue);
  };

  const onPaymentApply = (data) => {
    const formattedDate = moment(data.date, 'DD.MM.YYYY').format('YYYY-MM-DD');
    const normalizedData = {
      CardCode: currenctClient?.CardCode,
      CashSum: data.sum,
      DocDate: formattedDate,
      ...(data.paymentType !== 'cash' && data.paymentType !== 'visa'
        ? {
            DocRate: currencyData?.Rate,
          }
        : {}),
      CashAccount:
        paymentType === 'cash'
          ? data.account
          : PAYMENT_ACCOUNTS[data.paymentType],
      BankChargeAmount: 0,
      PaymentInvoices: [
        {
          SumApplied: data.sum,
          InstallmentId: currenctClient?.InstlmntID,
          DocEntry: currenctClient?.DocEntry,
        },
      ],
      DocCurrency: currency,
    };
    mutation.mutate(normalizedData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="To'lov qo'shish"
      footer={
        <ModalFooter
          isValid={isValid}
          onClose={onClose}
          isLoading={mutation.isPending}
        />
      }
    >
      <form
        id="payment_form"
        className={styles['modal-form']}
        onSubmit={handleSubmit(onPaymentApply)}
      >
        <Row direction={{ xs: 'column', md: 'row' }} gutter={4}>
          <Col fullWidth>
            <Row gutter={1}>
              <Col flexGrow>
                <Typography element="span" className={styles['modal-text']}>
                  <strong>Oylik to'lov:</strong>{' '}
                  {formatterCurrency(currenctClient?.InsTotal || 0, 'usd')}
                </Typography>
              </Col>
              <Col fullWidth>
                <Input
                  size="full"
                  error={
                    hasError.sum
                      ? CLIENT_PAYMENT_ERROR_MESSAGES[
                          hasError.sum || 'sumNotGreaterThanInsTotal'
                        ]
                      : ''
                  }
                  value={
                    sum === ''
                      ? ''
                      : formatterCurrency(sum, 'UZS')
                          .replace(/UZS|USD/, '')
                          .trim()
                  }
                  onChange={handlePriceChange}
                  type="text"
                  variant="outlined"
                  iconText={CURRENCY_MAP[currency]}
                  placeholder="Miqdorni kiriting..."
                  placeholderColor={'secondary'}
                  name={'sum'}
                />
              </Col>
            </Row>
          </Col>
          <Col fullWidth>
            <Row gutter={1}>
              <Col>
                <Typography element="span" className={styles['modal-text']}>
                  <strong> Kurs:</strong>{' '}
                  {isCurrencyLoading ? (
                    <ClipLoader size={12} />
                  ) : (
                    formatterCurrency(currencyData?.Rate || 0)
                  )}
                </Typography>
              </Col>
              <Col fullWidth>
                <Input
                  size="full"
                  type="date"
                  control={control}
                  variant="outlined"
                  datePickerOptions={{
                    maxDate: 'today',
                  }}
                  {...register('date')}
                />
              </Col>
            </Row>
          </Col>
        </Row>
        <Row align="center" justify="center" gutter={4}>
          <Col align="center" justify="center">
            <Typography element="span" className={styles['modal-subtitle']}>
              To'lov turi
            </Typography>
          </Col>
          <Col fullWidth>
            <Row direction="row" gutter={4}>
              <Col flexGrow>
                <Row gutter={2}>
                  <Col fullWidth>
                    <RadioInput
                      id="payment_type_cash"
                      label="Naqd pul"
                      icon="walletFilled"
                      value="cash"
                      defaultChecked
                      {...register('paymentType')}
                    />
                  </Col>
                  <Col fullWidth>
                    <RadioInput
                      id="payment_type_card"
                      label="Karta"
                      icon="cardFilled"
                      value="card"
                      {...register('paymentType')}
                    />
                  </Col>
                </Row>
              </Col>
              <Col flexGrow>
                <Row gutter={2}>
                  <Col fullWidth>
                    <RadioInput
                      id="payment_type_visa"
                      label="Visa"
                      icon="cardFilled"
                      value="visa"
                      {...register('paymentType')}
                    />
                  </Col>
                  <Col fullWidth>
                    <RadioInput
                      id="payment_type_terminal"
                      label="Terminal"
                      icon="cardFilled"
                      value="terminal"
                      {...register('paymentType')}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
        <AnimatePresence mode="popLayout">
          {paymentType === 'cash' && (
            <Row
              align="center"
              justify="center"
              gutter={4}
              animated
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Col align="center" justify="center">
                <Typography element="span" className={styles['modal-subtitle']}>
                  Filialni tanlang
                </Typography>
              </Col>
              <Col fullWidth>
                <Input
                  size="full"
                  type="select"
                  variant="outlined"
                  canClickIcon={false}
                  options={branchOptions}
                  placeholder="Filialni tanlang..."
                  {...register('account')}
                />
              </Col>
            </Row>
          )}
        </AnimatePresence>
      </form>
    </Modal>
  );
}
