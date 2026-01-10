import Footer from '@/components/Footer';
import StickyFooterPortal from '@/components/Footer/StickyFooterPortal';
import { Row, Col, Typography, Pagination, Input } from '@/components/ui';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import {
  setProductsCurrentPage,
  setProductsPageSize,
} from '@/store/slices/productsPageSlice';

const tableSizeSelectOptions = [
  { value: 10, label: '10' },
  { value: 20, label: '20' },
  { value: 50, label: '50' },
  { value: 100, label: '100' },
];

export default function ProductsFooter({ meta }) {
  const { currentPage, pageSize } = useSelector((state) => state.page.products);
  const dispatch = useDispatch();
  return (
    <StickyFooterPortal>
      <Footer className={style['footer-container']}>
        <Row direction="row" gutter={4} justify="space-between" align="center">
          <Col>
            <Row direction="row" align="center" gutter={3}>
              <Col>
                <Input
                  variant="outlined"
                  type="select"
                  options={tableSizeSelectOptions}
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
          <Col>
            <Pagination
              pageCount={meta.total}
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
