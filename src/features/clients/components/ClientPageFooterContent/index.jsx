import { Row, Col, Typography, Button } from '@components/ui';
import { ClipLoader } from 'react-spinners';
import formatterCurrency from '@utils/formatterCurrency';
import hasRole from '@utils/hasRole';
import useIsMobile from '@/hooks/useIsMobile';

export default function ClientPageFooterContent({
  currentClient,
  currency,
  isCurrencyLoading,
  user,
  onAddPayment,
}) {
  const isMobile = useIsMobile();

  const calculateRemainingAmount = () => {
    if (isCurrencyLoading) return <ClipLoader color="grey" size={12} />;

    const docCurrency = currentClient?.DocCur;
    const maxTotal = parseFloat(currentClient?.['MaxDocTotal']) || 0;
    const maxTotalFC = parseFloat(currentClient?.['MaxDocTotalFC']) || 0;
    const maxTotalPaidToDate = parseFloat(currentClient?.['MaxTotalPaidToDate']) || 0;
    const maxTotalPaidToDateFC = parseFloat(currentClient?.['MaxTotalPaidToDateFC']) || 0;
    const rate = parseFloat(currency?.['Rate']) || 0;

    const remainingUZS = maxTotalFC - maxTotalPaidToDateFC;
    const remainingUSD = maxTotal - maxTotalPaidToDate;

    if (docCurrency === 'USD') {
      return (
        `${formatterCurrency(remainingUSD * rate, 'UZS')}` +
        ` (${formatterCurrency(Math.round(remainingUSD), 'USD')})`
      );
    }

    return `${formatterCurrency(remainingUZS, 'UZS')}`;
  };

  const showPaymentButton = currency?.Rate > 0 && hasRole(user, ['Manager', 'Cashier']);

  return (
    <Row direction="row" align="center" justify="space-between">
      <Typography variant={isMobile ? 'body2' : 'body1'} element="span">
        Qolgan qarzdorlik summasi: {calculateRemainingAmount()}
      </Typography>
      <Col>
        {showPaymentButton && (
          <Button variant="filled" onClick={onAddPayment}>
            To'lov qo'shish
          </Button>
        )}
      </Col>
    </Row>
  );
}
