import { useCallback, useLayoutEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Col, Row, Table } from '@components/ui';
import ClientsPageFooter from '@features/clients/components/ClientsPageFooter';
import ClientsToolbar from '@features/clients/components/ClientsToolbar';
import ClientsFilter from '@features/clients/components/Filter/ClientsFilter';
import ColumnsModal from '@features/clients/components/ColumnsModal';

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
import useColumnVisibility from '@features/clients/hooks/useColumnVisibility';
import getRowStyles from '@features/clients/utils/getRowStyles';
import hasRole from '@utils/hasRole';
import styles from './style.module.scss';

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

  // Columns modal visibility
  const [isColumnsOpen, setColumnsOpen] = useState(false);

  // Custom hooks
  const { data, isLoading } = useFetchClients({
    page: currentPage + 1,
    params,
  });
  const { clientsTableColumns } = useClientsTableColumns();
  // Column visibility management
  const { visibleColumns, setVisibleColumns, columnsToUse } =
    useColumnVisibility(
      clientsTableColumns,
      ['CardName', 'Phone1', 'InsTotal', 'PaidToDate'],
      'clientsVisibleColumns'
    );

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

  const hasData = Array.isArray(clientsDetails.data)
    ? clientsDetails.data?.length > 0
    : false;

  // Reusable scroll restoration (smooth)
  const { saveScrollPosition } = useScrollRestoration({
    scrollContainerRef: clientsTableRef,
    storageKey: 'scrollPositionClients',
    hasData,
    behavior: 'smooth',
    maxTries: 120,
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

  const handleFilter = useCallback((filterData) => {
    // Build params object, excluding empty/undefined values
    const params = {};

    if (
      filterData.search &&
      typeof filterData.search === 'string' &&
      filterData.search.trim()
    ) {
      params.search = filterData.search.trim();
    }
    if (
      filterData.paymentStatus &&
      filterData.paymentStatus !== '' &&
      filterData.paymentStatus !== 'all'
    ) {
      params.paymentStatus = filterData.paymentStatus;
    }
    if (filterData.slpCode && filterData.slpCode !== '') {
      params.slpCode = filterData.slpCode;
    }
    if (
      filterData.phone &&
      filterData.phone !== '998' &&
      typeof filterData.phone === 'string' &&
      filterData.phone.trim() &&
      filterData.phone.trim() !== '998'
    ) {
      params.phone = filterData.phone.trim();
    }
    if (filterData.startDate && filterData.startDate.trim()) {
      params.startDate = filterData.startDate;
    }
    if (filterData.endDate && filterData.endDate.trim()) {
      params.endDate = filterData.endDate;
    }
    if (filterData.phoneConfiscated && filterData.phoneConfiscated !== '') {
      params.phoneConfiscated = filterData.phoneConfiscated;
    }
    setParams(() => params);
  }, []);

  // Sync data with local state
  useLayoutEffect(() => {
    if (data?.totalPages && clientsDetails.totalPages !== data?.totalPages) {
      setClientsDetails((p) => ({ ...p, totalPages: data?.totalPages }));
    }

    if (data?.data?.length >= 0) {
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
                onToggleFilter={() => setColumnsOpen(true)}
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
              <ClientsFilter onFilter={handleFilter} />
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
            getRowStyles={(row) =>
              getRowStyles(row, currentClient, currentTheme)
            }
          />
        </Col>
        <Col style={{ width: '100%' }}></Col>
      </Row>
      <ColumnsModal
        isOpen={isColumnsOpen}
        onClose={() => setColumnsOpen(false)}
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
