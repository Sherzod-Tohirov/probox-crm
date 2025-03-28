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

import { mockDataClients } from "../../../mockData";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  setClientsPageSize,
  setClientsCurrentPage,
} from "@store/slices/clientsPageSlice";

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
  { key: "InsTotal", title: "месячная оплата" },
  {
    key: "status",
    title: "Status",
    renderCell: (column) => {
      return <Status status={column.status} />;
    },
  },
  { key: "saleDate", title: "Дата продажи" },
  { key: "executor", title: "Исполнитель" },
  { key: "term", title: "Срок" },
];

const obj = {
  DueDate: "2024-02-26 00:00:00.000000000",
  InstlmntID: 2,
  PaidToDate: "125.000000",
  InsTotal: "125.000000",
  PaysList: [
    {
      SumApplied: "32.590000",
      AcctName: "Karta",
      DocDate: "2024-02-29 00:00:00.000000000",
      CashAcct: "5020",
      CheckAcct: null,
    },
    {
      SumApplied: "92.410000",
      AcctName: "Karta",
      DocDate: "2024-02-27 00:00:00.000000000",
      CashAcct: "5020",
      CheckAcct: null,
    },
  ],
};

export default function Clients() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentPage, pageSize } = useSelector((state) => state.page.clients);
  console.log(pageSize, "page size from redux");
  console.log(currentPage, pageSize, "page size");
  const handleRowClick = useCallback(
    (row) => {
      navigate(`/clients/${row.clientCode}`);
    },
    [navigate]
  );

  return (
    <>
      <Row gutter={6} style={{ width: "100%" }}>
        <Col>
          <Navigation />
        </Col>
        <Col>
          <Filter onFilter={(filterData) => console.log(filterData)} />
        </Col>
        <Col style={{ width: "100%" }}>
          <Table
            columns={columns}
            data={mockDataClients}
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
                  width={"clamp(69px, 10vw, 100px)"}
                />
              </Col>
              <Col>
                <Typography variant={"primary"} element="span">
                  1-10 of 50
                </Typography>
              </Col>
            </Row>
          </Col>
          <Col>
            <Pagination
              pageCount={10}
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
