import Button from "../Button";

export default function TextInput({ value, onChange }) {
  return (
    <form className={styles["text-input-form"]}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <div>
        <Button type="submit">Send</Button>
      </div>
    </form>
  );
}
