import { tableColumns, tableData } from "../../mockData";
import Button from "../components/ui/Button";
import Table from "../components/ui/Table";
import { Box, Col, Row } from "../components/ui";
import useAlert from "@hooks/useAlert";
import {
  DashboardStatisticDate,
  DashboardStatistics,
  DashboardChart,
} from "@features/dashboard/components";

export default function Dashboard() {
  const { alert } = useAlert();
  return (
    <Row direction="column" gutter={8}>
      <Col fullWidth>
        <DashboardStatistics>
          <Row>
            <Col>
              <DashboardStatisticDate />
            </Col>
            <Col fullWidth>
              <Row direction="row" gutter={2}>
                <Col fullWidth span={6}>
                  <DashboardChart />
                </Col>
                <Col fullWidth span={6}>
                  <DashboardChart />
                </Col>
              </Row>
            </Col>
          </Row>
        </DashboardStatistics>
      </Col>
      <Col fullWidth>
        <Table columns={tableColumns} data={tableData} />
      </Col>
      <Col>
        <Box align={"stretch"} justify={"center"} gap={2} marginTop={2}>
          <Button
            variant={"filled"}
            onClick={() => {
              alert("This is success message", {
                type: "success",
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
              alert("This is default message", {
                type: "default",
              });
            }}>
            Alert Default
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
      </Col>
    </Row>
  );
}
