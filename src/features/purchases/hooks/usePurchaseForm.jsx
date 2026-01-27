import { useForm } from 'react-hook-form';

export function usePurchaseForm() {
  const { control, watch } = useForm({
    defaultValues: {
      courier: '',
      warehouse: '',
    },
  });

  const courierValue = watch('courier');
  const warehouseValue = watch('warehouse');

  const handleCourierSelect = (value) => {
    console.log('Courier changed:', value);
    // Handle courier change logic here (e.g., API call, state update)
  };

  const handleWarehouseChange = (value) => {
    console.log('Warehouse changed:', value);
    // Handle warehouse change logic here (e.g., API call, state update)
  };

  return {
    control,
    courierValue,
    warehouseValue,
    handleCourierSelect,
    handleWarehouseChange,
  };
}
