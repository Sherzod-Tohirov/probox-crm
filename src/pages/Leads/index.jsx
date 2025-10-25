import { useCallback, useState, useEffect, useDeferredValue } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Col, Row, Table } from '@components/ui';
import LeadsToolbar from '@features/leads/components/LeadsToolbar';
import LeadsFilter from '@features/leads/components/Filter';
import LeadsPageFooter from '@features/leads/components/LeadsPageFooter';
import useLeadsTableColumns from '@features/leads/hooks/useLeadsTableColumns';
import useUIScale from '@/features/clients/hooks/useUIScale';
import useTableDensity from '@/features/clients/hooks/useTableDensity';
import useIsMobile from '@hooks/useIsMobile';
import {
  setCurrentLead,
  setLeadsCurrentPage,
  setLeadsFilter,
} from '@store/slices/leadsPageSlice';
import useFetchLeads from '@/hooks/data/leads/useFetchLeads';
import useTheme from '@/hooks/useTheme';

export default function Leads() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isMobile = useIsMobile();
  const { currentTheme } = useTheme();
  const { leadsTableColumns } = useLeadsTableColumns();
  const { currentPage, pageSize, filter, currentLead } = useSelector(
    (state) => state.page.leads
  );
  const {
    data: { data: leads, ...meta } = {
      data: [],
      meta: {},
    },
    isLoading: isLoadingLeads,
  } = useFetchLeads({
    page: currentPage,
    limit: pageSize,
    params: filter,
  });

  const [toggleFilter, setToggleFilter] = useState(false);

  const {
    uiScale,
    increaseScale,
    decreaseScale,
    resetScale,
    canIncrease,
    canDecrease,
    isDefault: isDefaultUI,
  } = useUIScale();

  const {
    tableDensityClass,
    increaseDensity,
    decreaseDensity,
    resetDensity,
    isMinDensity,
    isMaxDensity,
    isDefaultDensity,
  } = useTableDensity('leadsTableDensity');

  const handleFilter = useCallback((filterData) => {
    dispatch(setLeadsFilter(filterData));
    setToggleFilter(false);
  }, []);

  const handleRowClick = useCallback(
    (row) => {
      dispatch(setCurrentLead(row));
      navigate(`/leads/${row.id}`);
    },
    [dispatch, navigate]
  );

  // Keep current page in bounds when filters change
  useEffect(() => {
    if (currentPage >= meta.totalPages) {
      dispatch(setLeadsCurrentPage(Math.max(1, meta.totalPages)));
    }
  }, [meta, dispatch]);

  // Defer large dataset to keep other UI responsive
  // const deferredLeads = useDeferredValue(leads);
  // const shouldVirtualize = (deferredLeads?.length || 0) > 100;
  // const virtualizedHeight = isMobile ? 500 : 600; // px

  return (
    <>
      <Row gutter={isMobile ? 2 : 6} style={{ width: '100%', height: '100%' }}>
        <Col fullWidth>
          <Row gutter={isMobile ? 4 : 6}>
            <Col fullWidth>
              <LeadsToolbar
                uiScale={uiScale}
                onIncreaseUIScale={increaseScale}
                onDecreaseUIScale={decreaseScale}
                onResetUIScale={resetScale}
                onIncreaseDensity={increaseDensity}
                onDecreaseDensity={decreaseDensity}
                onResetDensity={resetDensity}
                onToggleFilter={() => setToggleFilter((prev) => !prev)}
                isMobile={isMobile}
                canIncreaseUI={canIncrease}
                canDecreaseUI={canDecrease}
                isDefaultUI={isDefaultUI}
                isMinDensity={isMinDensity}
                isMaxDensity={isMaxDensity}
                isDefaultDensity={isDefaultDensity}
              />
            </Col>
            <Col fullWidth>
              <LeadsFilter
                onFilter={handleFilter}
                isExpanded={isMobile ? toggleFilter : true}
              />
            </Col>
          </Row>
        </Col>
        <Col fullWidth>
          <Table
            id={'leads-table'}
            scrollable
            uniqueKey={'id'}
            isLoading={isLoadingLeads}
            columns={leadsTableColumns}
            data={leads}
            maxBodyHeight={
              isMobile ? 'calc(100vh - 400px)' : 'calc(100vh - 600px)'
            }
            onRowClick={handleRowClick}
            containerClass={tableDensityClass}
            showPivotColumn={true}
            rowNumberOffset={currentPage * pageSize}
            getRowStyles={(row) => {
              const isDark = currentTheme === 'dark';
              if (row?.id === currentLead?.id) {
                return {
                  backgroundColor: isDark
                    ? 'rgba(222, 216, 216, 0.15)'
                    : 'rgba(231, 231, 231, 0.78)',
                };
              }
            }}
          />
        </Col>
        <Col style={{ width: '100%' }}></Col>
      </Row>
      <LeadsPageFooter leadsDetails={meta} />
    </>
  );
}
