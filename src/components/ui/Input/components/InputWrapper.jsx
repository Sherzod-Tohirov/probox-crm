import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
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
  hasIcon,
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
}) => {
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
        <Box pos={'relative'} dir="column" gap={1}>
          <Box
            pos="relative"
            style={inputBoxStyle}
            className={classNames(
              styles['input-box'],
              styles[variant],
              styles[type],
              styles[size],
              inputBoxClassName
            )}
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
            !(type === 'tel' && searchText === '998') ? (
              <SearchField
                renderItem={renderSearchItem}
                onSearch={onSearch}
                searchText={searchText}
                onSelect={onSearchSelect}
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
