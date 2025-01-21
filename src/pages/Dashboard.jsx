import { tableColumns, tableData } from "../../mockData";
import Alert from "../components/ui/Alert";
import Table from "../components/ui/Table";

export default function Dashboard() {
  return (
    <>
      <Table columns={tableColumns} data={tableData} />
      <Alert
        message={
          "Alert informs users about important changes or conditions in the interface. Use this component if you need to communicate to users in a prominent way."
        }
      />
    </>
  );
}
