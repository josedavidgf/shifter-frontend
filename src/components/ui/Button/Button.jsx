import React from 'react';

const Button = ({
  label,
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  disabled = false,
  onClick,
  type = 'button',
  isLoading = false,
}) => {
  const classes = [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    (disabled || isLoading) ? 'btn--disabled' : '',
  ].join(' ');

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || isLoading}
      onClick={onClick}
    >
      <div className="btn__content" style={{ opacity: isLoading ? 0 : 1 }}>
        {leftIcon && <span className="btn__icon btn__icon--left">{leftIcon}</span>}
        <span className="btn__label">{label}</span>
        {rightIcon && <span className="btn__icon btn__icon--right">{rightIcon}</span>}
      </div>

      {isLoading && (
        <span className="btn__spinner"></span>
      )}
    </button>
  );
};
export default Button;
