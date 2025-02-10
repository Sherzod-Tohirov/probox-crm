import { tableColumns, tableData } from "../../mockData";
import Button from "../components/ui/Button";
import Table from "../components/ui/Table";
import { Box, Row } from "../components/ui";
import useAlert from "@hooks/useAlert";
export default function Dashboard() {
  const { alert } = useAlert();
  return (
    <Row direction="column" gap={4}>
      <Table columns={tableColumns} data={tableData} />
      <Box align={"stretch"} justify={"center"} gap={2} marginTop={2}>
        <Button
          variant={"filled"}
          onClick={() => {
            alert("This is success message", {
              type: "su",
            });
          }}>
          Alert Success
        </Button>
        <Button
          variant={"filled"}
          onClick={() => {
            alert("This is a warning message", {
              type: "info",
            });
          }}>
          Alert Warning
        </Button>
        <Button
          variant={"filled"}
          onClick={() => {
            alert("This is an error message", {
              type: "error",
            });
          }}>
          Alert Error
        </Button>
        <Button
          variant={"filled"}
          onClick={() => {
            alert(
              "This is a long toast message lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet a long toast message lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet",
              {
                type: "error",
              }
            );
          }}>
          Long Toast
        </Button>
      </Box>
    </Row>
  );
}
