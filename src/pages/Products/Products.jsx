import { Col, Row, Typography } from '@/components/ui';
import Table from '@/components/ui/Table';
import ProductModal from '@/features/products/components/ProductModal';
import ProductsFilter from '@/features/products/components/ProductsFilter';
import ProductsFooter from '@/features/products/components/ProductsFooter';
import { useProductsTableColumns } from '@/features/products/hooks/useProductsTableColumns';
import useFetchProducts from '@/hooks/data/products/useFetchProducts';
import useIsMobile from '@/hooks/useIsMobile';
import { useState } from 'react';
import { useSelector } from 'react-redux';

export default function Products() {
  const { productsTableColumns } = useProductsTableColumns();
  const [isProductModalInfoOpen, setProductModalInfoOpen] = useState(false);
  const [chosenProduct, setChosenProduct] = useState(null);
  const isMobile = useIsMobile();
  const { currentPage, pageSize, filter } = useSelector(
    (state) => state.page.products
  );
  const { search, condition } = filter || {};
  const { data, isLoading } = useFetchProducts({
    search,
    condition,
    limit: pageSize,
    offset: currentPage * pageSize,
  });
  return (
    <>
      <Row gutter={4}>
        <Col fullWidth>
          <Row
            direction="row"
            gutter={4}
            align="center"
            justify="space-between"
          >
            <Col flexGrow span={isMobile ? 8 : 12}>
              <Typography variant="h5">Mahsulotlar</Typography>
            </Col>
            <Col fullWidth flexGrow span={isMobile ? 15 : 7}>
              <ProductsFilter />
            </Col>
          </Row>
        </Col>
        <Col fullWidth>
          <Table
            id="products-table"
            uniqueKey="ItemCode"
            scrollable
            showPivotColumn
            columns={productsTableColumns}
            data={data?.items}
            isLoading={isLoading}
            rowNumberOffset={currentPage * pageSize}
            onRowClick={(row) => {
              setChosenProduct(row);
              setProductModalInfoOpen(true);
            }}
            getRowStyles={() => {}}
          />
          <ProductsFooter
            meta={{ total: data?.total, totalPage: data?.totalPage }}
          />
        </Col>
      </Row>
      <ProductModal
        currentProduct={chosenProduct}
        isOpen={isProductModalInfoOpen}
        onClose={() => setProductModalInfoOpen(false)}
      />
    </>
  );
}
