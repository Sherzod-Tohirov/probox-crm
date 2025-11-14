import { omit } from 'ramda';

const TextInput = ({ type = 'text', commonProps, props }) => {
  return (
    <input
      type={type}
      {...commonProps}
      {...omit(['images', 'accept', 'multiple', 'control', 'datePickerOptions'], props)}
    />
  );
};

export default TextInput;
