import { ReactNode, CSSProperties, MouseEvent, KeyboardEvent, FocusEvent } from 'react';

export interface TypographyProps {
  /** The content to be displayed */
  children?: ReactNode;
  
  /** Additional CSS class names */
  className?: string;
  
  /** HTML element to render */
  element?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div' | 'label' | 'strong' | 'em' | 'small' | 'mark' | 'del' | 'ins' | 'sub' | 'sup';
  
  /** Typography style variant */
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2' | 'caption' | 'overline' | 'subtitle1' | 'subtitle2' | 'button' | 'inherit';
  
  /** Text color theme */
  color?: 'primary' | 'secondary' | 'textPrimary' | 'textSecondary' | 'error' | 'warning' | 'info' | 'success' | 'inherit';
  
  /** Text alignment */
  align?: 'left' | 'center' | 'right' | 'justify' | 'inherit';
  
  /** CSS display property */
  display?: 'initial' | 'block' | 'inline' | 'inline-block' | 'none';
  
  /** Add bottom margin (8px) */
  gutterBottom?: boolean;
  
  /** Prevent text wrapping with ellipsis */
  noWrap?: boolean;
  
  /** Apply paragraph spacing (16px bottom margin) */
  paragraph?: boolean;
  
  /** Click event handler */
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  
  /** Mouse enter event handler */
  onMouseEnter?: (event: MouseEvent<HTMLElement>) => void;
  
  /** Mouse leave event handler */
  onMouseLeave?: (event: MouseEvent<HTMLElement>) => void;
  
  /** Focus event handler */
  onFocus?: (event: FocusEvent<HTMLElement>) => void;
  
  /** Blur event handler */
  onBlur?: (event: FocusEvent<HTMLElement>) => void;
  
  /** Test ID for testing frameworks */
  'data-testid'?: string;
  
  /** HTML id attribute */
  id?: string;
  
  /** ARIA role attribute */
  role?: string;
  
  /** ARIA label for accessibility */
  'aria-label'?: string;
  
  /** ARIA described by reference */
  'aria-describedby'?: string;
  
  /** Tab index for keyboard navigation */
  tabIndex?: number;
  
  /** Inline styles object */
  style?: CSSProperties;
  
  /** HTML title attribute for tooltips */
  title?: string;
  
  /** Make text editable */
  contentEditable?: boolean;
  
  /** Input event handler for editable content */
  onInput?: (event: Event) => void;
  
  /** Key down event handler */
  onKeyDown?: (event: KeyboardEvent<HTMLElement>) => void;
  
  /** Key up event handler */
  onKeyUp?: (event: KeyboardEvent<HTMLElement>) => void;
  
  /** Key press event handler */
  onKeyPress?: (event: KeyboardEvent<HTMLElement>) => void;
}

declare const Typography: React.ForwardRefExoticComponent<TypographyProps & React.RefAttributes<HTMLElement>>;

export default Typography;
