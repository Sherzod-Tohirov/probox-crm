import { Col, Modal, Row } from '@/components/ui';
import { useProductsTableColumns } from '../hooks/useProductsTableColumns';
import Table from '@/components/ui/Table';
import useFetchProductItems from '@/hooks/data/products/useFetchProductItems';

export default function ProductModal({ currentProduct, isOpen, onClose }) {
  const { productTableColumns } = useProductsTableColumns();
  const { data, isLoading } = useFetchProductItems({
    itemCode: currentProduct?.ItemCode,
    whsCode: currentProduct?.WhsCode,
  });
  return (
    <Modal
      size="lg"
      title={currentProduct?.name || "Hech narsa yo'q"}
      isOpen={isOpen}
      onClose={onClose}
    >
      <Row>
        <Col fullWidth flexGrow>
          <Table
            id="product-table"
            uniqueKey="imei"
            scrollable
            showPivotColumn
            isLoading={isLoading}
            columns={productTableColumns}
            data={data?.items || []}
            getRowStyles={() => {}}
          />
        </Col>
      </Row>
    </Modal>
  );
}
