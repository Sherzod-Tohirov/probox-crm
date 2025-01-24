import { tableColumns, tableData } from "../../mockData";
import Alert from "../components/ui/Alert";
import Button from "../components/ui/Button";
import Table from "../components/ui/Table";
import { Box, Col, Pagination, Row, Input } from "../components/ui";
import Footer from "../components/Footer";
export default function Dashboard() {
  return (
    <>
      <Table columns={tableColumns} data={tableData} />
      <Alert
        type="success"
        message={
          "Alert informs users about important changes or conditions in the interface. Use this component if you need to communicate to users in a prominent way."
        }
      />
      <Box>
        <Button isLoading={true} variant={"primary"} icon={"send"}>
          Send
        </Button>
      </Box>
      <Input variant={"filter"} type={"text"} label={"name"} icon={"avatar"} />
      <Footer>
        <Row direction="row" justify="center">
          <Col>
            <Pagination />
          </Col>
        </Row>
      </Footer>
    </>
  );
}
