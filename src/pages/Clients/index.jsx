import { Col, Row, Navigation, Table } from "@components/ui";
import ClientsPageFooter from "@features/clients/components/ClientsPageFooter";
import Filter from "@features/clients/components/Filter";

import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  setClientsCurrentPage,
  setCurrentClient,
} from "@store/slices/clientsPageSlice";

import useFetchClients from "@hooks/data/useFetchClients";
import useTableColumns from "@hooks/useTableColumns";
import _ from "lodash";

export default function Clients() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentPage, filter } = useSelector((state) => state.page.clients);
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

  useEffect(() => {
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
    if (data && data.data && data.data.length > 0) {
      const scrollY = sessionStorage.getItem("scrollPositionClients");
      if (scrollY) {
        window.scrollTo(0, scrollY);
        sessionStorage.removeItem("scrollPositionClients");
      }
    }
  }, [data]);

  return (
    <>
      <Row gutter={6} style={{ width: "100%", height: "100%" }}>
        <Col>
          <Navigation />
        </Col>
        <Col fullWidth>
          <Filter onFilter={handleFilter} />
        </Col>
        <Col style={{ width: "100%" }} flexGrow>
          <Table
            isLoading={isLoading}
            columns={clientsTableColumns}
            data={clientsDetails.data}
            onRowClick={handleRowClick}
          />
        </Col>
        <Col style={{ width: "100%" }}></Col>
      </Row>
      <ClientsPageFooter clientsDetails={clientsDetails} data={data} />
    </>
  );
}
