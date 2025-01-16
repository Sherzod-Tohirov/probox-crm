import Logo from "../Logo";
import Col from "../ui/Col";
import Row from "../ui/Row";
import Typography from "../ui/Typography";
import styles from "./sidebar.module.scss";
export default function Sidebar() {
  return (
    <Row className={styles.sidebar} wrap>
      <Col>
        <Logo />
      </Col>
      <Row>
         <Col>
            <Typography></Typography>
         </Col>
      </Row>
    </Row>
  );
}
