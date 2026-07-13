import { FaPlus } from 'react-icons/fa';
import './_adminHeader.scss';

interface Props {
  onToggleForm: () => void;
  onNewFocaccia: () => void;
}

export const AdminHeader = ({ onNewFocaccia }: Props) => {
  return (
    <header className="adminHeader">
      <div className='adminHeaderCopy'>
        <span>Catálogo</span>
        <h1 className='adminHeaderTitle'>
          Focaccias
        </h1>
      </div>

      <button className='adminHeaderAction' onClick={onNewFocaccia}>
        <FaPlus />
        <span>Nueva Focaccia</span>
      </button>
    </header>
  );
};
