import { useState } from 'react';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import type { FocacciaItem } from '../../../types';
import { AdminItemCard } from '../AdminItemCard/AdminItemCard';
import './_productList.scss';

interface Props {
    focaccias?: FocacciaItem[];
    onEdit: (item: FocacciaItem) => void;
}

export const ProductList = ({ focaccias = [], onEdit }: Props) => {
    const [open, setOpen] = useState(true);

    return (
        <div className='productListContainer'>
            <div className='header'>
                <h1>Focaccias Existentes</h1>
                <button
                    className='downButton'
                    onClick={() => setOpen(o => !o)}
                    aria-label={open ? 'Ocultar lista de focaccias' : 'Mostrar lista de focaccias'}
                >
                    {open ? <FaAngleUp /> : <FaAngleDown />}
                </button>
            </div>

            <ul className={`productListUl${open ? ' open' : ''}`}>
                {focaccias.map((focaccia) => (
                    <li key={focaccia.id}>
                        <AdminItemCard item={focaccia} onEdit={() => onEdit(focaccia)} />
                    </li>
                ))}
            </ul>
        </div>
    );
};
