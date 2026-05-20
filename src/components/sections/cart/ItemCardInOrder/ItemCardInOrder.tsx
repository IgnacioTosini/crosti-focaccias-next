import { TbTrash } from 'react-icons/tb';
import type { FocacciaPedido } from '@/types';
import { useCartStore } from '@/store/cart.store';
import './_itemCardInOrder.scss';

type ItemCardInOrderProps = {
    item: FocacciaPedido;
    index: number;
};

const ItemCardInOrder = ({ item, index }: ItemCardInOrderProps) => {
    const removeFocaccia = useCartStore((state) => state.removeFocaccia);
    const increaseFocacciaQuantity = useCartStore((state) => state.increaseFocacciaQuantity);
    const decreaseFocacciaQuantity = useCartStore((state) => state.decreaseFocacciaQuantity);

    const handleRemove = () => {
        removeFocaccia(item.focaccia.id, item.size);
    };

    const handleIncrease = () => {
        increaseFocacciaQuantity(item.focaccia.id, item.size);
    };

    const handleDecrease = () => {
        decreaseFocacciaQuantity(item.focaccia.id, item.size);
    };

    return (
        <li key={index} className='itemCardInOrder'>
            <div className='itemDetails'>
                <div className='itemNameRow'>
                    <p className='itemName'>{item.focaccia.name}</p>
                </div>
                <p className='itemDescription'>{item.focaccia.description}</p>
                <span className='itemSizeBadge'>🍕 <span>{item.size === 'GRANDE' ? 'Grande' : 'Mediana'}</span></span>
                {item.sabores && item.sabores.length > 0 && (
                    <div className='flavorSelectionContainer'>
                        <p className='flavorSelectionTitle'>Sabores: {item.sabores.join(', ')}</p>
                    </div>
                )}
            </div>
            <div className='itemPrice'>
                <p>$ {(item.unitPrice * item.cantidad).toFixed(0)}</p>
            </div>
            <div className='itemQuantityContainer'>
                <div className='itemQuantity'>
                    <button type='button' className='itemQuantityButton' onClick={handleDecrease} aria-label='Restar cantidad'>-</button>
                    <span className='itemQuantityValue'>{item.cantidad}</span>
                    <button type='button' className='itemQuantityButton' onClick={handleIncrease} aria-label='Sumar cantidad'>+</button>
                </div>
                <p className='itemQuantityPrice'>{item.cantidad} x ${item.unitPrice.toFixed(0)}</p>
            </div>
            <button
                type='button'
                className='itemDeleteIcon'
                onClick={handleRemove}
                aria-label={`Eliminar ${item.focaccia.name} del carrito`}
            >
                <TbTrash />
            </button>
        </li>
    );
};

export default ItemCardInOrder;
