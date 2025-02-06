import { Box } from "../../../../components/ui";

export default function InputGroup({ children, ...props }) {
  return (
    <Box dir="row" {...props}>
      {children}
    </Box>
  );
}
