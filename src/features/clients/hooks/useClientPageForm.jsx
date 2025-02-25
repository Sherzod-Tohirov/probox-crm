import { useCallback } from "react";

export default function useClientPageForm() {
  const onSubmit = useCallback((data) => {
    console.log(data);
  }, []);

  return { onSubmit };
}
