import classNames from 'classnames';
import { memo, forwardRef } from 'react';
import PropTypes from 'prop-types';
import styles from './typography.module.scss';

/**
 * @typedef {Object} TypographyProps
 * @property {React.ReactNode} [children] - The content to be displayed
 * @property {string} [className] - Additional CSS class names
 * @property {'h1'|'h2'|'h3'|'h4'|'h5'|'h6'|'p'|'span'|'div'|'label'|'strong'|'em'|'small'|'mark'|'del'|'ins'|'sub'|'sup'} [element='p'] - HTML element to render
 * @property {'h1'|'h2'|'h3'|'h4'|'h5'|'h6'|'body1'|'body2'|'caption'|'overline'|'subtitle1'|'subtitle2'|'button'|'inherit'} [variant] - Typography style variant
 * @property {'primary'|'secondary'|'textPrimary'|'textSecondary'|'error'|'warning'|'info'|'success'|'inherit'} [color] - Text color theme
 * @property {'left'|'center'|'right'|'justify'|'inherit'} [align] - Text alignment
 * @property {'initial'|'block'|'inline'|'inline-block'|'none'} [display] - CSS display property
 * @property {boolean} [gutterBottom=false] - Add bottom margin (8px)
 * @property {boolean} [noWrap=false] - Prevent text wrapping with ellipsis
 * @property {'normal'|'wrap'|'nowrap'|'break-word'} [wrap] - Text wrapping behavior
 * @property {boolean} [paragraph=false] - Apply paragraph spacing (16px bottom margin)
 * @property {Function} [onClick] - Click event handler
 * @property {Function} [onMouseEnter] - Mouse enter event handler
 * @property {Function} [onMouseLeave] - Mouse leave event handler
 * @property {Function} [onFocus] - Focus event handler
 * @property {Function} [onBlur] - Blur event handler
 * @property {string} [data-testid] - Test ID for testing frameworks
 * @property {string} [id] - HTML id attribute
 * @property {string} [role] - ARIA role attribute
 * @property {string} [aria-label] - ARIA label for accessibility
 * @property {string} [aria-describedby] - ARIA described by reference
 * @property {number} [tabIndex] - Tab index for keyboard navigation
 * @property {React.CSSProperties} [style] - Inline styles object
 * @property {string} [title] - HTML title attribute for tooltips
 * @property {boolean} [contentEditable] - Make text editable
 * @property {Function} [onInput] - Input event handler for editable content
 * @property {Function} [onKeyDown] - Key down event handler
 * @property {Function} [onKeyUp] - Key up event handler
 * @property {Function} [onKeyPress] - Key press event handler
 * @property {boolean} [disabled=false] - Apply disabled styling (reduced opacity)
 */

const typographyPropTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  element: PropTypes.oneOf([
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'p',
    'span',
    'div',
    'label',
    'strong',
    'time',
    'em',
    'small',
    'mark',
    'del',
    'ins',
    'sub',
    'sup',
  ]),
  variant: PropTypes.oneOf([
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'body1',
    'body2',
    'caption',
    'overline',
    'subtitle1',
    'subtitle2',
    'button',
    'inherit',
  ]),
  color: PropTypes.oneOf([
    'primary',
    'secondary',
    'textPrimary',
    'textSecondary',
    'error',
    'warning',
    'info',
    'success',
    'inherit',
  ]),
  align: PropTypes.oneOf(['left', 'center', 'right', 'justify', 'inherit']),
  display: PropTypes.oneOf([
    'initial',
    'block',
    'inline',
    'inline-block',
    'none',
  ]),
  gutterBottom: PropTypes.bool,
  noWrap: PropTypes.bool,
  wrap: PropTypes.oneOf(['normal', 'wrap', 'nowrap', 'break-word']),
  paragraph: PropTypes.bool,
  onClick: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  'data-testid': PropTypes.string,
  id: PropTypes.string,
  role: PropTypes.string,
  'aria-label': PropTypes.string,
  'aria-describedby': PropTypes.string,
  tabIndex: PropTypes.number,
  style: PropTypes.object,
  title: PropTypes.string,
  contentEditable: PropTypes.bool,
  onInput: PropTypes.func,
  onKeyDown: PropTypes.func,
  onKeyUp: PropTypes.func,
  onKeyPress: PropTypes.func,
  disabled: PropTypes.bool,
};

