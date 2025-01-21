import { tableColumns, tableData } from "../../mockData";
import Table from "../components/ui/Table";

export default function Dashboard() {
  return <Table columns={tableColumns} data={tableData} />;
}
