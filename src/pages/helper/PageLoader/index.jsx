import { ClipLoader } from "react-spinners";
import styles from "./loader.module.scss";
export default function PageLoader() {
  return (
    <div className={styles["page-loader"]}>
      <ClipLoader color={"#00000067"} loading={true} size={50} />
    </div>
  );
}
