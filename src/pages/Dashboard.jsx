import { tableColumns, tableData } from "../../mockData";
import Alert from "../components/ui/Alert";
import Button from "../components/ui/Button";
import Table from "../components/ui/Table";
import { Box, Col, Pagination, Row, Input } from "../components/ui";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
export default function Dashboard() {
  const [alert, setAlert] = useState(false);

  return (
    <Row direction="column" gap={4}>
      <Table columns={tableColumns} data={tableData} />
      <Button onClick={() => setAlert(true)}>Click</Button>
      <Alert
        show={alert}
        type="success"
        message={
          "Alert informs users about important changes or conditions in the interface. Use this component if you need to communicate to users in a prominent way."
        }
      />
    </Row>
  );
}
