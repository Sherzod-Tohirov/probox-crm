import { Input } from "../../../../components/ui";
import styles from "./clientPageForm.module.scss";

export default function ClientPageForm() {
  return (
    <div>
      <h1>Client Page Form</h1>
      <Input type={"text"} variant={"filled"} />
      <Input type={"date"} variant={"filled"} />
    </div>
  );
}
