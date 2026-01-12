import style from './style.module.scss';
import Footer from '@/components/Footer';
import StickyFooterPortal from '@/components/Footer/StickyFooterPortal';
import { Row, Col, Typography, Pagination, Input } from '@/components/ui';
import { useDispatch, useSelector } from 'react-redux';
import {
  setProductsCurrentPage,
  setProductsPageSize,
} from '@/store/slices/productsPageSlice';
import useIsMobile from '@/hooks/useIsMobile';
import { PRODUCTS_PAGE_SIZE_OPTIONS } from '../utils/options';

export default function ProductsFooter({ meta }) {
  const { currentPage, pageSize } = useSelector((state) => state.page.products);
  const dispatch = useDispatch();
  const { isMobile } = useIsMobile({ withDetails: true });
  return (
    <StickyFooterPortal>
      <Footer className={style['footer-container']}>
        <Row
          direction="row"
          gutter={4}
          justify="space-between"
          align="center"
          wrap
        >
          <Col>
            <Row direction="row" align="center" gutter={3}>
              <Col>
                <Input
                  variant="outlined"
                  type="select"
                  options={PRODUCTS_PAGE_SIZE_OPTIONS}
                  value={Number(pageSize)}
                  onChange={(value) => {
                    dispatch(setProductsPageSize(Number(value)));
                  }}
                  canClickIcon={false}
                />
              </Col>
              <Col>
                <Typography variant="body1">
                  {currentPage * pageSize + 1}-{(currentPage + 1) * pageSize}{' '}
                  gacha {meta.total} ta dan
                </Typography>
              </Col>
            </Row>
          </Col>
          <Col flexGrow={isMobile}>
            <Pagination
              pageCount={meta.total ?? 0}
              activePage={currentPage}
              onPageChange={({ selected }) => {
                dispatch(setProductsCurrentPage(selected));
              }}
            />
          </Col>
        </Row>
      </Footer>
    </StickyFooterPortal>
  );
}
