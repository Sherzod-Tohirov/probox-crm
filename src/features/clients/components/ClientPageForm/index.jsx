import { Col, Input, Row } from "@components/ui";
import styles from "./clientPageForm.module.scss";
import InputGroup from "./InputGroup";
import Label from "./Label";
import useToggle from "@hooks/useToggle";
import { images } from "../../../../../mockData";

export default function ClientPageForm({ formId, ...props }) {
  const { sidebar, messenger } = useToggle(["sidebar", "messenger"]);
  console.log(sidebar, messenger);
  return (
    <form className={styles.form} id={formId} {...props}>
      <Row direction={"row"} gutter={6} justify={"space-between"}>
        <Col>
          <Row gutter={1}>
            <Col>
              <InputGroup>
                <Label icon="avatarFilled">Name</Label>
                <Input
                  type="text"
                  variant={"filled"}
                  size={sidebar.isOpen ? "small" : ""}
                  defaultValue={"Maqsudov Nodir"}
                />
              </InputGroup>
            </Col>
            <Col>
              <InputGroup>
                <Label icon="photo">Photo</Label>
                <Input
                  type="file"
                  images={images}
                  variant={"filled"}
                  size={sidebar.isOpen ? "small" : ""}
                />
              </InputGroup>
            </Col>
            <Col>
              <InputGroup>
                <Label icon="telephoneFilled">Telephone</Label>
                <Input
                  type="tel"
                  variant={"filled"}
                  size={sidebar.isOpen ? "small" : ""}
                  value={"+998 94 534 33 24"}
                  hasIcon={false}
                />
              </InputGroup>
            </Col>
            <Col>
              <InputGroup>
                <Label icon="barCodeFilled">Code</Label>
                <Input
                  type="text"
                  variant={"filled"}
                  size={sidebar.isOpen ? "small" : ""}
                  value={"20470"}
                />
              </InputGroup>
            </Col>
          </Row>
        </Col>
        <Col>
          <Row gutter={1}>
            <Col>
              <InputGroup>
                <Label icon="expense">Debt client</Label>
                <Input
                  type="text"
                  variant={"filled"}
                  size={sidebar.isOpen ? "small" : ""}
                  value={"1800"}
                  disabled={true}
                />
              </InputGroup>
            </Col>
            <Col>
              <InputGroup>
                <Label icon="products">Product</Label>
                <Input
                  type="text"
                  variant={"filled"}
                  size={sidebar.isOpen ? "small" : ""}
                  value={"iPhone 16 Pro max 256gb desert"}
                  disabled={true}
                />
              </InputGroup>
            </Col>
            <Col>
              <InputGroup>
                <Label icon="calendar">Deadline</Label>
                <Input
                  type="date"
                  variant={"filled"}
                  size={sidebar.isOpen ? "small" : ""}
                  value={"12.03.2030"}
                  hasIcon={false}
                  disabled={true}
                />
              </InputGroup>
            </Col>
            <Col>
              <InputGroup>
                <Label icon="barCodeFilled">IMEI</Label>
                <Input
                  type="text"
                  variant={"filled"}
                  size={sidebar.isOpen ? "small" : ""}
                  value={"345345345453455"}
                  disabled={true}
                />
              </InputGroup>
            </Col>
          </Row>
        </Col>
      </Row>
    </form>
  );
}
