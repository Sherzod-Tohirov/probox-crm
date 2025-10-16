import formatDate from '@/utils/formatDate';
import formatterCurrency from '@/utils/formatterCurrency';
import { Modal, Box, Col, Row, Typography, Table } from '@components/ui';
import { useMemo } from 'react';
import styles from './style.module.scss';
import useFetchCurrency from '@/hooks/data/useFetchCurrency';
import useTheme from '@hooks/useTheme';

export default function PaysListInfoModal({ isOpen, onClose, data }) {
  const { data: currency } = useFetchCurrency();
  const { currentTheme } = useTheme();
  const paysListTableColumns = useMemo(
    () => [
      {
        key: 'DocDate',
        title: 'Sana',
        renderCell: (item) => (
          <Typography className={styles.tableText}>
            {item?.DocDate ? formatDate(item.DocDate) : '-'}
          </Typography>
        ),
        width: '15%',
      },
      {
        key: 'AcctName',
        title: 'Kassa',
        renderCell: (item) => (
          <Typography className={styles.tableSecondaryText}>
            {item?.AcctName || 'Belgilanmagan'}
          </Typography>
        ),
        width: '60%',
      },
      {
        key: 'SumApplied',
        title: 'Summa',
        renderCell: (item) => {
          // Safe number parsing with fallback
          const sumApplied = parseFloat(item.SumApplied) || 0;
          const sumAppliedFC = parseFloat(item.SumAppliedFC) || 0;
          const rate = parseFloat(currency?.['Rate']) || 0;
          
          const value =
            item.Currency === 'USD'
              ? sumApplied * rate
              : sumAppliedFC;
          return (
            <Typography align="left" className={styles.tableAmountText}>
              {formatterCurrency(value, 'UZS')}

              {item.Currency === 'USD' && (
                <span
                  style={{
                    fontWeight: 900,
                    color: currentTheme === 'dark' ? 'steelblue' : 'steelblue',
                  }}
                >
                  {' '}
                  ({formatterCurrency(Math.round(sumApplied), 'USD')})
                </span>
              )}
            </Typography>
          );
        },
        width: '25%',
      },
    ],
    [currency, currentTheme]
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="To'lovlar ma'lumoti"
      size="lg"
    >
      <Row gutter={4}>
        <Col fullWidth>
          <Box dir="column" gap={3}>
            {/* Product Info */}
            <Row gutter={3}>
              <Col fullWidth>
                <Box dir="column" gap={1.5}>
                  <Typography
                    variant="subtitle1"
                    className={styles.sectionTitle}
                  >
                    Mahsulot ma'lumoti
                  </Typography>
                  <Box padding={4} className={styles.productInfoCard}>
                    <Row gutter={3}>
                      <Col span={{ xs: 24, sm: 12 }}>
                        <Box dir="column" gap={0.5}>
                          <Typography
                            variant="caption"
                            className={styles.labelText}
                          >
                            Mahsulot nomi
                          </Typography>
                          <Typography
                            variant="body1"
                            className={styles.valueText}
                          >
                            {data?.Dscription || 'Belgilanmagan'}
                          </Typography>
                        </Box>
                      </Col>
                      <Col span={{ xs: 24, sm: 12 }}>
                        <Box dir="column" gap={0.5}>
                          <Typography
                            variant="caption"
                            className={styles.labelText}
                          >
                            Muddat sanasi
                          </Typography>
                          <Typography
                            variant="body1"
                            className={styles.valueText}
                          >
                            {data?.DueDate
                              ? formatDate(data.DueDate)
                              : 'Belgilanmagan'}
                          </Typography>
                        </Box>
                      </Col>
                    </Row>
                  </Box>
                </Box>
              </Col>
            </Row>

            {/* Payments Section */}
            <Row gutter={3}>
              <Col fullWidth>
                <Box dir="column" gap={1.5}>
                  <Box dir="row" align="center" justify="space-between">
                    <Box>
                      <Typography
                        variant="subtitle1"
                        className={styles.sectionTitle}
                      >
                        To'lovlar tarixi
                      </Typography>
                    </Box>
                    {data?.PaysList?.length > 0 && (
                      <Box
                        padding={0.5}
                        paddingX={1}
                        className={styles.summaryBadge}
                      >
                        {data.PaysList.length} ta to'lov ={' '}
                        {formatterCurrency(
                          data.PaysList.reduce(
                            (sum, payment) =>
                              sum + (Number(payment?.SumApplied) || 0),
                            0
                          ),
                          'USD'
                        )}
                      </Box>
                    )}
                  </Box>

                  {data?.PaysList?.length > 0 ? (
                    <Box className={styles.tableContainer}>
                      <Table
                        columns={paysListTableColumns}
                        data={data.PaysList}
                        containerStyle={{ maxHeight: '350px' }}
                        scrollable
                      />
                    </Box>
                  ) : (
                    <Box
                      align="center"
                      justify="center"
                      padding={6}
                      className={styles.emptyStateContainer}
                    >
                      <Box dir="column" align="center" gap={1}>
                        <div className={styles.emptyIconContainer}>
                          <Typography className={styles.emptyIconText}>
                            💳
                          </Typography>
                        </div>
                        <Typography
                          variant="body1"
                          className={styles.emptyTitleText}
                        >
                          Hali to'lovlar yo'q
                        </Typography>
                        <Typography
                          variant="body2"
                          className={styles.emptyDescriptionText}
                        >
                          Bu mahsulot uchun hali to'lovlar amalga oshirilmagan
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </Box>
              </Col>
            </Row>
          </Box>
        </Col>
      </Row>
    </Modal>
  );
}
