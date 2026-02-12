import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import useFetchSuppliers from '@/hooks/data/purchases/useFetchSuppliers';

export function usePurchaseForm({ supplier: courier, warehouse }) {
  const { data: suppliers } = useFetchSuppliers({
    params: {
      search: courier,
    },
    enabled: !!courier,
  });
  const getCurrentSupplier = (suppliers, courier) => {
    if (!suppliers || !suppliers?.suppliers) return null;
    if (suppliers?.suppliers?.length === 1) return suppliers.suppliers[0];
    const foundSupplier =
      suppliers.suppliers?.find(
        (supplier) => String(supplier?.code) === String(courier)
      ) ?? null;
    return foundSupplier;
  };
  const currentSupplier = getCurrentSupplier(suppliers, courier);

  const { control, watch, setValue } = useForm({
    defaultValues: {
      courier: currentSupplier?.name,
      warehouse: warehouse,
    },
  });

  useEffect(() => {
    setValue('courier', currentSupplier?.name);
    setValue('warehouse', warehouse);
  }, [warehouse, setValue, currentSupplier]);

  const [supplier, setSupplier] = useState(false);
  const courierValue = watch('courier');
  const warehouseValue = watch('warehouse');
  const handleCourierSelect = (value) => {
    setSupplier(value);
    setValue('courier', value?.name ?? value?.code, { shouldValidate: true });
    // Handle courier change logic here (e.g., API call, state update)
  };

  const handleWarehouseChange = (value) => {
    setValue('warehouse', value, { shouldValidate: true });
    // Handle warehouse change logic here (e.g., API call, state update)
  };

  return {
    control,
    supplier,
    courierValue,
    warehouseValue,
    handleCourierSelect,
    handleWarehouseChange,
  };
}
