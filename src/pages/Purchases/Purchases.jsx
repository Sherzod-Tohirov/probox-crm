import { useState, useEffect, useMemo } from 'react';
import { Col, Row } from '@/components/ui';
import { useDispatch, useSelector } from 'react-redux';
import PurchasesHeader from '@/features/purchases/components/purchases/PurchasesHeader';
import { PurchasesTable } from '@/features/purchases/components/purchases/PurchasesTable';
import PurchasesPageFooter from '@/features/purchases/components/purchases/PurchasesPageFooter';
import { PurchasesFilterModal } from '@/features/purchases/components/modals/PurchasesFilterModal';
import { setPurchasesFilter } from '@/store/slices/purchasesPageSlice';

// Sample data generator
const generateSampleData = (total = 47) => {
  const statuses = ['Tasdiqlangan', 'Kutilmoqda', 'Rad etilgan'];
  const couriers = [
    'Alisher Alisherov',
    'Bobur Boburov',
    'Sardor Sardorov',
    'Dilshod Dilshodov',
  ];
  const warehouses = ['Parkent', 'Toshkent', 'Samarqand', 'Buxoro'];
  const categoryGroups = [
    ['Telefonlar', 'Maishiy texnika'],
    ['Telefonlar'],
    ['Maishiy texnika', 'Kompyuterlar'],
    ['Kompyuterlar'],
    ['Aksessuarlar'],
  ];

  return Array.from({ length: total }, (_, i) => ({
    id: i + 1,
    contract_no: `YT-${238745 + i}`,
    courier: couriers[i % couriers.length],
    categories: categoryGroups[i % categoryGroups.length],
    warehouse: warehouses[i % warehouses.length],
    count: Math.floor(Math.random() * 50) + 1,
    created_at: new Date(2026, 0, Math.floor(Math.random() * 20) + 1)
      .toLocaleDateString('en-GB')
      .split('/')
      .join('.'),
    total_cost: Math.floor(Math.random() * 200000000) + 50000000,
    status: statuses[i % statuses.length],
  }));
};

const SAMPLE_DATA = generateSampleData(47);

export default function Purchases() {
  const { currentPage, pageSize, filter } = useSelector(
    (state) => state.page.purchases
  );
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterOpen, setFilterOpen] = useState(false);

  const handleApplyFilter = (data) => {
    console.log(filter, 'filter');
    console.log(data, 'data');
    dispatch(setPurchasesFilter({ search: filter.search, ...data }));
    setFilterOpen(false);
  };

  const handleClearFilter = () => {
    setFilterOpen(false);
  };

  const handleSearch = (searchData) => {
    dispatch(setPurchasesFilter({ search: searchData }));
  };

  // Simulate loading delay
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [currentPage, pageSize]);

  // Paginate sample data
  const { purchases, meta } = useMemo(() => {
    const startIndex = currentPage * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = SAMPLE_DATA.slice(startIndex, endIndex);

    return {
      purchases: paginatedData,
      meta: {
        total: SAMPLE_DATA.length,
        totalPages: Math.ceil(SAMPLE_DATA.length / pageSize),
        currentPage: currentPage + 1,
        pageSize,
      },
    };
  }, [currentPage, pageSize]);

  return (
    <>
      <Row gutter={4} style={{ width: '100%' }}>
        <Col fullWidth>
          <PurchasesHeader
            pageTitle="Sotib olish"
            onOpenFilter={() => setFilterOpen(true)}
            onSearch={handleSearch}
            searchValue={filter.search}
          />
        </Col>
        <Col fullWidth>
          <PurchasesTable data={purchases} isLoading={isLoading} />
        </Col>
      </Row>
      <PurchasesFilterModal
        onClose={handleClearFilter}
        onApply={handleApplyFilter}
        isOpen={isFilterOpen}
        title="Filter"
      />
      <PurchasesPageFooter purchasesDetails={meta} />
    </>
  );
}
