import { Col, Navigation, Row } from "@components/ui";
import Messenger from "@components/ui/Messenger";
import { Button } from "../../components/ui";
import Table from "../../components/ui/Table";
import { mockDataClients } from "../../../mockData";
import Status from "../../components/ui/Status";
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
export default function ClientPage() {
  return (
    <Row direction="row" gutter={6}>
      <Col style={{ flexGrow: 1 }}>
        <Row>
          <Col fullWidth>
            <Row direction="row" align="center" justify="space-between">
              <Col>
                <Navigation />
              </Col>
              <Col>
                <Button variant={"primary"}>Сохранить</Button>
              </Col>
            </Row>
          </Col>
          <Col fullWidth>
            <Table columns={columns} data={mockDataClients} />
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
