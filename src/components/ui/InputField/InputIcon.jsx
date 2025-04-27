import { XCircle } from '../../../theme/icons'; // icono por defecto si no pasamos otro

const InputIcon = ({ icon, onClick, isClearable, clearableIcon }) => {
  if (!icon && !isClearable) return null;

  return (
    <button
      type="button"
      className="input-field__icon"
      onClick={onClick}
    >
      {isClearable
        ? (clearableIcon || <XCircle size={20} />)
        : icon}
    </button>
  );
};

export default InputIcon;
