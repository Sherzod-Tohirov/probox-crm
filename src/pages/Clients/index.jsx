import _ from 'lodash';

import { Col, Row, Navigation, Table, Button } from '@components/ui';
import ClientsPageFooter from '@features/clients/components/ClientsPageFooter';
import Filter from '@features/clients/components/Filter';

import {
  useCallback,
  useLayoutEffect,
  useState,
  useRef,
  useEffect,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { closeAllModals } from '@store/slices/toggleSlice';

import { setCurrentClient } from '@store/slices/clientsPageSlice';

import useFetchClients from '@hooks/data/clients/useFetchClients';
import useClientsTableColumns from '@features/clients/hooks/useClientsTableColumns';
import styles from './style.module.scss';
import hasRole from '@utils/hasRole';
import useAuth from '@hooks/useAuth';
import useIsMobile from '@hooks/useIsMobile';
// import VirtualizedTable from "../../components/ui/Table/VirtualizedTable";
export default function Clients() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const clientsTableRef = useRef(null);
  const { currentPage, filter, currentClient } = useSelector(
    (state) => state.page.clients
  );

  const [clientsDetails, setClientsDetails] = useState({
    totalPages: 0,
    total: 0,
    data: [],
  });
  const [toggleFilter, setToggleFilter] = useState(false);
  const [tableDensity, setTableDensity] = useState('normal'); // 'xxcompact' | 'xcompact' | 'compact' | 'normal' | 'large' | 'xlarge'
  const densityLevels = ['xxcompact', 'xcompact', 'compact', 'normal', 'large', 'xlarge'];
  // Global UI zoom controls
  const MIN_UI_SCALE = 0.5;
  const MAX_UI_SCALE = 2;
  const UI_SCALE_STEP = 0.1;
  const [uiScale, setUiScale] = useState(1);
  const [selectedRows, setSelectedRows] = useState([]);
  const [params, setParams] = useState({ ...filter });

  const { data, isLoading } = useFetchClients({
    page: currentPage + 1,
    params,
  });

  const { clientsTableColumns } = useClientsTableColumns();

  const hasRestoredScroll = useRef(false);
  const handleRowClick = useCallback(
    (row) => {
      const tableWrapper = clientsTableRef.current?.closest('#table-wrapper');
      const scrollY = tableWrapper ? tableWrapper.scrollTop : 0;
      sessionStorage.setItem('scrollPositionClients', scrollY);
      navigate(`/clients/${row.DocEntry}`);
      dispatch(setCurrentClient(row));
    },
    [navigate, dispatch]
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

  // Restore persisted table density
  useEffect(() => {
    const saved = sessionStorage.getItem('clientsTableDensity');
    if (saved && densityLevels.includes(saved)) {
      setTableDensity(saved);
    }
  }, []);

  // Initialize global UI scale from localStorage and update CSS var
  useEffect(() => {
    const saved = localStorage.getItem('uiScale');
    const initial = saved ? parseFloat(saved) : 1;
    const clamped = Math.min(MAX_UI_SCALE, Math.max(MIN_UI_SCALE, Number.isFinite(initial) ? initial : 1));
    setUiScale(clamped);
    document.documentElement.style.setProperty('--ui-scale', String(clamped));
  }, []);

  const setGlobalScale = useCallback((value) => {
    const raw = typeof value === 'number' ? value : parseFloat(value);
    const clamped = Math.min(MAX_UI_SCALE, Math.max(MIN_UI_SCALE, Number.isFinite(raw) ? raw : 1));
    setUiScale(clamped);
    document.documentElement.style.setProperty('--ui-scale', String(clamped));
    localStorage.setItem('uiScale', String(clamped));
  }, []);

  const increaseUiScale = useCallback(() => {
    setGlobalScale(uiScale + UI_SCALE_STEP);
  }, [uiScale, setGlobalScale]);

  const decreaseUiScale = useCallback(() => {
    setGlobalScale(uiScale - UI_SCALE_STEP);
  }, [uiScale, setGlobalScale]);

  const resetUiScale = useCallback(() => setGlobalScale(1), [setGlobalScale]);

  useEffect(() => {
    sessionStorage.setItem('clientsTableDensity', tableDensity);
  }, [tableDensity]);

  const increaseDensity = useCallback(() => {
    setTableDensity((prev) => {
      const idx = densityLevels.indexOf(prev);
      if (idx === -1) return 'normal';
      return densityLevels[Math.min(idx + 1, densityLevels.length - 1)];
    });
  }, []);

  const decreaseDensity = useCallback(() => {
    setTableDensity((prev) => {
      const idx = densityLevels.indexOf(prev);
      if (idx === -1) return 'normal';
      return densityLevels[Math.max(idx - 1, 0)];
    });
  }, []);

  const resetDensity = useCallback(() => setTableDensity('normal'), []);

  const tableDensityClass = `table-density-${tableDensity}`;

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
  }, [data]);

  //Adjust scroll position as user exits from clients page
  useLayoutEffect(() => {
    if (
      data &&
      data.data &&
      data.data.length > 0 &&
      !hasRestoredScroll.current
    ) {
      const tableWrapper = clientsTableRef.current.closest('#table-wrapper');
      requestAnimationFrame(() => {
        const savedY = sessionStorage.getItem('scrollPositionClients');
        if (savedY && !isNaN(parseInt(savedY))) {
          tableWrapper.scrollTop = parseInt(savedY);
          sessionStorage.removeItem('scrollPositionClients');
          hasRestoredScroll.current = true;
        }
      });
    }
  }, [data]);

  // Close all modals if route changes
  useLayoutEffect(() => {
    dispatch(closeAllModals());
  }, [location.pathname]);
  // Close all modals if scrolls table
  useEffect(() => {
    const tableWrapper = clientsTableRef.current?.closest('#table-wrapper');
    const handleScroll = () => {
      dispatch(closeAllModals());
    };

    tableWrapper?.addEventListener('scroll', handleScroll, {
      passive: true,
    });

    return () => {
      tableWrapper?.removeEventListener('scroll', handleScroll);
    };
  }, [dispatch]);

  // Close all modal if click outside of modal or cell

  return (
    <>
      <Row gutter={isMobile ? 2 : 6} style={{ width: '100%', height: '100%' }}>
        <Col className={styles['sticky-column']} fullWidth>
          <Row gutter={isMobile ? 4 : 6}>
            <Col fullWidth>
              <Row direction="row" justify="space-between" align="center">
                <Col>
                  <Navigation fallbackBackPath={'/clients'} />
                </Col>
                <Col>
                  <div
                    style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                  >
                    <Button
                      variant="text"
                      color="secondary"
                      aria-label="Global zoom out"
                      onClick={decreaseUiScale}
                      disabled={uiScale <= MIN_UI_SCALE}
                    >
                      -
                    </Button>
                    <Button
                      variant="text"
                      color="secondary"
                      aria-label="Reset global zoom"
                      onClick={resetUiScale}
                      disabled={uiScale === 1}
                    >
                      100%
                    </Button>
                    <Button
                      variant="text"
                      color="secondary"
                      aria-label="Global zoom in"
                      onClick={increaseUiScale}
                      disabled={uiScale >= MAX_UI_SCALE}
                    >
                      +
                    </Button>
                    <span style={{ width: 1, height: 20, background: 'rgba(0,0,0,0.08)' }} />
                    <Button
                      variant="text"
                      color="secondary"
                      aria-label="Zoom out table"
                      onClick={decreaseDensity}
                      disabled={tableDensity === 'xxcompact'}
                    >
                      A-
                    </Button>
                    <Button
                      variant="text"
                      color="secondary"
                      aria-label="Reset table zoom"
                      onClick={resetDensity}
                      disabled={tableDensity === 'normal'}
                    >
                      A
                    </Button>
                    <Button
                      variant="text"
                      color="secondary"
                      aria-label="Zoom in table"
                      onClick={increaseDensity}
                      disabled={tableDensity === 'xlarge'}
                    >
                      A+
                    </Button>
                    {isMobile ? (
                      <Button
                        onClick={() => setToggleFilter((prev) => !prev)}
                        icon={'filter'}
                        iconColor={'secondary'}
                        iconSize={'20'}
                        aria-label="Filter"
                      />
                    ) : null}
                  </div>
                </Col>
              </Row>
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
                  backgroundColor: 'rgba(206, 236, 249, 0.94)',
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
