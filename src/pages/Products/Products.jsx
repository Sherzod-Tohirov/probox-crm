import { Col, Row, Typography } from '@/components/ui';
import Table from '@/components/ui/Table';
import ProductModal from '@/features/products/components/ProductModal';
import ProductsFilter from '@/features/products/components/ProductsFilter';
import ProductsFooter from '@/features/products/components/ProductsFooter';
import { useProductsTableColumns } from '@/features/products/hooks/useProductsTableColumns';
import useFetchProducts from '@/hooks/data/products/useFetchProducts';
import { useState } from 'react';


export default function Products() {
  const { productsTableColumns } = useProductsTableColumns();
  const [isProductModalInfoOpen, setProductModalInfoOpen] = useState(false);
  const [chosenProduct, setChosenProduct] = useState({});
  const { data, isLoading } = useFetchProducts();
  console.log(data, 'products');
  return (
    <>
      <Row gutter={4}>
        <Col fullWidth>
          <Row direction="row" gutter={4} align="center">
            <Col flexGrow>
              <Typography variant="h5">Mahsulotlar</Typography>
            </Col>
            <Col flexGrow>
              <ProductsFilter />
            </Col>
          </Row>
        </Col>
        <Col fullWidth>
          <Table
            id="products-table"
            uniqueKey="imei"
            scrollable
            showPivotColumn
            columns={productsTableColumns}
            data={data?.items}
            isLoading={isLoading}
            onRowClick={(row) => {
              setChosenProduct(row);
              setProductModalInfoOpen(true);
            }}
            getRowStyles={() => {}}
          />
          <ProductsFooter />
        </Col>
      </Row>
      <ProductModal
        currentProduct={chosenProduct}
        title={chosenProduct?.product_name || "Hech narsa yo'q"}
        isOpen={isProductModalInfoOpen}
        onClose={() => setProductModalInfoOpen(false)}
      />
    </>
  );
}
