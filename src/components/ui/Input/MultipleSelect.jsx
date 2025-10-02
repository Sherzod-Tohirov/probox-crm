import { memo, useCallback } from 'react';
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

const MultipleSelect = ({
  field,
  options = [],
  isLoading,
  showAvatars = false,
  renderAvatar, // (option) => ReactNode
  avatarSize = 20,
  enableClearAll = true,
  ...props
}) => {
  const handleChange = useCallback((selected, actionMeta, field) => {
    // selected can be null when clearing
    const safeSelected = Array.isArray(selected) ? selected : [];
    field.onChange(safeSelected);
  }, []);
  return (
    <Select
      {...field}
      {...props}
      openMenuOnClick={true}
      openMenuOnFocus={true}
      isSearchable={props.isSearchable ?? false}
      menuPlacement={props.menuPlacement || 'auto'}
      menuShouldScrollIntoView={true}
      menuShouldBlockScroll={true}
      backspaceRemovesValue={true}
      blurInputOnSelect={false}
      closeMenuOnScroll={false}
      menuPortalTarget={
        props.menuPortalTarget ||
        (typeof document !== 'undefined' ? document.body : undefined)
      }
      isClearable={props.isClearable ?? true}
      styles={{
        control: (baseStyles, state) => ({
          ...baseStyles,
          width: '100%',
          maxWidth: '100%',
          minWidth: 0,
          flex: '1 1 auto',
          overflow: 'hidden',
          ...(props.style || {}),
        }),
        container: (baseStyles) => ({
          ...baseStyles,
          width: '100%',
          maxWidth: '100%',
          minWidth: 0,
          overflow: 'hidden',
        }),
        valueContainer: (base) => ({
          ...base,
          maxWidth: '100%',
          overflowX: 'auto',
          overflowY: 'hidden',
          whiteSpace: 'nowrap',
          '&::-webkit-scrollbar': {
            width: '5px',
            height: '5px'
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent'
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(0,0,0,0.2)'
          }
        }),
        menuPortal: (base) => ({ ...base, zIndex: 1006 }),
        multiValue: (baseStyles) => ({
          ...baseStyles,
          top: '0',
          display: 'inline-flex',
          alignItems: 'center',
          height: '100%',
          position: 'relative',
          backgroundColor: 'transparent',
          border: showAvatars ? 'none' : '1px solid #ccc',
          borderRadius: showAvatars ? '999px' : '6px',
          padding: showAvatars ? 0 : '2px 4px',
          // Chip width equals avatar size when showing avatars
          minWidth: showAvatars ? avatarSize : undefined,
          maxWidth: showAvatars ? avatarSize : 140,
          overflow: showAvatars ? 'visible' : 'hidden',
          flex: '0 0 auto',
          marginRight: 6,
          boxSizing: 'border-box',
        }),
        multiValueLabel: (base) => ({
          ...base,
          width: showAvatars ? avatarSize : base.width,
          height: showAvatars ? avatarSize : base.height,
          maxWidth: showAvatars ? avatarSize : 120,
          padding: showAvatars ? 0 : base.padding,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxSizing: 'border-box',
        }),
        multiValueRemove: (base) => ({
          ...base,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 2px',
          marginLeft: 2,
          backgroundColor: 'transparent',
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
        ValueContainer: ({ children, ...vcProps }) => {
          return (
            <components.ValueContainer {...vcProps}>
              {isLoading ? (
                <ClipLoader size={16} color="rgba(0,0,0,0.4)" />
              ) : null}
              {children}
            </components.ValueContainer>
          );
        },
        MultiValueLabel: (mvProps) => {
          const opt = mvProps.data;
          return (
            <components.MultiValueLabel {...mvProps}>
              {showAvatars && typeof renderAvatar === 'function' ? (
                <span
                  style={{
                    width: avatarSize,
                    height: avatarSize,
                    borderRadius: '50%',
                    overflow: 'hidden',
                    flex: '0 0 auto',
                    border: '1px solid rgba(0,0,0,0.15)',
                    boxSizing: 'border-box',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#fff',
                  }}
                >
                  {renderAvatar(opt)}
                </span>
              ) : (
                mvProps.children
              )}
            </components.MultiValueLabel>
          );
        },
        Option: CustomOption, // Custom checkbox-like options
        MultiValueRemove: (rmProps) => (
          <components.MultiValueRemove
            {...rmProps}
            innerProps={{
              ...rmProps.innerProps,
              style: {
                position: 'absolute',
                top: -3,
                right: -3,
                width: 14,
                height: 14,
                borderRadius: '50%',
                background: '#fff',
                border: '1px solid rgba(0,0,0,0.2)',
                boxSizing: 'border-box',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0,
                zIndex: 1,
              },
            }}
          >
            <span style={{ fontSize: 10, lineHeight: 1 }}>×</span>
          </components.MultiValueRemove>
        ),
        MenuList: (menuProps) => {
          const selected = field?.value || [];
          return (
            <>
              {enableClearAll && selected.length > 0 ? (
                <div
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    field.onChange([]);
                  }}
                  style={{
                    padding: '6px 10px',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: 'rgba(254, 6, 6, 0.6)',
                    borderBottom: '1px solid rgb(245, 244, 244)',
                    cursor: 'pointer',
                    background: '',
                    position: 'sticky',
                    top: 0,
                    zIndex: 1,
                  }}
                >
                  Barchasini tozalash
                </div>
              ) : null}
              <components.MenuList {...menuProps} />
            </>
          );
        },
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
