import { useState } from 'react';
import { Col, Row } from '@/components/ui';
import { useDispatch, useSelector } from 'react-redux';
import PurchasesHeader from '@/features/purchases/components/purchases/PurchasesHeader';
import { PurchasesTable } from '@/features/purchases/components/purchases/PurchasesTable';
import PurchasesPageFooter from '@/features/purchases/components/purchases/PurchasesPageFooter';
import { PurchasesFilterModal } from '@/features/purchases/components/modals/PurchasesFilterModal';
import { setPurchasesFilter } from '@/store/slices/purchasesPageSlice';
import useFetchPurchases from '@/hooks/data/purchases/useFetchPurchases';

export default function Purchases() {
  const { currentPage, pageSize, filter } = useSelector(
    (state) => state.page.purchases
  );
  const { data: purchases, isLoading } = useFetchPurchases({
    offset: currentPage,
    limit: pageSize,
    params: filter,
  });
  const meta = {
    total: purchases?.total,
    totalPage: purchases?.totalPage,
  };

  const dispatch = useDispatch();
  const [isFilterOpen, setFilterOpen] = useState(false);

  const handleApplyFilter = (data) => {
    dispatch(setPurchasesFilter({ ...filter, ...data }));
    setFilterOpen(false);
  };

  const handleClearFilter = () => {
    setFilterOpen(false);
  };

  const handleSearch = (searchData) => {
    dispatch(setPurchasesFilter({ search: searchData }));
  };

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
          <PurchasesTable data={purchases?.items ?? []} isLoading={isLoading} />
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
