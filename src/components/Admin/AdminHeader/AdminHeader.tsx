import { FaPlus } from 'react-icons/fa';
import './_adminHeader.scss';

interface Props {
  onToggleForm: () => void;
  onNewFocaccia: () => void;
}

export const AdminHeader = ({ onNewFocaccia }: Props) => {
  const handleBackToSite = () => {
    window.location.href = '/';
  };

  return (
    <header className="adminHeader">
      <button
        className="adminHeaderButton"
        onClick={handleBackToSite}
      >
        Volver al sitio
      </button>

      <h1 className='adminHeaderTitle'>
        Panel de Administración - Focaccias
      </h1>

      <button
        className='adminHeaderButton'
        onClick={onNewFocaccia}
      >
        <FaPlus />
        <span>Nueva Focaccia</span>
      </button>
    </header>
  );
};
