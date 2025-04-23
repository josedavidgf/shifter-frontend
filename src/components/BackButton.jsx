import { useNavigate } from 'react-router-dom';

const BackButton = ({ fallbackPath = '/calendar', label = '⬅ Volver' }) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(fallbackPath);
    }
  };

  return (
    <button
      onClick={handleGoBack}
      className="btn btn-secondary" // usa tu estilo actual de botones secundarios
    >
      {label}
    </button>
  );
};

export default BackButton;
