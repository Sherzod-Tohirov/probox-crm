import { memo, useCallback, useMemo, useState } from "react";
import {
  Col,
  Row,
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
import { distributeClients } from "@services/clientsService";
import formatDate from "@utils/formatDate";
import hasRole from "@utils/hasRole";
import useAuth from "@hooks/useAuth";
import useAlert from "@hooks/useAlert";

const ClientsFooter = ({ clientsDetails = {}, data }) => {
  const [distributionState, setDistributionState] = useState({
    isSuccess: false,
    isLoading: false,
  });

  const { currentPage, pageSize, filter } = useSelector(
    (state) => state.page.clients
  );

  const dispatch = useDispatch();
  const { user } = useAuth();
  const { alert } = useAlert();

  const tableSizeSelectOptions = useMemo(() => [
    { value: 10, label: "10" },
    { value: 20, label: "20" },
    { value: 50, label: "50" },
    { value: 100, label: "100" },
    { value: 1000, label: "1000" },
  ]);
  const handleDistributeClients = useCallback(async () => {
    setDistributionState((p) => ({ ...p, isLoading: true }));
    try {
      const response = await distributeClients({
        startDate: formatDate(filter.startDate, "DD.MM.YYYY", "YYYY.MM.DD"),
        endDate: formatDate(filter.endDate, "DD.MM.YYYY", "YYYY.MM.DD"),
      });

      console.log(response, "put");
      if (response?.message === "success") {
        alert("Mijozlar muvaffaqiyatli taqsimlandi!");
      }

      if (response) {
        setDistributionState((p) => ({ ...p, isSuccess: true }));
      }
    } catch (error) {
      console.log(error, "Error while distributing clients. ");
    } finally {
      setDistributionState((p) => ({ ...p, isLoading: false }));
    }
  }, []);

  return (
    <Footer>
      <Row direction={"row"} justify={"space-between"}>
        <Col>
          <Row direction={"row"} align={"center"} gutter={3}>
            <Col>
              <Input
                variant={"outlined"}
                type={"select"}
                options={tableSizeSelectOptions}
                defaultValue={Number(pageSize)}
                onChange={(e) => {
                  dispatch(setClientsPageSize(Number(e.target.value)));
                  dispatch(setClientsCurrentPage(0));
                }}
                canClickIcon={false}
                width={"clamp(69px, 10vw, 100px)"}
              />
            </Col>
            <Col>
              <Typography variant={"primary"} element="span">
                {currentPage * pageSize + 1}
                {"-"}
                {(currentPage + 1) * pageSize > data?.total
                  ? data.total
                  : currentPage * pageSize + pageSize}{" "}
                gacha {clientsDetails.total}ta dan
              </Typography>
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
              variant={"filled"}
              onClick={handleDistributeClients}
              isLoading={distributionState.isLoading}>
              Mijozlarni taqsimlash
            </Button>
          </Col>
        ) : null}
      </Row>
    </Footer>
  );
};

export default memo(ClientsFooter);
