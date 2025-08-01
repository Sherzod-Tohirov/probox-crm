import { memo, useCallback, useMemo } from 'react';
import Select, { components } from 'react-select';
import { ClipLoader } from 'react-spinners';

const CustomOption = (props) => {
  const { isSelected, label } = props;
  return (
    <components.Option {...props}>
      <span className={`checkbox ${isSelected ? 'checked' : ''}`}></span>
      {label}
    </components.Option>
  );
};

const MultipleSelect = ({ field, options = [], isLoading, ...props }) => {
  const handleChange = useCallback((selected, actionMeta, field) => {
    const allOptions = options.filter((opt) => opt.value !== 'all');
    let newSelected = selected;
    // Handle "Select All"
    if (selected.some((opt) => opt.value === 'all')) {
      newSelected = allOptions; // Select all options
    } else if (
      actionMeta.action === 'deselect-option' &&
      actionMeta.option.value === 'select-all'
    ) {
      newSelected = []; // Deselect all
    }

    // Update form field
    field.onChange(newSelected.filter((opt) => opt.value !== 'select-all')); // Exclude "Select All" from form value
  }, []);
  return (
    <Select
      {...field}
      {...props}
      openMenuOnClick={true}
      styles={{
        control: (baseStyles, state) => ({
          width: '100%',
          ...baseStyles,
          ...(props.style || {}),
        }),
        container: (baseStyles) => ({
          ...baseStyles,
          width: '100%',
        }),
        multiValue: (baseStyles) => ({
          ...baseStyles,
          top: '0',
          backgroundColor: 'transparent',
          border: '1px solid #ccc',
          borderRadius: '4px',
          padding: '2px 4px',
        }),
      }}
      classNamePrefix="react-select"
      isMulti
      placeholder={'Tanlash'}
      options={options}
      closeMenuOnSelect={false} // Keep menu open for multiple selections
      hideSelectedOptions={false} // Keep selected options in the list
      components={{
        DropdownIndicator: () => null, // Remove dropdown icon
        ValueContainer: ({ children, options, ...props }) => {
          const selectedOptions = props.getValue();
          const displayValue = selectedOptions
            .filter((opt) => opt.value !== 'all') // Exclude "Select All" from display
            .map((opt) => opt.label)
            .join(', ');

          return (
            <components.ValueContainer {...props}>
              {isLoading ? (
                <ClipLoader size={16} color="rgba(0,0,0,0.4)" />
              ) : (
                displayValue || children[1]
              )}
            </components.ValueContainer>
          );
        }, // Custom comma-separated display
        Option: CustomOption, // Custom checkbox-like options
      }}
      onChange={(selected, actionMeta) =>
        handleChange(selected, actionMeta, field)
      }
      value={options.filter((opt) =>
        field.value?.some((val) => val.value === opt.value)
      )} // Ensure controlled value
    />
  );
};

export default memo(MultipleSelect);
