import { useCallback, useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Col, Row, Table } from '@components/ui';
import LeadsToolbar from '@features/leads/components/LeadsToolbar';
import LeadsFilter from '@features/leads/components/Filter';
import AdvancedFilterModal from '@features/leads/components/Filter/AdvancedFilterModal';
import LeadsPageFooter from '@features/leads/components/LeadsPageFooter';
import useLeadsTableColumns from '@features/leads/hooks/useLeadsTableColumns';
import useUIScale from '@/features/clients/hooks/useUIScale';
import useTableDensity from '@/features/clients/hooks/useTableDensity';
import useIsMobile from '@hooks/useIsMobile';
import useAuth from '@hooks/useAuth';

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
  const { user } = useAuth();
  const role = user?.U_role;
  const { leadsTableColumns } = useLeadsTableColumns();
  const { currentPage, pageSize, filter, currentLead } = useSelector(
    (state) => state.page.leads
  );

  const [toggleFilter, setToggleFilter] = useState(() => {
    try {
      const raw = localStorage.getItem('leadsFilterOpen');
      if (raw === 'true') return true;
      if (raw === 'false') return false;
    } catch (_) {}
    return false;
  });

  // Advanced modal + column visibility
  const [isAdvancedOpen, setAdvancedOpen] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState(() => {
    try {
      const raw = localStorage.getItem('leadsVisibleColumns');
      return raw ? JSON.parse(raw) : {};
    } catch (_) {
      return {};
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(
        'leadsVisibleColumns',
        JSON.stringify(visibleColumns)
      );
    } catch (_) {}
  }, [visibleColumns]);

  // Persist filter open state to its own key
  useEffect(() => {
    try {
      localStorage.setItem('leadsFilterOpen', String(toggleFilter));
    } catch (_) {}
  }, [toggleFilter]);
  const {
    data: { data: leads, ...meta } = {
      data: { data: [], totalPages: 0, total: 0 },
    },
    isLoading: isLoadingLeads,
    refetch,
  } = useFetchLeads({
    page: currentPage + 1,
    limit: pageSize,
    params: filter,
  });

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
    const totalPages = Number(meta?.totalPages ?? 0);
    if (totalPages > 0 && currentPage >= totalPages) {
      dispatch(setLeadsCurrentPage(Math.max(0, totalPages - 1)));
    }
  }, [currentPage, meta?.totalPages, dispatch]);

  // Initialize default visible columns if none are saved
  useEffect(() => {
    try {
      const initialized = localStorage.getItem('leadsVisibleColumnsInit');
      if (initialized) return;
      const important = new Set([
        'clientName',
        'clientPhone',
        'source',
        'time',
      ]);
      const map = {};
      (leadsTableColumns || []).forEach((c) => {
        if (!important.has(c.key)) map[c.key] = false;
      });
      setVisibleColumns(map);
      localStorage.setItem('leadsVisibleColumnsInit', '1');
    } catch (_) {}
  }, [leadsTableColumns]);

  // Filter columns based on visibility toggles
  const columnsToUse = useMemo(() => {
    const map = visibleColumns || {};
    // Always show Name; others including ID are user-toggleable
    return leadsTableColumns.filter((c) =>
      c.key === 'clientName' ? true : map[c.key] !== false
    );
  }, [leadsTableColumns, visibleColumns]);

  // Highlight new leads briefly and refetch on socket event
  const [highlighted, setHighlighted] = useState({}); // { [id]: true }
  useEffect(() => {
    const onNew = (e) => {
      console.log('Triggered, event');
      const id = e?.detail?.id;
      if (!id) return;
      console.log('Triggered, id', id);
      console.log('Triggered, highlighted', highlighted);
      setHighlighted((p) => ({ ...p, [id]: true }));
      // auto clear after 4s
      setTimeout(() => {
        setHighlighted((p) => {
          const next = { ...p };
          delete next[id];
          return next;
        });
      }, 4000);
      // Refresh leads list
      try {
        refetch?.();
      } catch (_) {}
    };

    window.addEventListener('probox:new-lead', onNew);
    return () => window.removeEventListener('probox:new-lead', onNew);
  }, [refetch]);

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
                onToggleFilter={() => setAdvancedOpen(true)}
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
                isExpanded={toggleFilter}
                minimal
              />
            </Col>
          </Row>
        </Col>
        <Col fullWidth flexGrow fullHeight>
          <Table
            id={'leads-table'}
            scrollable={{ xs: true, sm: true, md: true, lg: true, xl: true }}
            uniqueKey={'id'}
            isLoading={isLoadingLeads}
            columns={columnsToUse}
            data={leads}
            onRowClick={handleRowClick}
            containerClass={tableDensityClass}
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
              if (highlighted[row?.id]) {
                return {
                  backgroundColor: isDark
                    ? 'rgba(255, 220, 130, 0.25)'
                    : 'rgba(255, 245, 200, 0.9)',
                  transition: 'background-color 0.8s ease',
                };
              }
            }}
          />
        </Col>
      </Row>
      <AdvancedFilterModal
        isOpen={isAdvancedOpen}
        onClose={() => setAdvancedOpen(false)}
        onApply={handleFilter}
        initialValues={filter}
        role={role}
        columns={leadsTableColumns}
        visibleColumns={visibleColumns}
        onChangeVisibleColumns={setVisibleColumns}
      />
      <LeadsPageFooter leadsDetails={meta} />
    </>
  );
}
