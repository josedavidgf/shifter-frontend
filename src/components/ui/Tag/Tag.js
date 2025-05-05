import React from 'react';
import clsx from 'clsx';

const Tag = ({
  label,
  size = 'sm',
  color = 'gray',
  iconLeft: IconLeft,
  iconRight: IconRight,
}) => {
  return (
    <div className={clsx('tag', `tag--${size}`, `tag--${color}`)}>
      {IconLeft && (
        <span className="tag__icon tag__icon--left">
          <IconLeft size={12} />
        </span>
      )}
      <span className="tag__label">{label}</span>
      {IconRight && (
        <span className="tag__icon tag__icon--right">
          <IconRight size={12} />
        </span>
      )}
    </div>
  );
};

export default Tag;
