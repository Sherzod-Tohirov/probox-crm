import useTheme from '@/hooks/useTheme';
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
  avatarSize = 22,
  enableClearAll = true,
  ...props
}) => {
  const { currentTheme } = useTheme();
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
          // Match other inputs: blue border on focus, no glow shadow
          border:
            state.isFocused || state.menuIsOpen
              ? '#0a4d68'
              : baseStyles.borderColor,
          boxShadow: 'none',
          '&:hover': {
            borderColor:
              state.isFocused || state.menuIsOpen
                ? '#0a4d68'
                : baseStyles.borderColor,
          },
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
          paddingRight: '10px',
          whiteSpace: 'nowrap',
          '&::-webkit-scrollbar': {
            width: '5px',
            height: '5px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(0,0,0,0.2)',
          },
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
          padding: showAvatars ? '1px' : '2px 4px',
          // Chip width includes avatar + spacing for remove button
          minWidth: showAvatars ? avatarSize + 2 : undefined,
          maxWidth: showAvatars ? avatarSize + 2 : 140,
          overflow: showAvatars ? 'visible' : 'hidden',
          flex: '0 0 auto',
          marginRight: showAvatars ? 6 : 6,
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
          const defaultAvatar = (option) => {
            if (option?.avatarUrl) {
              return (
                <img
                  src={option.avatarUrl}
                  alt={option.label}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              );
            }
            const name = (option?.label || '').trim();
            const parts = name.split(/\s+/);
            const initials = parts
              .slice(0, 2)
              .map((p) => (p && p[0] ? p[0].toUpperCase() : ''))
              .join('');
            return (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#e6f4ff',
                  color: '#1677ff',
                  fontSize: 11,
                  fontWeight: 700,
                }}
                title={option?.label}
              >
                {initials || 'U'}
              </div>
            );
          };

          const avatarNode =
            typeof renderAvatar === 'function'
              ? renderAvatar(opt)
              : defaultAvatar(opt);

          return (
            <components.MultiValueLabel {...mvProps}>
              {showAvatars ? (
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
                    background: 'transparent',
                  }}
                >
                  {avatarNode}
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
                background: currentTheme === 'dark' ? 'red' : '#fff',
                border: '1px solid rgba(0,0,0,0.2)',
                boxSizing: 'border-box',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0,
                zIndex: 2,
                cursor: 'pointer',
              },
            }}
          >
            <span style={{ fontSize: 10, lineHeight: 1, fontWeight: 600 }}>
              ×
            </span>
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
