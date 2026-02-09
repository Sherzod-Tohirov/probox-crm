import _ from 'lodash';
import { useSelector } from 'react-redux';

export default function useSelectorValue(selector, defaultValue) {
  const value = useSelector((state) =>
    _.result(state, 'page.newStatistics.' + selector, defaultValue)
  );
  return value;
}
