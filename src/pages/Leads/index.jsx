import { useCallback, useState, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Col, Row, Table } from '@components/ui';
import LeadsToolbar from '@features/leads/components/LeadsToolbar';
import LeadsFilter from '@features/leads/components/Filter';
import AdvancedFilterModal from '@features/leads/components/Filter/AdvancedFilterModal';
import AddLeadModal from '@/features/leads/components/modals/AddLeadModal';
import LeadsPageFooter from '@features/leads/components/LeadsPageFooter';
import useLeadsTableColumns from '@features/leads/hooks/useLeadsTableColumns';
import useUIScale from '@/features/clients/hooks/useUIScale';
import useTableDensity from '@/features/clients/hooks/useTableDensity';
import useScrollRestoration from '@/features/clients/hooks/useScrollRestoration';
import useIsMobile from '@hooks/useIsMobile';
import useAuth from '@hooks/useAuth';

import {
  setCurrentLead,
  setLeadsCurrentPage,
  setLeadsFilter,
} from '@store/slices/leadsPageSlice';
import useFetchLeads from '@/hooks/data/leads/useFetchLeads';
import useTheme from '@/hooks/useTheme';
import { ALLOWED_ROLES_FOR_SEEING_RETURNED_LEADS } from '@/features/leads/utils/constants';

export default function Leads() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isMobile = useIsMobile();
  const { currentTheme } = useTheme();
  const { user } = useAuth();
  const role = user?.U_role;
  const { leadsTableColumns } = useLeadsTableColumns();

  // Refs
  const leadsTableRef = useRef(null);
  const { currentPage, pageSize, filter, currentLead } = useSelector(
    (state) => state.page.leads
  );

  const [toggleFilter, setToggleFilter] = useState(() => {
    try {
      const raw = localStorage.getItem('leadsFilterOpen');
      if (raw === 'true') return true;
      if (raw === 'false') return false;
    } catch (error) {
      console.log(error);
    }
    return false;
  });

  // Advanced modal + column visibility
  const [isAdvancedOpen, setAdvancedOpen] = useState(false);
  const [isAddOpen, setAddOpen] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState(() => {
    try {
      const raw = localStorage.getItem('leadsVisibleColumns');
      return raw ? JSON.parse(raw) : {};
    } catch (error) {
      console.log(error);
      return {};
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(
        'leadsVisibleColumns',
        JSON.stringify(visibleColumns)
      );
    } catch (error) {
      console.log(error);
    }
  }, [visibleColumns]);

  // Persist filter open state to its own key
  useEffect(() => {
    try {
      localStorage.setItem('leadsFilterOpen', String(toggleFilter));
    } catch (error) {
      console.log(error);
    }
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

  const { saveScrollPosition } = useScrollRestoration({
    scrollContainerRef: leadsTableRef,
    storageKey: 'scrollPositionLeads',
    hasData: Array.isArray(leads) ? leads.length > 0 : false,
    behavior: 'smooth',
    maxTries: 120,
  });

  const handleFilter = useCallback(
    (filterData) => {
      dispatch(setLeadsFilter(filterData));
      setToggleFilter(false);
    },
    [dispatch]
  );

  const handleRowClick = useCallback(
    (row) => {
      saveScrollPosition();
      try {
        sessionStorage.setItem(
          'scrollPositionLeads__rowKey',
          String(row?.id ?? '')
        );
      } catch (error) {
        console.log(error);
      }
      dispatch(setCurrentLead(row));
      navigate(`/leads/${row.id}`);
    },
    [navigate, dispatch, saveScrollPosition]
  );

  // Keep current page in bounds when filters change
  useEffect(() => {
    const totalPages = Number(meta?.totalPages ?? 0);
    // Only adjust if we have valid data and current page is truly out of bounds
    // Skip if loading or if totalPages is 0 (no data/error state)
    if (totalPages > 0 && currentPage >= totalPages && !isLoadingLeads) {
      const newPage = Math.max(0, totalPages - 1);
      // Only dispatch if the new page is actually different
      if (newPage !== currentPage) {
        dispatch(setLeadsCurrentPage(newPage));
      }
    }
  }, [currentPage, meta?.totalPages, dispatch, isLoadingLeads]);

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
    } catch (error) {
      console.log(error);
    }
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
      const records = e?.detail?.records;
      if (!records) return;
      records.forEach((record) => {
        setHighlighted((p) => ({ ...p, [record.id]: true }));
      });
      // auto clear after 4s
      setTimeout(() => {
        setHighlighted((p) => {
          const next = { ...p };
          records.forEach((record) => {
            delete next[record.id];
          });
          return next;
        });
      }, 4000);
      // Refresh leads list
      try {
        refetch?.();
      } catch (error) {
        console.log(error);
      }
    };

    window.addEventListener('probox:new-lead', onNew);
    return () => window.removeEventListener('', onNew);
  }, [refetch]);

  return (
    <>
      <Row gutter={isMobile ? 2 : 6} style={{ width: '100%', height: '100%' }}>
        <Col fullWidth>
          <Row gutter={isMobile ? 4 : 6}>
            <Col fullWidth>
              <LeadsToolbar
                user={user}
                uiScale={uiScale}
                onIncreaseUIScale={increaseScale}
                onDecreaseUIScale={decreaseScale}
                onResetUIScale={resetScale}
                onIncreaseDensity={increaseDensity}
                onDecreaseDensity={decreaseDensity}
                onResetDensity={resetDensity}
                onToggleFilter={() => setAdvancedOpen(true)}
                onAddLead={() => setAddOpen(true)}
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
            id="leads-table"
            scrollable={{ xs: true, sm: true, md: true, lg: true, xl: true }}
            ref={leadsTableRef}
            uniqueKey="id"
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

              if (ALLOWED_ROLES_FOR_SEEING_RETURNED_LEADS.includes(role)) {
                if (row.seen === false && row.status === 'Returned') {
                  return {
                    backgroundColor: isDark
                      ? 'rgba(255, 100, 100, 0.2)'
                      : 'rgba(255, 200, 200, 0.5)',
                  };
                }
              }

              if(row?.consideringBumped) {
                return {
                  backgroundColor: isDark
                    ? 'rgba(255, 200, 100, 0.25)'
                    : 'rgba(255, 245, 180, 0.6)',
                };
              }
            }}
          />
        </Col>
      </Row>
      <AddLeadModal
        isOpen={isAddOpen}
        onClose={() => setAddOpen(false)}
        onCreated={() => {
          try {
            refetch?.();
          } catch (error) {
            console.log(error);
          }
          setAddOpen(false);
        }}
      />
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
