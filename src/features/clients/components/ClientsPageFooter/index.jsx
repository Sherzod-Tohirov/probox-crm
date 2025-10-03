import { memo, useCallback, useMemo } from 'react';
import {
  Col,
  Row,
  Box,
  Button,
  Input,
  Pagination,
  Typography,
} from '@components/ui';
import Footer from '@components/Footer';
import StickyFooterPortal from '@components/Footer/StickyFooterPortal';
import { useDispatch, useSelector } from 'react-redux';
import {
  setClientsCurrentPage,
  setClientsPageSize,
} from '@store/slices/clientsPageSlice';
import formatDate from '@utils/formatDate';
import hasRole from '@utils/hasRole';
import useAuth from '@hooks/useAuth';
import useIsMobile from '@hooks/useIsMobile';
import useMutateDistributeClients from '@hooks/data/clients/useMutateDistributeClients';
import useFetchStatistics from '@hooks/data/statistics/useFetchStatistics';
import formatterCurrency from '@utils/formatterCurrency';
import { ClipLoader } from 'react-spinners';
import styles from './style.module.scss';
import { insTotalCalculator } from '@utils/calculator';
import moment from 'moment';
import orderByNearest from '@utils/orderByNearest';
import { random } from 'lodash';

const ClientsFooter = ({ clientsDetails = {}, selectedRows = [], data }) => {
  const distributeMutation = useMutateDistributeClients();
  const isMobile = useIsMobile();
  const { currentPage, pageSize, filter } = useSelector(
    (state) => state.page.clients
  );
  const { data: statisticsData, isLoading: isStatisticsLoading } =
    useFetchStatistics({
      startDate: formatDate(filter.startDate, 'DD.MM.YYYY', 'YYYY.MM.DD'),
      endDate: formatDate(filter.endDate, 'DD.MM.YYYY', 'YYYY.MM.DD'),
      slpCode: filter.slpCode,
    });
  const dispatch = useDispatch();
  const { user } = useAuth();

  const tableSizeSelectOptions = useMemo(
    () => [
      { value: 10, label: '10' },
      { value: 20, label: '20' },
      { value: 50, label: '50' },
      { value: 100, label: '100' },
      { value: 200, label: '200' },
      { value: 300, label: '300' },
    ],
    []
  );

  const handleDistributeClients = useCallback(async () => {
    try {
      const payload = {
        startDate: formatDate(filter.startDate, 'DD.MM.YYYY', 'YYYY.MM.DD'),
        endDate: formatDate(filter.endDate, 'DD.MM.YYYY', 'YYYY.MM.DD'),
      };
      distributeMutation.mutate(payload);
    } catch (error) {
      console.log(error, 'Error while distributing clients.');
    }
  }, [distributeMutation, filter.startDate, filter.endDate]);

  const handleNavigateToRoute = useCallback(() => {
    if (selectedRows.length === 0) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const currentLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        const ordered = orderByNearest(selectedRows, currentLocation);
        const url =
          'https://yandex.uz/maps/?rtext=' +
          [
            `${currentLocation.lat},${currentLocation.lng}`,
            ...ordered.map(
              ({ location }) =>
                `${location?.lat || random(41.311081, 42)},${location?.lng || random(69.240562, 70)}`
            ),
          ].join('~') +
          '&rtt=auto';

        window.open(url, '_blank');
      },
      (error) => {
        console.error('Error getting location:', error);
        const fallbackLocation = { lat: 41.311081, lng: 69.240562 };
        const ordered = orderByNearest(selectedRows, fallbackLocation);

        const url =
          'https://yandex.ru/maps/?rtext=' +
          ordered
            .map(({ location }) => `${location?.lat},${location?.lng}`)
            .join('~') +
          '&rtt=auto';

        window.open(url, '_blank');
      }
    );
  }, [selectedRows]);

  const calculatedInsTotal = useMemo(() => {
    return insTotalCalculator({
      paidToDate: statisticsData?.['PaidToDate'],
      sumApplied: statisticsData?.['SumApplied'],
      insTotal: statisticsData?.['InsTotal'],
    });
  }, [statisticsData]);

  const percentageValue = useMemo(() => {
    return parseFloat(
      Number(statisticsData?.['SumApplied'] / calculatedInsTotal) * 100 || 0
    ).toFixed(2);
  }, [statisticsData, calculatedInsTotal]);

  return (
    <StickyFooterPortal>
      <Footer className={styles['footer-container']}>
      <Row
        direction="column"
        justify="space-between"
        gutter={3}
        className={styles['row-container']}
      >
        <Col fullWidth>
          <Row
            direction="row"
            align="center"
            justify="space-between"
            className={styles['row-container']}
          >
            {!hasRole(user, ['Agent']) ? (
              <Col>
                <Box gap={1} dir="column" align="start" justify="center">
                  <Typography
                    className={styles['statistics-text']}
                    variant={isMobile ? 'body2' : 'body1'}
                    element="span"
                  >
                    <strong> To'liq summa: </strong>
                    {isStatisticsLoading ? (
                      <ClipLoader color="grey" size={12} />
                    ) : (
                      formatterCurrency(calculatedInsTotal, 'USD')
                    )}
                  </Typography>
                  <Typography
                    className={styles['statistics-text']}
                    variant={isMobile ? 'body2' : 'body1'}
                    element="span"
                  >
                    <strong> Qoplandi: </strong>
                    {isStatisticsLoading ? (
                      <ClipLoader color="grey" size={12} />
                    ) : (
                      <span style={{ color: 'green' }}>
                        {formatterCurrency(
                          statisticsData?.['SumApplied'] || 0,
                          'USD'
                        )}
                      </span>
                    )}{' '}
                    <span
                      style={{ color: percentageValue > 50 ? 'green' : 'red' }}
                    >
                      {`(${percentageValue}%)`}
                    </span>
                  </Typography>
                </Box>
              </Col>
            ) : null}
          </Row>
        </Col>
        <Col fullWidth>
          <Row
            direction="row"
            align="center"
            justify={{ xs: 'start', md: 'space-between' }}
            className={styles['row-container']}
            wrap
            gutter={4}
          >
            <Col>
              <Row
                direction="row"
                align="center"
                justify="space-between"
                gutter={2}
                className={styles['row-container']}
              >
                <Col className={styles['input-wrapper']}>
                  <Input
                    variant="outlined"
                    type="select"
                    options={tableSizeSelectOptions}
                    defaultValue={Number(pageSize)}
                    onChange={(e) => {
                      dispatch(setClientsPageSize(Number(e.target.value)));
                    }}
                    canClickIcon={false}
                  />
                </Col>
                <Col>
                  <Box className={styles['total-text-wrapper']}>
                    <Typography variant={isMobile ? 'body2' : 'body1'} element="span">
                      {clientsDetails.total > 0
                        ? currentPage * pageSize + 1
                        : 0}
                      {'-'}
                      {(currentPage + 1) * pageSize > data?.total
                        ? data.total
                        : currentPage * pageSize + pageSize}{' '}
                      gacha {clientsDetails.total}ta dan
                    </Typography>
                  </Box>
                </Col>
              </Row>
            </Col>
            <Col className={styles['pagination-wrapper']}>
              <Pagination
                pageCount={clientsDetails.totalPages}
                activePage={currentPage}
                onPageChange={(page) =>
                  dispatch(setClientsCurrentPage(page.selected))
                }
              />
            </Col>
            {hasRole(user, ['Manager']) ? (
              <Col className={styles['button-wrapper']} fullWidth={isMobile}>
                <Button
                  // disabled={moment().date() !== 1}
                  variant="filled"
                  onClick={handleDistributeClients}
                  isLoading={distributeMutation.isPending}
                  fullWidth
                >
                  Mijozlarni taqsimlash
                </Button>
              </Col>
            ) : null}
            {hasRole(user, ['Agent']) ? (
              <Col flexGrow={isMobile} className={styles['button-wrapper']}>
                <Button
                  fullWidth={isMobile}
                  disabled={selectedRows.length === 0}
                  onClick={handleNavigateToRoute}
                  color="info"
                >
                  Marshrutga o'tish
                </Button>
              </Col>
            ) : null}
          </Row>
        </Col>
      </Row>
        </Footer>
    </StickyFooterPortal>
    
  );
};

export default memo(ClientsFooter);
