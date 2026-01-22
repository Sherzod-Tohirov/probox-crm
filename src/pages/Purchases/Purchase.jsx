import { Col, Row } from '@/components/ui';
import PurchaseHeader from '@/features/purchases/components/purchase/PurchaseHeader';
import PurchasePageFooter from '@/features/purchases/components/purchase/PurchasePageFooter';
import PurchaseTable from '@/features/purchases/components/purchase/PurchaseTable';

const sampleData = [
  {
    product_name: 'Iphone 16 Pro Max',
    product_code: 'YT-95267985',
    category: 'Maishiy texnika',
    imei: '352099001234567',
    status: 'Yangi',
    battery: '100%',
    count: 1,
    price: 15000000,
  },
  {
    product_name: 'Samsung Galaxy S24 Ultra',
    product_code: 'YT-95267986',
    category: 'Telefonlar',
    imei: '352099001234568',
    status: 'Yangi',
    battery: '100%',
    count: 1,
    price: 12000000,
  },
  {
    product_name: 'MacBook Pro 14',
    product_code: 'YT-95267987',
    category: 'Kompyuterlar',
    imei: '352099001234569',
    status: 'Yangi',
    battery: '95%',
    count: 1,
    price: 25000000,
  },
  {
    product_name: 'iPad Air',
    product_code: 'YT-95267988',
    category: 'Planshetlar',
    imei: '352099001234570',
    status: 'Yangi',
    battery: '100%',
    count: 2,
    price: 8000000,
  },
  {
    product_name: 'AirPods Pro',
    product_code: 'YT-95267989',
    category: 'Aksessuarlar',
    imei: '352099001234571',
    status: 'Yangi',
    battery: '100%',
    count: 5,
    price: 2500000,
  },
  {
    product_name: 'Sony WH-1000XM5',
    product_code: 'YT-95267990',
    category: 'Aksessuarlar',
    imei: '352099001234572',
    status: 'Yangi',
    battery: '90%',
    count: 3,
    price: 3500000,
  },
  {
    product_name: 'Dell XPS 15',
    product_code: 'YT-95267991',
    category: 'Kompyuterlar',
    imei: '352099001234573',
    status: 'B/U',
    battery: '85%',
    count: 1,
    price: 18000000,
  },
  {
    product_name: 'LG OLED TV 55"',
    product_code: 'YT-95267992',
    category: 'Maishiy texnika',
    imei: '352099001234574',
    status: 'Yangi',
    battery: '100%',
    count: 1,
    price: 20000000,
  },
  {
    product_name: 'Xiaomi 13 Pro',
    product_code: 'YT-95267993',
    category: 'Telefonlar',
    imei: '352099001234575',
    status: 'B/U',
    battery: '100%',
    count: 4,
    price: 7000000,
  },
  {
    product_name: 'Apple Watch Series 9',
    product_code: 'YT-95267994',
    category: 'Aksessuarlar',
    imei: '352099001234576',
    status: 'Yangi',
    battery: '100%',
    count: 2,
    price: 4500000,
  },
  {
    product_name: 'Samsung Galaxy Tab S9',
    product_code: 'YT-95267995',
    category: 'Planshetlar',
    imei: '352099001234577',
    status: 'Yangi',
    battery: '98%',
    count: 1,
    price: 9000000,
  },
];

export default function Purchase() {
  return (
    <>
      <Row gutter={6}>
        <Col fullWidth>
          <PurchaseHeader />
        </Col>
        <Col fullWidth>
          <PurchaseTable data={sampleData} />
        </Col>
      </Row>
      <PurchasePageFooter />
    </>
  );
}
