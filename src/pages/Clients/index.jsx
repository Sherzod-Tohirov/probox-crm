import {
  Col,
  Row,
  Navigation,
  Table,
  Button,
  Input,
  Pagination,
  Typography,
} from "@components/ui";

import Filter from "@features/clients/components/Filter";
import Footer from "@components/Footer";

import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  setClientsPageSize,
  setClientsCurrentPage,
} from "@store/slices/clientsPageSlice";

import useFetchClients from "@hooks/data/useFetchClients";
import { setCurrentCLient } from "@store/slices/clientsPageSlice";
import { clientsTableColumns } from "@utils/tableColumns";
import formatDate from "@utils/formatDate";

const tableSizeSelectOptions = [
  { value: 10, label: "10" },
  { value: 20, label: "20" },
  { value: 50, label: "50" },
  { value: 100, label: "100" },
  { value: 1000, label: "1000" },
];

export default function Clients() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [clientsDetails, setClientsDetails] = useState({
    totalPages: 0,
    total: 0,
    data: [],
  });
  const [params, setParams] = useState({});
  console.log(clientsDetails, "clientsDetails");
  const { currentPage, pageSize } = useSelector((state) => state.page.clients);
  const { data, isLoading } = useFetchClients({
    page: currentPage + 1,
    params,
  });

  const handleRowClick = useCallback(
    (row) => {
      navigate(`/clients/${row.DocEntry}`);
      dispatch(setCurrentCLient(row));
    },
    [navigate]
  );

  const handleFilter = useCallback((filterData) => {
    console.log(filterData, "filterData");
    console.log(
      formatDate(filterData.startDate, "YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
      "startDate"
    );
    console.log(
      formatDate(filterData.endDate, "YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
      "endDate"
    );
    setParams(() => ({
      search: filterData.search,
      paymentStatus: filterData.paymentStatus,
      phone: filterData.phone,
      slpCode: filterData.executor,
      startDate: formatDate(filterData.startDate, "YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
      endDate: formatDate(filterData.endDate, "YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
    }));
    dispatch(setClientsCurrentPage(0));
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

  useEffect(() => {
    dispatch(setClientsCurrentPage(0));
  }, [pageSize]);

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
      <Footer>
        <Row direction={"row"} justify={"space-between"}>
          <Col>
            <Row direction={"row"} align={"center"} gutter={3}>
              <Col>
                <Input
                  variant={"outlined"}
                  type={"select"}
                  options={tableSizeSelectOptions}
                  defaultValue={Number(pageSize)}
                  onChange={(e) =>
                    dispatch(setClientsPageSize(Number(e.target.value)))
                  }
                  canClickIcon={false}
                  width={"clamp(69px, 10vw, 100px)"}
                />
              </Col>
              <Col>
                <Typography variant={"primary"} element="span">
                  {currentPage * pageSize + 1}
                  {"-"}
                  {(currentPage + 1) * pageSize > data?.total
                    ? data.total
                    : currentPage * pageSize + pageSize}{" "}
                  of {clientsDetails.total}
                </Typography>
              </Col>
            </Row>
          </Col>
          <Col>
            <Pagination
              pageCount={clientsDetails.totalPages}
              activePage={currentPage}
              onPageChange={(page) =>
                dispatch(setClientsCurrentPage(page.selected))
              }
            />
          </Col>
          <Col>
            <Button variant={"filled"}>Распределение должников</Button>
          </Col>
        </Row>
      </Footer>
    </>
  );
}
