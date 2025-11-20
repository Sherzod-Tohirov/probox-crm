import _ from 'lodash';
import {
  useCallback,
  useLayoutEffect,
  useState,
  useRef,
  useEffect,
  useMemo,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Col, Row, Table } from '@components/ui';
import ClientsPageFooter from '@features/clients/components/ClientsPageFooter';
import ClientsToolbar from '@features/clients/components/ClientsToolbar';
import MinimalFilter from '@features/clients/components/Filter/MinimalFilter';
import AdvancedFilterModal from '@features/clients/components/AdvancedFilterModal';

import { setCurrentClient } from '@store/slices/clientsPageSlice';

import useFetchClients from '@hooks/data/clients/useFetchClients';
import useAuth from '@hooks/useAuth';
import useIsMobile from '@hooks/useIsMobile';
import useTheme from '@hooks/useTheme';

import useClientsTableColumns from '@features/clients/hooks/useClientsTableColumns';
import useUIScale from '@/features/clients/hooks/useUIScale';
import useTableDensity from '@/features/clients/hooks/useTableDensity';
import useScrollRestoration from '@/features/clients/hooks/useScrollRestoration';
import useModalAutoClose from '@features/clients/hooks/useModalAutoClose';
import hasRole from '@utils/hasRole';
import styles from './style.module.scss';
import moment from 'moment';
export default function Clients() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isMobile = useIsMobile();
  const { currentTheme } = useTheme();
  const { user } = useAuth();

  // Refs
  const clientsTableRef = useRef(null);

  // Redux state
  const { currentPage, filter, currentClient } = useSelector(
    (state) => state.page.clients
  );

  // Local state
  const [clientsDetails, setClientsDetails] = useState({
    totalPages: 0,
    total: 0,
    data: [],
  });
  const [selectedRows, setSelectedRows] = useState([]);
  const [params, setParams] = useState({ ...filter });

  // Advanced modal + column visibility
  const [isAdvancedOpen, setAdvancedOpen] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState(() => {
    try {
      const raw = localStorage.getItem('clientsVisibleColumns');
      return raw ? JSON.parse(raw) : {};
    } catch (_) {
      return {};
    }
  });

  // Persist column visibility
  useEffect(() => {
    try {
      localStorage.setItem(
        'clientsVisibleColumns',
        JSON.stringify(visibleColumns)
      );
    } catch (_) {}
  }, [visibleColumns]);

  // Custom hooks
  const { data, isLoading } = useFetchClients({
    page: currentPage + 1,
    params,
  });
  const { clientsTableColumns } = useClientsTableColumns();

  // Filter columns based on visibility toggles
  const columnsToUse = useMemo(() => {
    const map = visibleColumns || {};
    // Always show CardName; others are user-toggleable
    return clientsTableColumns.filter((c) =>
      c.key === 'CardName' ? true : map[c.key] !== false
    );
  }, [clientsTableColumns, visibleColumns]);

  // Initialize default visible columns if none are saved
  useEffect(() => {
    try {
      const initialized = localStorage.getItem('clientsVisibleColumnsInit');
      if (initialized) return;
      const important = new Set([
        'CardName',
        'Phone1',
        'InsTotal',
        'PaidToDate',
      ]);
      const map = {};
      (clientsTableColumns || []).forEach((c) => {
        if (!important.has(c.key)) map[c.key] = false;
      });
      setVisibleColumns(map);
      localStorage.setItem('clientsVisibleColumnsInit', '1');
    } catch (_) {}
  }, [clientsTableColumns]);

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
  } = useTableDensity('clientsTableDensity');

  const { saveScrollPosition } = useScrollRestoration({
    scrollContainerRef: clientsTableRef,
    storageKey: 'scrollPositionClients',
    hasData: data?.data?.length > 0,
  });

  useModalAutoClose(clientsTableRef);

  // Handlers
  const handleRowClick = useCallback(
    (row) => {
      saveScrollPosition();
      navigate(`/clients/${row.DocEntry}`);
      dispatch(setCurrentClient(row));
    },
    [navigate, dispatch, saveScrollPosition]
  );

  const handleFilter = useCallback(
    (filterData) => {
      // Merge with existing redux filter to avoid clearing advanced selections
      const merged = { ...filter, ...filterData };
      const paymentStatus = Array.isArray(merged.paymentStatus)
        ? _.map(merged.paymentStatus, 'value').join(',')
        : merged.paymentStatus;
      const slpCode = Array.isArray(merged.slpCode)
        ? _.map(merged.slpCode, 'value').join(',')
        : merged.slpCode;

      setParams(() => ({
        search: merged.search,
        paymentStatus,
        slpCode,
        phone: merged.phone,
        startDate: merged.startDate,
        endDate: merged.endDate,
        phoneConfiscated: merged.phoneConfiscated,
      }));
    },
    [filter]
  );

  // Sync data with local state
  useLayoutEffect(() => {
    if (data?.totalPages && clientsDetails.totalPages !== data?.totalPages) {
      setClientsDetails((p) => ({ ...p, totalPages: data?.totalPages }));
    }

    if (data?.data.length >= 0) {
      setClientsDetails((p) => ({ ...p, data: data?.data }));
    }

    if (clientsDetails.total !== data?.total) {
      setClientsDetails((p) => ({ ...p, total: data?.total || 0 }));
    }
  }, [data, clientsDetails.total, clientsDetails.totalPages]);

  return (
    <>
      <Row gutter={isMobile ? 2 : 6} style={{ width: '100%', height: '100%' }}>
        <Col className={styles['sticky-column']} fullWidth>
          <Row gutter={isMobile ? 4 : 6}>
            <Col fullWidth>
              <ClientsToolbar
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
              <MinimalFilter onFilter={handleFilter} />
            </Col>
          </Row>
        </Col>
        <Col fullWidth>
          <Table
            id={'clients-table'}
            scrollable
            ref={clientsTableRef}
            uniqueKey={'DocEntry'}
            isLoading={isLoading}
            columns={columnsToUse}
            data={clientsDetails.data}
            onRowClick={handleRowClick}
            containerClass={tableDensityClass}
            isRowSelectable={(row) => {
              return (
                typeof row.location === 'object' &&
                row.location.lat &&
                row.location.long
              );
            }}
            selectionEnabled={hasRole(user, ['Agent'])}
            selectedRows={selectedRows}
            onSelectionChange={setSelectedRows}
            showPivotColumn={true}
            getRowStyles={(row) => {
              if (row?.['DocEntry'] === currentClient?.['DocEntry']) {
                return {
                  backgroundColor:
                    currentTheme === 'dark'
                      ? 'rgba(96, 165, 250, 0.15)'
                      : 'rgba(206, 236, 249, 0.94)',
                };
              }

              const paymentDate = moment(
                row?.DueDate ?? row?.NewDueDate ?? null
              );
              const today = moment();
              const isTodayPayment = paymentDate.isSame(today, 'day');
              if (isTodayPayment) {
                return {
                  backgroundColor:
                    currentTheme === 'dark'
                      ? 'rgba(115, 115, 87, 0.73)'
                      : 'rgba(244, 244, 173, 0.76)',
                };
                ('rgba(244, 244, 173, 0.76)');
              }
            }}
          />
        </Col>
        <Col style={{ width: '100%' }}></Col>
      </Row>
      <AdvancedFilterModal
        isOpen={isAdvancedOpen}
        onClose={() => setAdvancedOpen(false)}
        onApply={handleFilter}
        initialValues={filter}
        columns={clientsTableColumns}
        visibleColumns={visibleColumns}
        onChangeVisibleColumns={setVisibleColumns}
      />
      <ClientsPageFooter
        clientsDetails={clientsDetails}
        selectedRows={selectedRows}
        data={data}
      />
    </>
  );
}
