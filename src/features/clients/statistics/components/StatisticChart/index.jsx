import { Col, Row, Typography } from '@components/ui';
import Chart from './Chart';

import styles from './statistic.module.scss';
import { ClipLoader } from 'react-spinners';
import useIsMobile from '@/hooks/useIsMobile';

export default function StatisticChart({
  title,
  data = [],
  keys = {},
  date = {},
  isLoading = false,
}) {
  const { isMobile, isTablet } = useIsMobile({ withDetails: true });

  const chartElement = (
    <div className={styles['chart-wrapper']} data-compact={isMobile}>
      <Chart data={data} keys={keys} isCompact={isMobile && !isTablet} />
    </div>
  );

  return (
    <div className={styles.statistic}>
      <Row direction={{ xs: 'column' }} gutter={{ xs: 2 }}>
        <Col fullWidth>
          <Row
            direction={{ xs: 'column' }}
            justify={{ xs: 'start' }}
            align={{ xs: 'start' }}
            gutter={{ xs: 1.5 }}
          >
            <Col fullWidth={isMobile}>
              <Typography
                element="strong"
                className={styles.title}
                {...(isMobile ? { variant: 'body1' } : {})}
              >
                {title ?? 'Statistika'}
              </Typography>
            </Col>
            {date?.startDate && date?.endDate ? (
              <Col fullWidth={isMobile}>
                <Typography
                  element="span"
                  className={styles.subtitle}
                  {...(isMobile ? { variant: 'body2' } : {})}
                >
                  {date.startDate} - {date.endDate}
                </Typography>
              </Col>
            ) : null}
          </Row>
        </Col>
        <Col fullWidth>
          {isLoading ? (
            <div className={styles['loader-wrapper']}>
              <ClipLoader color="#8979FF" size={isMobile ? 28 : 40} />
            </div>
          ) : data?.length > 0 ? (
            isMobile ? (
              <div className={styles['chart-scroll']}>{chartElement}</div>
            ) : (
              chartElement
            )
          ) : (
            <div className={styles['loader-wrapper']}>
              <Typography element="span" className={styles['no-data']}>
                Ma'lumotlar mavjud emas
              </Typography>
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
}
