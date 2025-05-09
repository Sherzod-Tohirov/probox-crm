import { Col, Row, Navigation, Table } from "@components/ui";
import ClientsPageFooter from "@features/clients/components/ClientsPageFooter";
import Filter from "@features/clients/components/Filter";

import { useCallback, useLayoutEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  setClientsCurrentPage,
  setCurrentClient,
} from "@store/slices/clientsPageSlice";

import useFetchClients from "@hooks/data/useFetchClients";
import useTableColumns from "@hooks/useTableColumns";
import _ from "lodash";
import styles from "./style.module.scss";
export default function Clients() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentPage, filter, currentClient } = useSelector(
    (state) => state.page.clients
  );
  const [clientsDetails, setClientsDetails] = useState({
    totalPages: 0,
    total: 0,
    data: [],
  });

  const [params, setParams] = useState({ ...filter });

  const { data, isLoading } = useFetchClients({
    page: currentPage + 1,
    params,
  });

  const { clientsTableColumns } = useTableColumns();

  const hasRestoredScroll = useRef(false);

  const handleRowClick = useCallback(
    (row) => {
      const scrollY = window.scrollY;
      sessionStorage.setItem("scrollPositionClients", scrollY);
      navigate(`/clients/${row.DocEntry}`);
      dispatch(setCurrentClient(row));
    },
    [navigate]
  );

  const handleFilter = useCallback((filterData) => {
    dispatch(setClientsCurrentPage(0));
    setParams(() => ({
      search: filterData.search,
      paymentStatus: _.map(filterData.paymentStatus, "value").join(","),
      phone: filterData.phone,
      slpCode: filterData.slpCode,
      startDate: filterData.startDate,
      endDate: filterData.endDate,
    }));
  }, []);

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

  useLayoutEffect(() => {
    if (
      data &&
      data.data &&
      data.data.length > 0 &&
      !hasRestoredScroll.current
    ) {
      requestAnimationFrame(() => {
        const savedY = sessionStorage.getItem("scrollPositionClients");
        if (savedY && !isNaN(parseInt(savedY))) {
          window.scrollTo(0, parseInt(savedY));
          sessionStorage.removeItem("scrollPositionClients");
          hasRestoredScroll.current = true;
        }
      });
    }
  }, [data]);

  return (
    <>
      <Row gutter={6} style={{ width: "100%", height: "100%" }}>
        <Col className={styles["sticky-column"]} fullWidth>
          <Row gutter={6}>
            <Col>
              <Navigation fallbackBackPath={"/clients"} />
            </Col>
            <Col fullWidth>
              <Filter onFilter={handleFilter} />
            </Col>
          </Row>
        </Col>
        <Col fullWidth>
          <Table
            style={{ marginTop: "-24px" }}
            isLoading={isLoading}
            columns={clientsTableColumns}
            data={clientsDetails.data}
            onRowClick={handleRowClick}
            getRowStyles={(row) => {
              if (row?.["DocEntry"] === currentClient?.["DocEntry"]) {
                return {
                  backgroundColor: "rgba(0,0,0,0.05)",
                };
              }
            }}
          />
        </Col>
        <Col style={{ width: "100%" }}></Col>
      </Row>
      <ClientsPageFooter clientsDetails={clientsDetails} data={data} />
    </>
  );
}
