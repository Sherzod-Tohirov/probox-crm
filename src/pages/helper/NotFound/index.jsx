import { Button } from "@components/ui";
import styles from "./notFound.module.scss";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className={styles["not-found"]}>
      <h1 className={styles.title}>404</h1>
      <p className={styles.desc}>Sahifa topilmadi {":("}</p>
      <Button icon={"arrowLeft"} onClick={() => navigate("/")}>
        Ortga qaytish
      </Button>
    </div>
  );
}
