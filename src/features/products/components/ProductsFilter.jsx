import { Row, Col, Input } from '@/components/ui';
import useFetchBranches from '@/hooks/data/useFetchBranches';
import selectOptionsCreator from '@/utils/selectOptionsCreator';

const statusOptions = [
  { label: 'Hammasi', value: 'all' },
  { label: 'Yangi', value: 'new' },
  { label: 'B/U', value: 'old' },
];

export default function ProductsFilter() {
  const { data: branches } = useFetchBranches();
  const branchOptions = selectOptionsCreator(branches, {
    label: 'name',
    value: 'id',
    includeAll: true,
  });
  return (
    <Row direction="row" gutter={4} align="center">
      <Col flexGrow>
        <Input type="search" variant="outlined" placeholder="Qidirish" />
      </Col>
      <Col flexGrow>
        <Input type="select" variant="outlined" options={branchOptions} />
      </Col>
      <Col flexGrow>
        <Input type="select" variant="outlined" options={statusOptions} />
      </Col>
    </Row>
  );
}
// {
/* <Input
          name="search"
          label="IMEI | FIO"
          size={isMobileOnly ? 'full-grow' : undefined}
          style={isMobileOnly ? {} : { minWidth: '290px' }}
          type="search"
          placeholder="4567890449494 | Ismi Sharif"
          placeholderColor="secondary"
          searchText={showSearchDropdown.search ? watchedSearch : ''}
          onFocus={onFocusSearch}
          onBlur={onBlurSearch}
        /> */
// }
