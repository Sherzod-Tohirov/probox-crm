import { Col, Row, Navigation } from "@components/ui";
import Filter from "@features/clients/components/Filter";
import Status from "../../components/ui/Status";
import Footer from "../../components/Footer";
import { Button, Input, Pagination } from "../../components/ui";
import Table from "../../components/ui/Table";
import { mockDataClients } from "../../../mockData";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

const tableSizeSelectOptions = [
  { value: "10", label: "10" },
  { value: "100", label: "100" },
  { value: "1000", label: "1000" },
];

const columns = [
  { key: "clientCode", title: "Код клиента", width: "15%" },
  { key: "clientName", title: "Имя клиента" },
  { key: "product", title: "Товар" },
  { key: "monthlyPayment", title: "месячная оплата" },
  {
    key: "status",
    title: "Status",
    renderCell: (value) => {
      console.log("value", value);
      return <Status status={value.status} />;
    },
  },
  { key: "saleDate", title: "Дата продажи" },
  { key: "executor", title: "Исполнитель" },
  { key: "term", title: "Срок" },
];

export default function Clients() {
  const navigate = useNavigate();
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
          <Filter />
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
            <Input
              variant={"filter"}
              type={"select"}
              options={tableSizeSelectOptions}
              width={"clamp(69px, 10vw, 100px)"}
            />
          </Col>
          <Col>
            <Pagination />
          </Col>
          <Col>
            <Button variant={"filled"}>Распределение должников</Button>
          </Col>
        </Row>
      </Footer>
    </>
  );
}
