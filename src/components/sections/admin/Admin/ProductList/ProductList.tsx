import { useState } from 'react';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import type { FocacciaItem } from '@/types';
import { AdminItemCard } from '../AdminItemCard/AdminItemCard';
import './_productList.scss';

interface Props {
    focaccias?: FocacciaItem[];
    onEdit: (item: FocacciaItem) => void;
}

export const ProductList = ({ focaccias = [], onEdit }: Props) => {
    const [open, setOpen] = useState(true);
    const total = focaccias.length;

    return (
        <div className='productListContainer'>
            <div className='productListHeader'>
                <div>
                    <span className='productListEyebrow'>Inventario</span>
                    <h2>Focaccias existentes</h2>
                </div>

                <div className='productListMeta'>
                    <span>{total} {total === 1 ? 'producto' : 'productos'}</span>
                    <button
                        className='productListToggle'
                        onClick={() => setOpen(o => !o)}
                        aria-label={open ? 'Ocultar lista de focaccias' : 'Mostrar lista de focaccias'}
                    >
                        {open ? <FaAngleUp /> : <FaAngleDown />}
                    </button>
                </div>
            </div>

            <ul className={`productListUl${open ? ' open' : ''}`}>
                {focaccias.length > 0 ? (
                    focaccias.map((focaccia) => (
                        <li key={focaccia.id}>
                            <AdminItemCard item={focaccia} onEdit={() => onEdit(focaccia)} />
                        </li>
                    ))
                ) : (
                    <li className='productListEmpty'>
                        Todavía no hay focaccias cargadas.
                    </li>
                )}
            </ul>
        </div>
    );
};
