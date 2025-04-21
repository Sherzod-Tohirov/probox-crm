import { Col, Row, Navigation, Table } from "@components/ui";

import Filter from "@features/clients/components/Filter";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  setClientsCurrentPage,
  setCurrentClient,
} from "@store/slices/clientsPageSlice";

import useFetchClients from "@hooks/data/useFetchClients";
import useTableColumns from "@hooks/useTableColumns";
import ClientsFooter from "./ClientsFooter";
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
    console.log("dataaaaa", data);

    if (data?.totalPages && clientsDetails.totalPages !== data?.totalPages) {
      setClientsDetails((p) => ({ ...p, totalPages: data?.totalPages }));
    }

    if (data?.data.length >= 0) {
      setClientsDetails((p) => ({ ...p, data: data?.data }));
    }

    if (data?.total && clientsDetails.total !== data?.total) {
      setClientsDetails((p) => ({ ...p, total: data?.total }));
    }
  }, [data]);

  return (
    <>
      <Row gutter={6} style={{ width: "100%", height: "100%" }}>
        <Col>
          <Navigation />
        </Col>
        <Col>
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
      <ClientsFooter clientsDetails={clientsDetails} data={data} />
    </>
  );
}
