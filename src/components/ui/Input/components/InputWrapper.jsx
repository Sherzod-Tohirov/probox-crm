import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import Typography from '../../Typography';
import { Box, Col, Row } from '@components/ui';
import iconsMap from '@utils/iconsMap';
import styles from '../input.module.scss';
import SearchField from './SearchField';

const InputWrapper = ({
  children,
  label,
  disabled,
  dimOnDisabled,
  variant,
  type,
  size,
  inputBoxStyle,
  inputBoxClassName,
  // hasIcon,
  showIcon,
  icon,
  iconText,
  canClickIcon,
  onIconClick,
  error,
  searchable,
  searchText,
  renderSearchItem,
  onSearch,
  onSearchSelect,
  disableAutoOpenSearch = false, // Default qiymat uchun SearchField ochilmasligi
}) => {
  const inputBoxRef = useRef(null);
  const [isSearchFieldOpen, setIsSearchFieldOpen] = useState(false);
  const justSelectedRef = useRef(false);
  const userInteractedRef = useRef(false); // Foydalanuvchi yozganini kuzatish

  // searchText o'zgarganda SearchField ni qayta ochish
  useEffect(() => {
    // Agar element tanlandi, ochilmasin
    if (justSelectedRef.current) {
      justSelectedRef.current = false;
      return;
    }

    // Agar disableAutoOpenSearch true bo'lsa va foydalanuvchi yozmagan bo'lsa, ochilmasin
    if (disableAutoOpenSearch && !userInteractedRef.current) {
      return;
    }

    if (searchText?.length > 0) {
      setIsSearchFieldOpen(true);
    }
  }, [searchText, disableAutoOpenSearch]);

  return (
    <Row className={styles['input-wrapper']} gutter={1.5}>
      {label && (
        <Col>
          <Typography
            element="label"
            className={classNames(styles['label'], {
              [styles['label-disabled']]: disabled && dimOnDisabled,
            })}
          >
            {label}
          </Typography>
        </Col>
      )}
      <Col fullWidth>
        <Box pos="relative" dir="column" gap={1}>
          <Box
            ref={inputBoxRef}
            pos="relative"
            style={inputBoxStyle}
            className={classNames(
              styles['input-box'],
              styles[variant],
              styles[type],
              styles[size],
              inputBoxClassName
            )}
            onInput={() => {
              // Foydalanuvchi yozganda belgilash
              if (searchable && disableAutoOpenSearch) {
                userInteractedRef.current = true;
              }
            }}
          >
            {children}
            {showIcon ? (
              <Typography
                style={{
                  cursor: onIconClick ? 'pointer' : 'default',
                  pointerEvents: canClickIcon ? 'auto' : 'none',
                }}
                element="span"
                className={styles['icon']}
                {...(onIconClick ? { onClick: onIconClick } : {})}
                disabled={disabled}
              >
                {iconText || iconsMap[icon]}
              </Typography>
            ) : (
              ''
            )}
          </Box>
          <AnimatePresence mode="popLayout">
            {searchable &&
            searchText?.length > 0 &&
            !(type === 'tel' && searchText === '998') &&
            isSearchFieldOpen ? (
              <SearchField
                renderItem={renderSearchItem}
                onSearch={onSearch}
                searchText={searchText}
                onSelect={(item) => {
                  justSelectedRef.current = true;
                  setIsSearchFieldOpen(false);
                  return onSearchSelect(item);
                }}
                inputRef={inputBoxRef}
              />
            ) : null}
          </AnimatePresence>
          <AnimatePresence mode="popLayout">
            {error ? (
              <motion.span
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className={styles['error-text']}
              >
                {error}
              </motion.span>
            ) : (
              ''
            )}
          </AnimatePresence>
        </Box>
      </Col>
    </Row>
  );
};

export default InputWrapper;
