import useTheme from '@/hooks/useTheme';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
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

let activeSelectInstance = null;

const fallbackFrame =
  typeof window !== 'undefined' && window.requestAnimationFrame
    ? window.requestAnimationFrame.bind(window)
    : (cb) => setTimeout(cb, 0);

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
  const selectRef = useRef(null);
  const wrapperRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const { currentTheme } = useTheme();

  const handleChange = useCallback((selected, actionMeta, field) => {
    // selected can be null when clearing
    const safeSelected = Array.isArray(selected) ? selected : [];
    field.onChange(safeSelected);
  }, []);

  const handleFocus = useCallback(() => {
    if (activeSelectInstance && activeSelectInstance !== selectRef.current) {
      const previous = activeSelectInstance;
      fallbackFrame(() => previous?.blur?.());
    }
    activeSelectInstance = selectRef.current;
  }, []);

  const handleMenuClose = useCallback(() => {
    if (activeSelectInstance === selectRef.current) {
      activeSelectInstance = null;
    }
    setMenuOpen(false);
  }, []);

  useEffect(() => {
    const onDocMouseDown = (e) => {
      if (!menuOpen) return;
      const wrapper = wrapperRef.current;
      if (!wrapper) return;
      const target = e.target;
      const isInsideControl = wrapper.contains(target);
      const isInsideAnyMenu = target.closest
        ? target.closest('.react-select__menu')
        : null;
      if (!isInsideControl && !isInsideAnyMenu) {
        // Close and remove focus when clicking anywhere outside
        setMenuOpen(false);
        const inst = selectRef.current;
        if (inst && typeof inst.blur === 'function') {
          inst.blur();
        }
      }
    };
    document.addEventListener('mousedown', onDocMouseDown, true);
    return () =>
      document.removeEventListener('mousedown', onDocMouseDown, true);
  }, [menuOpen]);

  return (
    <div ref={wrapperRef} style={{ width: '100%' }}>
      <Select
        ref={selectRef}
        {...field}
        {...props}
        openMenuOnClick={true}
        openMenuOnFocus={true}
        menuIsOpen={menuOpen}
        isSearchable={props.isSearchable ?? false}
        menuPlacement={props.menuPlacement || 'auto'}
        menuShouldScrollIntoView={true}
        menuShouldBlockScroll={false}
        backspaceRemovesValue={true}
        blurInputOnSelect={false}
        closeMenuOnScroll={(e) => {
          // Close on scroll outside the menu
          const target = e?.target;
          if (!target) return false;
          return !target.classList?.contains('react-select__menu-list');
        }}
        noOptionsMessage={() => 'Hech narsa topilmadi'}
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
            minHeight: showAvatars ? avatarSize + 8 : baseStyles.minHeight,
            flex: '1 1 auto',
            overflow: 'visible',
            border: `1px solid ${state.isFocused ? '#D6DFEB' : '#D6DFEB'}`,
            boxShadow: 'none',
            outline: menuOpen ? '2px solid #4A90E2 !important' : 'none',
            outlineOffset: menuOpen ? '-2px !important' : '0',
            backgroundColor: state.isFocused || menuOpen ? '#fff' : '#f8fafc',
            transition:
              'outline 0.15s ease, outline-offset 0.15s ease, background-color 0.15s ease',
            '&:hover': {
              borderColor: state.isFocused ? '#D6DFEB' : '#B6C2D4',
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
            minHeight: showAvatars ? avatarSize + 4 : base.minHeight,
            overflowX: 'auto',
            overflowY: 'visible',
            padding: showAvatars ? '2px 4px' : base.padding,
            paddingRight: showAvatars ? '4px' : '10px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
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
            height: showAvatars ? avatarSize : '100%',
            minHeight: showAvatars ? avatarSize : undefined,
            position: 'relative',
            backgroundColor: 'transparent',
            border: showAvatars ? 'none' : '1px solid #ccc',
            borderRadius: showAvatars ? '999px' : '6px',
            padding: showAvatars ? '0' : '2px 4px',
            margin: showAvatars ? '1px 0' : baseStyles.margin,
            // Chip width is exactly avatar size when showing avatars
            minWidth: showAvatars ? avatarSize : undefined,
            maxWidth: showAvatars ? avatarSize : 140,
            width: showAvatars ? avatarSize : 'auto',
            overflow: showAvatars ? 'visible' : 'hidden',
            flex: '0 0 auto',
            marginRight: showAvatars ? 3 : 6, // Tighter spacing for avatars
            boxSizing: 'border-box',
          }),
          multiValueLabel: (base) => ({
            ...base,
            width: showAvatars ? avatarSize : base.width,
            height: showAvatars ? avatarSize : base.height,
            maxWidth: showAvatars ? avatarSize : 120,
            minWidth: showAvatars ? avatarSize : undefined,
            minHeight: showAvatars ? avatarSize : undefined,
            maxHeight: showAvatars ? avatarSize : undefined,
            padding: 0,
            margin: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            display: showAvatars ? 'flex' : 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxSizing: 'border-box',
            flexShrink: 0,
          }),
          multiValueRemove: (base) => ({
            ...base,
            display: showAvatars ? 'none' : 'inline-flex', // Hide on hover for avatars
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 2px',
            marginLeft: showAvatars ? 0 : 2,
            backgroundColor: 'transparent',
            '&:hover': showAvatars
              ? {
                  display: 'inline-flex',
                }
              : {},
          }),
        }}
        classNamePrefix="react-select"
        isMulti
        placeholder={'Tanlash'}
        options={options}
        closeMenuOnSelect={false} // Keep menu open for multiple selections
        hideSelectedOptions={false} // Keep selected options in the list
        onFocus={(event) => {
          handleFocus();
          props.onFocus?.(event);
        }}
        onBlur={(event) => {
          if (activeSelectInstance === selectRef.current) {
            activeSelectInstance = null;
          }
          setMenuOpen(false);
          field.onBlur?.();
          props.onBlur?.(event);
        }}
        onMenuOpen={() => {
          handleFocus();
          setMenuOpen(true);
          props.onMenuOpen?.();
        }}
        onMenuClose={(event) => {
          handleMenuClose();
          props.onMenuClose?.(event);
        }}
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
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
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
                    fontSize: Math.max(10, avatarSize * 0.42),
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
                      minWidth: avatarSize,
                      minHeight: avatarSize,
                      maxWidth: avatarSize,
                      maxHeight: avatarSize,
                      borderRadius: '50%',
                      overflow: 'hidden',
                      flex: '0 0 auto',
                      flexShrink: 0,
                      border: '1px solid rgba(0,0,0,0.15)',
                      boxSizing: 'border-box',
                      display: 'flex',
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
                  top: showAvatars ? -2 : -3,
                  right: showAvatars ? -2 : -3,
                  width: showAvatars ? 12 : 14,
                  height: showAvatars ? 12 : 14,
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
                  boxShadow: showAvatars ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
                },
              }}
            >
              <span
                style={{
                  fontSize: showAvatars ? 9 : 10,
                  lineHeight: 1,
                  fontWeight: 600,
                }}
              >
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
    </div>
  );
};

export default memo(MultipleSelect);
