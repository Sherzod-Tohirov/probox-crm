import { tableColumns, tableData } from "../../mockData";
import Button from "../components/ui/Button";
import Table from "../components/ui/Table";
import { Alert, Row } from "../components/ui";
import useAlert from "@hooks/useAlert";
import toast from "react-hot-toast";
export default function Dashboard() {
  return (
    <Row direction="column" gap={4}>
      <Table columns={tableColumns} data={tableData} />
      <Button
        onClick={() => {
          toast.custom((t) => {
            return (
              <Alert
                message={"Hello world"}
                onClose={() => toast.dismiss(t.id)}
              />
            );
          });
          toast.error("Hello world");
        }}>
        Click
      </Button>
    </Row>
  );
}
