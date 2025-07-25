import { Box } from '@components/ui';

export default function InputGroup({ children, ...props }) {
  return (
    <Box dir="row" style={{ width: '100%', flexGrow: 1 }} {...props}>
      {children}
    </Box>
  );
}