/**
 * Typography Component - Flexible text component with multiple variants and styling options
 *
 * @param {TypographyProps} props - Component props
 * @param {React.ReactNode} props.children - Text content or elements to display
 * @param {string} [props.className] - Additional CSS classes
 * @param {'h1'|'h2'|'h3'|'h4'|'h5'|'h6'|'p'|'span'|'div'|'label'|'strong'|'em'|'small'|'mark'|'del'|'ins'|'sub'|'sup'} [props.element='p'] - HTML element to render
 * @param {'h1'|'h2'|'h3'|'h4'|'h5'|'h6'|'body1'|'body2'|'caption'|'overline'|'subtitle1'|'subtitle2'|'button'|'inherit'} [props.variant] - Typography style variant
 * @param {'primary'|'secondary'|'textPrimary'|'textSecondary'|'error'|'warning'|'info'|'success'|'inherit'} [props.color] - Text color theme
 * @param {'left'|'center'|'right'|'justify'|'inherit'} [props.align] - Text alignment
 * @param {'initial'|'block'|'inline'|'inline-block'|'none'} [props.display] - CSS display property
 * @param {boolean} [props.gutterBottom=false] - Add bottom margin (8px)
 * @param {boolean} [props.noWrap=false] - Prevent text wrapping with ellipsis
 * @param {'normal'|'wrap'|'nowrap'|'break-word'} [props.wrap] - Text wrapping behavior
 * @param {boolean} [props.paragraph=false] - Apply paragraph spacing (16px bottom margin)
 * @param {Function} [props.onClick] - Click event handler
 * @param {Function} [props.onMouseEnter] - Mouse enter event handler
 * @param {Function} [props.onMouseLeave] - Mouse leave event handler
 * @param {Function} [props.onFocus] - Focus event handler
 * @param {Function} [props.onBlur] - Blur event handler
 * @param {string} [props.data-testid] - Test ID for testing frameworks
 * @param {string} [props.id] - HTML id attribute
 * @param {string} [props.role] - ARIA role attribute
 * @param {string} [props.aria-label] - ARIA label for accessibility
 * @param {string} [props.aria-describedby] - ARIA described by reference
 * @param {number} [props.tabIndex] - Tab index for keyboard navigation
 * @param {React.CSSProperties} [props.style] - Inline styles object
 * @param {string} [props.title] - HTML title attribute for tooltips
 * @param {boolean} [props.contentEditable] - Make text editable
 * @param {Function} [props.onInput] - Input event handler for editable content
 * @param {Function} [props.onKeyDown] - Key down event handler
 * @param {Function} [props.onKeyUp] - Key up event handler
 * @param {Function} [props.onKeyPress] - Key press event handler
 * @param {boolean} [props.disabled=false] - Apply disabled styling (reduced opacity)
 *
 * @example
 * // Basic heading
 * <Typography element="h1" variant="h1">
 *   Main Title
 * </Typography>
 *
 * @example
 * // Body text with color
 * <Typography variant="body1" color="textSecondary">
 *   This is body text with secondary color
 * </Typography>
 *
 * @example
 * // Clickable text with alignment
 * <Typography
 *   element="span"
 *   variant="button"
 *   align="center"
 *   onClick={handleClick}
 * >
 *   Click me
 * </Typography>
 *
 * @example
 * // Caption with no wrap
 * <Typography variant="caption" noWrap gutterBottom>
 *   This text will not wrap and has bottom margin
 * </Typography>
 */
const Typography = forwardRef(
  (
    {
      element: Element = 'p',
      className,
      children,
      variant,
      color,
      align,
      display,
      gutterBottom = false,
      noWrap = false,
      wrap,
      paragraph = false,
      disabled = false,
      ...props
    },
    ref
  ) => {
    return (
      <Element
        ref={ref}
        className={classNames(
          styles['base-typography'],
          styles[variant],
          styles[`color-${color}`],
          styles[`align-${align}`],
          styles[`display-${display}`],
          {
            [styles['gutter-bottom']]: gutterBottom,
            [styles['no-wrap']]: noWrap,
            [styles[`wrap-${wrap}`]]: wrap,
            [styles['paragraph']]: paragraph,
            [styles['disabled']]: disabled,
          },
          className
        )}
        style={{
          ...props.style,
          ...(disabled
            ? {
                opacity: 0.3,
                pointerEvents: 'none',
                cursor: 'not-allowed',
              }
            : {}),
        }}
        {...props}
      >
        {children}
      </Element>
    );
  }
);

const ForwardedTypography = memo(Typography);
ForwardedTypography.propTypes = typographyPropTypes;
ForwardedTypography.defaultProps = {
  element: 'p',
  variant: undefined,
  color: undefined,
  align: undefined,
  display: undefined,
  gutterBottom: false,
  noWrap: false,
  wrap: undefined,
  paragraph: false,
  disabled: false,
  contentEditable: false,
  tabIndex: undefined,
};

export default ForwardedTypography;
