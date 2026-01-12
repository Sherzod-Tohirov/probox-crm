import { Row, Col, Input } from '@/components/ui';
import { setProductsFilter } from '@/store/slices/productsPageSlice';
import _ from 'lodash';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { PRODUCT_CONDITION_OPTIONS } from '../utils/options';

export default function ProductsFilter() {
  const dispatch = useDispatch();
  const { filter } = useSelector((state) => state.page.products);

  const { setValue, watch } = useForm({
    defaultValues: {
      ...filter,
    },
  });

  const watchedSearch = watch('search');
  const watchedCondition = watch('condition');

  const debouncedSearch = useMemo(
    () =>
      _.debounce((filter) => dispatch(setProductsFilter({ ...filter })), 300),
    []
  );

  useEffect(() => {
    debouncedSearch({
      search: watchedSearch ?? '',
      condition: watchedCondition ?? '',
    });
  }, [watchedSearch, watchedCondition]);

  return (
    <Row direction="row" gutter={4} align="center">
      <Col flexGrow>
        <Input
          name="search"
          type="search"
          variant="outlined"
          placeholder="Qidirish"
          value={watchedSearch}
          onChange={(e) => {
            setValue('search', e.target.value);
          }}
        />
      </Col>
      <Col flexGrow>
        <Input
          type="select"
          variant="outlined"
          options={PRODUCT_CONDITION_OPTIONS}
          value={watchedCondition}
          onChange={(value) => {
            setValue('condition', value);
          }}
        />
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
// import useFetchBranches from '@/hooks/data/useFetchBranches';
// import selectOptionsCreator from '@/utils/selectOptionsCreator';
// const { data: branches } = useFetchBranches();
// const branchOptions = selectOptionsCreator(branches, {
//   label: 'name',
//   value: 'id',
//   includeAll: true,
// });
// <Col flexGrow>
//   <Input type="select" variant="outlined" options={branchOptions} />
// </Col>;
