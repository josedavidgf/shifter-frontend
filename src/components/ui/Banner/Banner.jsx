// src/components/ui/Banner/Banner.jsx
import { X, Info, CheckCircle, WarningCircle } from 'phosphor-react';

function Banner({ type = 'info', children, onClose }) {
  const renderIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} weight="fill" />;
      case 'danger':
        return <WarningCircle size={20} weight="fill" />;
      case 'info':
      default:
        return <Info size={20} weight="fill" />;
    }
  };

  return (
    <div className={`banner banner--${type}`}>
      <div className="banner__icon">{renderIcon()}</div>
      <div className="banner__content">{children}</div>
      {onClose && (
        <button className="banner__close" onClick={onClose}>
          <X size={16} />
        </button>
      )}
    </div>
  );
}

export default Banner;
