import {
  Col,
  Row,
  Navigation,
  Table,
  Button,
  Input,
  Pagination,
  Typography,
  Status,
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
import moment from "moment/moment";

const tableSizeSelectOptions = [
  { value: 10, label: "10" },
  { value: 20, label: "20" },
  { value: 50, label: "50" },
  { value: 100, label: "100" },
  { value: 1000, label: "1000" },
];

const columns = [
  { key: "DocEntry", title: "Код документа", width: "15%" },
  { key: "CardName", title: "Имя клиента" },
  { key: "Dscription", title: "Товар" },
  { key: "InsTotal", title: "Месячная оплата" },
  {
    key: "saleDate",
    title: "Оплачено",
    renderCell: (column) => {
      return column.PaidToDate || "Unknown";
    },
  },
  {
    key: "status",
    title: "Status",
    renderCell: (column) => {
      let status = "unpaid";

      const statusCalc =
        parseFloat(column.InsTotal) - parseFloat(column.PaidToDate);
      if (statusCalc > 0 && statusCalc < column.InsTotal) status = "partial";
      if (statusCalc === 0) status = "paid";

      return <Status status={status} />;
    },
  },

  {
    key: "executor",
    title: "Исполнитель",
    renderCell: (column) => {
      if (!column.SlpCode) return "Unknown";

      const executors = useFetchExecutors();
      const { user } = useAuth();
      const executor = executors?.data?.find(
        (executor) => executor.SlpCode === column.SlpCode
      );
      if (user.SlpCode === executor.SlpCode) return "You";
      return executor.SlpName || "Unknown";
    },
  },
  {
    key: "term",
    title: "Срок",
    renderCell: (column) => {
      if (!column.DueDate) return "Unknown";
      return moment(column.DueDate).format("DD.MM.YYYY");
    },
  },
];

export default function Clients() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [clientsDetails, setClientsDetails] = useState({
    totalPages: 0,
    total: 0,
    data: [],
  });
  console.log(clientsDetails, "clientsDetails");
  const { currentPage, pageSize } = useSelector((state) => state.page.clients);
  const { data, isLoading } = useFetchClients({ page: currentPage + 1 });
  console.log(data, "data");
  console.log(isLoading, "isLoading");
  console.log(currentPage, "currentPage");
  const handleRowClick = useCallback(
    (row) => {
      navigate(`/clients/${row.DocEntry}`);
    },
    [navigate]
  );

  useEffect(() => {
    console.log("dataaaaa", data);
    if (data?.totalPages && clientsDetails.totalPages !== data?.totalPages) {
      setClientsDetails((p) => ({ ...p, totalPages: data?.totalPages }));
    }

    if (data?.data.length > 0) {
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
          <Filter onFilter={(filterData) => console.log(filterData)} />
        </Col>
        <Col style={{ width: "100%" }} flexGrow>
          <Table
            isLoading={isLoading}
            columns={columns}
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
