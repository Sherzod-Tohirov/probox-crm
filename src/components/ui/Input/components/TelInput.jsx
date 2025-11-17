import PhoneInput from 'react-phone-input-2';
import classNames from 'classnames';
import styles from '../input.module.scss';
import { formatPhoneNumber } from '@utils/formatPhoneNumber';

const TelInput = ({ value, defaultValue, onChange, onFocus, size, variant, commonProps }) => {
  const v = value ?? defaultValue ?? '';
  return (
    <PhoneInput
      {...(onFocus ? { onFocus } : {})}
      {...{ ...commonProps, className: undefined, style: undefined }}
      value={formatPhoneNumber(v)}
      inputClass={classNames(styles[`input-tel-${variant}`], styles[size])}
      inputStyle={commonProps.style}
      containerClass={styles['input-tel-container']}
      onlyCountries={['uz']}
      disableDropdown={true}
      countryCodeEditable={false}
      buttonClass={styles['hidden']}
      country={'uz'}
      onChange={(val) => {
        onChange?.(formatPhoneNumber(val));
      }}
    />
  );
};

export default TelInput;
