import { tableColumns, tableData } from "../../mockData";
import Alert from "../components/ui/Alert";
import Button from "../components/ui/Button";
import Table from "../components/ui/Table";
import { Box, Col, Pagination, Row, Input } from "../components/ui";
import Footer from "../components/Footer";
export default function Dashboard() {
  return (
    <Row direction="column" gap={4}>
      <Table columns={tableColumns} data={tableData} />
      <Alert
        type="success"
        message={
          "Alert informs users about important changes or conditions in the interface. Use this component if you need to communicate to users in a prominent way."
        }
      />
    </Row>
  );
}
