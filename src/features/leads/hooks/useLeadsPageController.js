import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import useLeadsTableColumns from '@features/leads/hooks/useLeadsTableColumns';
import useUIScale from '@/features/clients/hooks/useUIScale';
import useTableDensity from '@/features/clients/hooks/useTableDensity';
import useScrollRestoration from '@/features/clients/hooks/useScrollRestoration';
import useIsMobile from '@hooks/useIsMobile';
import useAuth from '@hooks/useAuth';
import useTheme from '@/hooks/useTheme';
import useFetchLeads from '@/hooks/data/leads/useFetchLeads';
import {
  setCurrentLead,
  setLeadsCurrentPage,
  setLeadsFilter,
} from '@store/slices/leadsPageSlice';
import { ALLOWED_ROLES_FOR_SEEING_RETURNED_LEADS } from '@/features/leads/utils/constants';

const LS_VISIBLE_COLUMNS_KEY = 'leadsVisibleColumns';
const LS_VISIBLE_COLUMNS_INIT_KEY = 'leadsVisibleColumnsInit';
const SS_SCROLL_ROW_KEY = 'scrollPositionLeads__rowKey';

function readObjectFromLocalStorage(key, fallback = {}) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    console.log(error);
    return fallback;
  }
}

export default function useLeadsPageController() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isMobile = useIsMobile();
  const { currentTheme } = useTheme();
  const { user } = useAuth();
  const role = user?.U_role;

  const { leadsTableColumns } = useLeadsTableColumns();

  const leadsTableRef = useRef(null);

  const { currentPage, pageSize, filter, currentLead } = useSelector(
    (state) => state.page.leads
  );

  const [isAdvancedOpen, setAdvancedOpen] = useState(false);
  const [isAddOpen, setAddOpen] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState(() =>
    readObjectFromLocalStorage(LS_VISIBLE_COLUMNS_KEY, {})
  );
  const [highlighted, setHighlighted] = useState({});

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

  useEffect(() => {
    try {
      localStorage.setItem(
        LS_VISIBLE_COLUMNS_KEY,
        JSON.stringify(visibleColumns || {})
      );
    } catch (error) {
      console.log(error);
    }
  }, [visibleColumns]);

  useEffect(() => {
    const totalPages = Number(meta?.totalPages ?? 0);
    if (totalPages > 0 && currentPage >= totalPages && !isLoadingLeads) {
      const nextPage = Math.max(0, totalPages - 1);
      if (nextPage !== currentPage) {
        dispatch(setLeadsCurrentPage(nextPage));
      }
    }
  }, [currentPage, meta?.totalPages, dispatch, isLoadingLeads]);

  useEffect(() => {
    try {
      const initialized = localStorage.getItem(LS_VISIBLE_COLUMNS_INIT_KEY);
      if (initialized) return;

      const important = new Set([
        'clientName',
        'clientPhone',
        'source',
        'time',
      ]);
      const defaults = {};

      (leadsTableColumns || []).forEach((column) => {
        if (!important.has(column.key)) defaults[column.key] = false;
      });

      setVisibleColumns(defaults);
      localStorage.setItem(LS_VISIBLE_COLUMNS_INIT_KEY, '1');
    } catch (error) {
      console.log(error);
    }
  }, [leadsTableColumns]);

  const columnsToUse = useMemo(() => {
    const map = visibleColumns || {};
    return (leadsTableColumns || []).filter((column) =>
      column.key === 'clientName' ? true : map[column.key] !== false
    );
  }, [leadsTableColumns, visibleColumns]);

  const handleFilter = useCallback(
    (filterData) => {
      dispatch(setLeadsFilter(filterData));
    },
    [dispatch]
  );

  const handleRowClick = useCallback(
    (row) => {
      saveScrollPosition();
      try {
        sessionStorage.setItem(SS_SCROLL_ROW_KEY, String(row?.id ?? ''));
      } catch (error) {
        console.log(error);
      }

      dispatch(setCurrentLead(row));
      navigate(`/leads/${row.id}`);
    },
    [dispatch, navigate, saveScrollPosition]
  );

  const isDark = currentTheme === 'dark';

  const getRowStyles = useCallback(
    (row) => {
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

      if (
        ALLOWED_ROLES_FOR_SEEING_RETURNED_LEADS.includes(role) &&
        row?.seen === false &&
        row?.status === 'Returned'
      ) {
        return {
          backgroundColor: isDark
            ? 'rgba(255, 100, 100, 0.2)'
            : 'rgba(255, 200, 200, 0.5)',
        };
      }

      if (row?.consideringBumped) {
        return {
          backgroundColor: isDark
            ? 'rgba(255, 200, 100, 0.25)'
            : 'rgba(255, 245, 180, 0.35)',
        };
      }

      if (row?.status === 'Missed') {
        return {
          backgroundColor: '#ffcbcb66',
        };
      }

      return undefined;
    },
    [currentLead?.id, highlighted, isDark, role]
  );

  useEffect(() => {
    const timeoutIds = [];

    const onNewLead = (event) => {
      const records = event?.detail?.records;
      if (!Array.isArray(records) || !records.length) return;

      const ids = records
        .map((record) => record?.id)
        .filter((id) => id !== null && id !== undefined);

      if (ids.length) {
        setHighlighted((prev) => {
          const next = { ...prev };
          ids.forEach((id) => {
            next[id] = true;
          });
          return next;
        });

        const timeoutId = window.setTimeout(() => {
          setHighlighted((prev) => {
            const next = { ...prev };
            ids.forEach((id) => {
              delete next[id];
            });
            return next;
          });
        }, 4000);

        timeoutIds.push(timeoutId);
      }

      try {
        refetch?.();
      } catch (error) {
        console.log(error);
      }
    };

    window.addEventListener('probox:new-lead', onNewLead);
    return () => {
      window.removeEventListener('probox:new-lead', onNewLead);
      timeoutIds.forEach((id) => window.clearTimeout(id));
    };
  }, [refetch]);

  const handleAddLeadCreated = useCallback(() => {
    try {
      refetch?.();
    } catch (error) {
      console.log(error);
    }
    setAddOpen(false);
  }, [refetch]);

  const openAdvancedModal = useCallback(() => setAdvancedOpen(true), []);
  const closeAdvancedModal = useCallback(() => setAdvancedOpen(false), []);
  const openAddModal = useCallback(() => setAddOpen(true), []);
  const closeAddModal = useCallback(() => setAddOpen(false), []);

  return {
    // base context
    isMobile,
    user,
    role,

    // data
    leads,
    meta,
    filter,
    currentPage,
    pageSize,
    rowNumberOffset: currentPage * pageSize,
    isLoadingLeads,
    leadsTableColumns,
    columnsToUse,

    // table
    leadsTableRef,
    tableDensityClass,
    getRowStyles,

    // handlers
    handleFilter,
    handleRowClick,
    handleAddLeadCreated,

    // modal/controls
    isAdvancedOpen,
    setAdvancedOpen,
    openAdvancedModal,
    closeAdvancedModal,
    isAddOpen,
    setAddOpen,
    openAddModal,
    closeAddModal,
    visibleColumns,
    setVisibleColumns,

    // toolbar controls
    uiScale,
    increaseScale,
    decreaseScale,
    resetScale,
    canIncrease,
    canDecrease,
    isDefaultUI,
    increaseDensity,
    decreaseDensity,
    resetDensity,
    isMinDensity,
    isMaxDensity,
    isDefaultDensity,
  };
}
