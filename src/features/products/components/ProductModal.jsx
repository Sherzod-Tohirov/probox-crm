import { Col, Input, Modal, Row } from '@/components/ui';
import { useProductsTableColumns } from '../hooks/useProductsTableColumns';
import Table from '@/components/ui/Table';
import useFetchProductItems from '@/hooks/data/products/useFetchProductItems';
import useFetchBranches from '@/hooks/data/useFetchBranches';
import selectOptionsCreator from '@/utils/selectOptionsCreator';
import { useForm } from 'react-hook-form';

export default function ProductModal({ currentProduct, isOpen, onClose }) {
  const { productTableColumns } = useProductsTableColumns(currentProduct);
  const { control, watch } = useForm({
    defaultValues: {
      branch: '',
    },
  });
  const watchedBranch = watch('branch');

  const { data, isLoading } = useFetchProductItems({
    itemCode: currentProduct?.ItemCode,
    whsCode: watchedBranch,
    enabled: currentProduct,
  });

  const { data: branches } = useFetchBranches();
  const branchOptions = selectOptionsCreator(branches, {
    label: 'name',
    value: 'code',
    includeAll: true,
  });

  return (
    <Modal
      size="lg"
      title={currentProduct?.ItemName || "Ma'lumot topilmadi"}
      isOpen={isOpen}
      onClose={onClose}
    >
      <Row gutter={4}>
        <Col flexGrow fullWidth span={5}>
          <Input
            name="branch"
            label={"Filial bo'yicha"}
            type="select"
            variant="outlined"
            options={branchOptions}
            control={control}
          />
        </Col>
        <Col fullWidth flexGrow>
          <Table
            id="product-table"
            uniqueKey="imei"
            scrollable
            showPivotColumn
            isLoading={isLoading}
            columns={productTableColumns}
            data={data?.items || []}
            getRowStyles={() => {}}
          />
        </Col>
      </Row>
    </Modal>
  );
}
