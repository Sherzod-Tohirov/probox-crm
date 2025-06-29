import { memo, useCallback, useMemo } from "react";
import {
  Col,
  Row,
  Box,
  Button,
  Input,
  Pagination,
  Typography,
} from "@components/ui";

import Footer from "@components/Footer";

import { useDispatch, useSelector } from "react-redux";

import {
  setClientsCurrentPage,
  setClientsPageSize,
} from "@store/slices/clientsPageSlice";

import formatDate from "@utils/formatDate";
import hasRole from "@utils/hasRole";
import useAuth from "@hooks/useAuth";

import useMutateDistributeClients from "@hooks/data/clients/useMutateDistributeClients";
import useFetchStatistics from "@hooks/data/statistics/useFetchStatistics";
import formatterCurrency from "@utils/formatterCurrency";
import { ClipLoader } from "react-spinners";

import styles from "./style.module.scss";
import { insTotalCalculator } from "@utils/calculator";
import moment from "moment";
const ClientsFooter = ({ clientsDetails = {}, data }) => {
  const distributeMutation = useMutateDistributeClients();
  const { currentPage, pageSize, filter } = useSelector(
    (state) => state.page.clients
  );
  const { data: statisticsData, isLoading: isStatisticsLoading } =
    useFetchStatistics({
      startDate: formatDate(filter.startDate, "DD.MM.YYYY", "YYYY.MM.DD"),
      endDate: formatDate(filter.endDate, "DD.MM.YYYY", "YYYY.MM.DD"),
      slpCode: filter.slpCode,
    });
  const dispatch = useDispatch();
  const { user } = useAuth();

  const tableSizeSelectOptions = useMemo(() => [
    { value: 10, label: "10" },
    { value: 20, label: "20" },
    { value: 50, label: "50" },
    { value: 100, label: "100" },
    { value: 200, label: "200" },
  ]);
  const handleDistributeClients = useCallback(async () => {
    try {
      const payload = {
        startDate: formatDate(filter.startDate, "DD.MM.YYYY", "YYYY.MM.DD"),
        endDate: formatDate(filter.endDate, "DD.MM.YYYY", "YYYY.MM.DD"),
      };
      distributeMutation.mutate(payload);
    } catch (error) {
      console.log(error, "Error while distributing clients. ");
    }
  }, []);
  const calculatedInsTotal = useMemo(() => {
    return insTotalCalculator({
      paidToDate: statisticsData?.["PaidToDate"],
      sumApplied: statisticsData?.["SumApplied"],
      insTotal: statisticsData?.["InsTotal"],
    });
  }, [statisticsData]);

  const percentageValue = useMemo(() => {
    return parseFloat(
      Number(statisticsData?.["SumApplied"] / calculatedInsTotal) * 100 || 0
    ).toFixed(2);
  }, [statisticsData]);

  return (
    <Footer>
      <Row direction={"column"} justify={"space-between"} gutter={5}>
        <Col>
          <Box gap={2} dir="column" align={"start"} justify={"center"}>
            <>
              <Typography
                className={styles["statistics-text"]}
                variant={"primary"}
                element="span">
                <strong> To'liq summa:</strong>{" "}
                {isStatisticsLoading ? (
                  <ClipLoader color={"grey"} size={12} />
                ) : (
                  formatterCurrency(calculatedInsTotal, "USD")
                )}
              </Typography>
              <Typography
                className={styles["statistics-text"]}
                variant={"primary"}
                element="span">
                <strong> Qoplandi:</strong>{" "}
                {isStatisticsLoading ? (
                  <ClipLoader color={"grey"} size={12} />
                ) : (
                  <span style={{ color: "green" }}>
                    {formatterCurrency(
                      statisticsData?.["SumApplied"] || 0,
                      "USD"
                    )}
                  </span>
                )}{" "}
                <span style={{ color: percentageValue > 50 ? "green" : "red" }}>
                  {`(${percentageValue}%)`}
                </span>
              </Typography>
            </>
          </Box>
        </Col>
        <Col fullWidth>
          <Row direction={"row"} align={"center"} justify={"space-between"}>
            <Col>
              <Row
                direction={"row"}
                align={"center"}
                justify={"space-between"}
                gutter={3}>
                <Col>
                  <Input
                    variant={"outlined"}
                    type={"select"}
                    options={tableSizeSelectOptions}
                    defaultValue={Number(pageSize)}
                    onChange={(e) => {
                      dispatch(setClientsPageSize(Number(e.target.value)));
                    }}
                    canClickIcon={false}
                    width={"100px"}
                  />
                </Col>
                <Col>
                  <Box className={styles["total-text-wrapper"]}>
                    <Typography variant={"primary"} element="span">
                      {clientsDetails.total > 0
                        ? currentPage * pageSize + 1
                        : 0}
                      {"-"}
                      {(currentPage + 1) * pageSize > data?.total
                        ? data.total
                        : currentPage * pageSize + pageSize}{" "}
                      gacha {clientsDetails.total}ta dan
                    </Typography>
                  </Box>
                </Col>
              </Row>
            </Col>
            <Col>
              <Pagination
                pageCount={clientsDetails.totalPages}
                activePage={currentPage}
                onPageChange={(page) =>
                  dispatch(setClientsCurrentPage(page.selected))
                }
              />
            </Col>
            {hasRole(user, ["Manager"]) ? (
              <Col>
                <Button
                  disabled={moment().date() !== 1}
                  variant={"filled"}
                  onClick={handleDistributeClients}
                  isLoading={distributeMutation.isPending}>
                  Mijozlarni taqsimlash
                </Button>
              </Col>
            ) : null}
          </Row>
        </Col>
      </Row>
    </Footer>
  );
};

export default memo(ClientsFooter);
