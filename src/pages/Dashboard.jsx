import { tableColumns, tableData } from "../../mockData";
import Button from "../components/ui/Button";
import Table from "../components/ui/Table";
import { Row } from "../components/ui";
import useAlert from "@hooks/useAlert";
export default function Dashboard() {
  const { alert, AlertContainer } = useAlert();
  return (
    <Row direction="column" gap={4}>
      <Table columns={tableColumns} data={tableData} />
      <Button
        onClick={() => {
          alert("Hi !", { type: "info" });
        }}>
        Click
      </Button>
      <AlertContainer />
    </Row>
  );
}
