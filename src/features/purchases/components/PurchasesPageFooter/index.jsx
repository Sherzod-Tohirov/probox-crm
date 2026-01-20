import { memo, useMemo } from 'react';
import { Col, Row, Box, Input, Pagination, Typography } from '@components/ui';
import Footer from '@components/Footer';
import StickyFooterPortal from '@components/Footer/StickyFooterPortal';
import { useDispatch, useSelector } from 'react-redux';
import styles from './style.module.scss';
import {
  setPurchasesCurrentPage,
  setPurchasesPageSize,
} from '@store/slices/purchasesPageSlice';

const PurchasesPageFooter = ({ purchasesDetails = {} }) => {
  const dispatch = useDispatch();
  const { currentPage, pageSize } = useSelector(
    (state) => state.page.purchases
  );
  const tableSizeSelectOptions = useMemo(
    () => [
      { value: 10, label: '10' },
      { value: 20, label: '20' },
      { value: 50, label: '50' },
      { value: 100, label: '100' },
      { value: 200, label: '200' },
    ],
    []
  );

  return (
    <StickyFooterPortal>
      <Footer className={styles['footer-container']}>
        <Row
          direction="row"
          align="center"
          justify={{ xs: 'start', md: 'space-between' }}
          wrap
          gutter={4}
        >
          <Col>
            <Row
              direction="row"
              align="center"
              justify="space-between"
              gutter={2}
            >
              <Col>
                <Input
                  variant="outlined"
                  type="select"
                  options={tableSizeSelectOptions}
                  value={Number(pageSize)}
                  onChange={(value) => {
                    dispatch(setPurchasesPageSize(Number(value)));
                  }}
                  canClickIcon={false}
                />
              </Col>
              <Col>
                <Box>
                  <Typography variant="body2">
                    {purchasesDetails.total > 0
                      ? currentPage * pageSize + 1
                      : 0}
                    {'-'}
                    {(currentPage + 1) * pageSize > purchasesDetails.total
                      ? purchasesDetails.total
                      : currentPage * pageSize + pageSize}{' '}
                    gacha {purchasesDetails.total}ta dan
                  </Typography>
                </Box>
              </Col>
            </Row>
          </Col>
          <Col>
            <Pagination
              pageCount={purchasesDetails.totalPages}
              activePage={currentPage}
              onPageChange={(page) =>
                dispatch(setPurchasesCurrentPage(page.selected))
              }
            />
          </Col>
        </Row>
      </Footer>
    </StickyFooterPortal>
  );
};

export default memo(PurchasesPageFooter);
