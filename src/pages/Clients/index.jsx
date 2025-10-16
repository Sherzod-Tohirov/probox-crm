import _ from 'lodash';
import { useCallback, useLayoutEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Col, Row, Table } from '@components/ui';
import ClientsPageFooter from '@features/clients/components/ClientsPageFooter';
import ClientsToolbar from '@features/clients/components/ClientsToolbar';
import Filter from '@features/clients/components/Filter';

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
  const [toggleFilter, setToggleFilter] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [params, setParams] = useState({ ...filter });

  // Custom hooks
  const { data, isLoading } = useFetchClients({
    page: currentPage + 1,
    params,
  });
  const { clientsTableColumns } = useClientsTableColumns();
  
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

  const handleFilter = useCallback((filterData) => {
    setTimeout(() => {
      setToggleFilter(false);
    }, 200);

    setParams(() => ({
      search: filterData.search,
      paymentStatus: _.map(filterData.paymentStatus, 'value').join(','),
      slpCode: _.map(filterData.slpCode, 'value').join(','),
      phone: filterData.phone,
      startDate: filterData.startDate,
      endDate: filterData.endDate,
      phoneConfiscated: filterData.phoneConfiscated,
    }));
  }, []);

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
              <Filter onFilter={handleFilter} isExpanded={toggleFilter} />
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
            columns={clientsTableColumns}
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
            }}
          />
        </Col>
        <Col style={{ width: '100%' }}></Col>
      </Row>
      <ClientsPageFooter
        clientsDetails={clientsDetails}
        selectedRows={selectedRows}
        data={data}
      />
    </>
  );
}
