import { Col, Modal, Row } from '@/components/ui';
import { useProductsTableColumns } from '../hooks/useProductsTableColumns';
import Table from '@/components/ui/Table';
import useFetchProductItems from '@/hooks/data/products/useFetchProductItems';

const sampleData = [
  {
    product_name: 'Iphone 16 Pro Max 16 Pro Max',
    imei: '433535938945834',
    status: 'new',
    battery: 80,
    branch: 'Qoratosh',
    price: 12000000,
  },
  {
    product_name: 'Iphone 16 Pro Max 13 Pro',
    imei: '433535938945835',
    status: 'old',
    battery: 70,
    branch: 'Qoratosh',
    price: 11000000,
  },
  {
    product_name: 'Iphone 16 Pro Max 16 Pro Max',
    imei: '433535938945836',
    status: 'new',
    battery: 90,
    branch: "Sag'bon",
    price: 13000000,
  },
  {
    product_name: 'Iphone 16 Pro Max 14 Pro Max',
    imei: '533535938945836',
    status: 'new',
    battery: 85,
    branch: 'Parkent',
    price: 9000000,
  },
  {
    product_name: 'Iphone 16 Pro Max 17 Pro',
    imei: '433535938945837',
    status: 'old',
    battery: 60,
    branch: 'Parkent',
    price: 10000000,
  },
  {
    product_name: 'Iphone 16 Pro Max 17 Pro',
    imei: '433535938945838',
    status: 'new',
    battery: 95,
    branch: 'Parkent',
    price: 14000000,
  },
];

export default function ProductModal({ currentProduct, isOpen, onClose }) {
  const { productTableColumns } = useProductsTableColumns();
  const { data, isLoading } = useFetchProductItems({
    itemCode: currentProduct?.ItemCode,
    whsCode: currentProduct?.WhsCode,
  });
  console.log(data, 'data product');
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
