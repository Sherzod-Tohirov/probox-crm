import { STATUS_UI } from '../../utils/status';
import Badge from '@/components/ui/Badge';

export default function StatusBadge({ status }) {
  const ui = STATUS_UI[status];
  return (
    <Badge size="lg" color={ui.color}>
      {ui.label}
    </Badge>
  );
}
