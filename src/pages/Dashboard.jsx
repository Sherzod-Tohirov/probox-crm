import { tableColumns, tableData } from "../../mockData";
import Alert from "../components/ui/Alert";
import Button from "../components/ui/Button";
import Table from "../components/ui/Table";
import { Box } from "../components/ui";
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
      <Footer></Footer>
    </>
  );
}
