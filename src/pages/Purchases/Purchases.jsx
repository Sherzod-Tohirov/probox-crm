import { Col, Row } from '@/components/ui';
import PurchasesHeader from '@/features/purchases/components/PurchasesHeader';
import { PurchasesTable } from '@/features/purchases/components/PurchasesTable';

const sampleData = [
  {
    contract_no: 'YT-238745',
    courier: 'Alisher Alisherov',
    categories: ['Telefonlar', 'Maishiy texnika'],
    warehouse: 'Parkent',
    count: 24,
    created_at: '06.01.2026',
    total_cost: 120000000,
    status: 'Tasdiqlangan',
  },
  {
    contract_no: 'YT-238745',
    courier: 'Alisher Alisherov',
    categories: ['Telefonlar', 'Maishiy texnika'],
    warehouse: 'Parkent',
    count: 24,
    created_at: '06.01.2026',
    total_cost: 120000000,
    status: 'Tasdiqlangan',
  },
  {
    contract_no: 'YT-238745',
    courier: 'Alisher Alisherov',
    categories: ['Telefonlar', 'Maishiy texnika'],
    warehouse: 'Parkent',
    count: 24,
    created_at: '06.01.2026',
    total_cost: 120000000,
    status: 'Tasdiqlangan',
  },
  {
    contract_no: 'YT-238745',
    courier: 'Alisher Alisherov',
    categories: ['Telefonlar', 'Maishiy texnika'],
    warehouse: 'Parkent',
    count: 24,
    created_at: '06.01.2026',
    total_cost: 120000000,
    status: 'Tasdiqlangan',
  },
  {
    contract_no: 'YT-238745',
    courier: 'Alisher Alisherov',
    categories: ['Telefonlar', 'Maishiy texnika'],
    warehouse: 'Parkent',
    count: 24,
    created_at: '06.01.2026',
    total_cost: 120000000,
    status: 'Tasdiqlangan',
  },
  {
    contract_no: 'YT-238745',
    courier: 'Alisher Alisherov',
    categories: ['Telefonlar', 'Maishiy texnika'],
    warehouse: 'Parkent',
    count: 24,
    created_at: '06.01.2026',
    total_cost: 120000000,
    status: 'Tasdiqlangan',
  },
  {
    contract_no: 'YT-238745',
    courier: 'Alisher Alisherov',
    categories: ['Telefonlar', 'Maishiy texnika'],
    warehouse: 'Parkent',
    count: 24,
    created_at: '06.01.2026',
    total_cost: 120000000,
    status: 'Tasdiqlangan',
  },
  {
    contract_no: 'YT-238745',
    courier: 'Alisher Alisherov',
    categories: ['Telefonlar', 'Maishiy texnika'],
    warehouse: 'Parkent',
    count: 24,
    created_at: '06.01.2026',
    total_cost: 120000000,
    status: 'Tasdiqlangan',
  },
  {
    contract_no: 'YT-238745',
    courier: 'Alisher Alisherov',
    categories: ['Telefonlar', 'Maishiy texnika'],
    warehouse: 'Parkent',
    count: 24,
    created_at: '06.01.2026',
    total_cost: 120_000_000,
    status: 'Tasdiqlangan',
  },
];

export default function Purchases() {
  return (
    <Row gutter={4} style={{ height: '100%' }}>
      <Col fullWidth flexGrow>
        <PurchasesHeader pageTitle={'Sotib olish'} />
      </Col>
      <Col fullWidth flexGrow>
        <PurchasesTable data={sampleData} />
      </Col>
    </Row>
  );
}
