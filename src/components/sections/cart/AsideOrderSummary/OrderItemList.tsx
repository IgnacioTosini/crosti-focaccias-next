
import ItemCardInOrder from '../ItemCardInOrder/ItemCardInOrder';
import { TbTrash } from 'react-icons/tb';
import type { ComboPedido, FocacciaItem, FocacciaPedido } from '@/types';
import { useCartStore } from '@/store/cart.store';

type OrderItemListProps = {
    items: FocacciaPedido[];
    combos?: ComboPedido[];
    availableFocaccias?: FocacciaItem[];
    onSelectComboFlavor?: (comboId: number, slotIndex: number, selectedFocacciaId: number) => void;
};

const OrderItemList = ({
    items,
    combos = [],
    availableFocaccias = [],
    onSelectComboFlavor,
}: OrderItemListProps) => {
    const removeCombo = useCartStore((state) => state.removeCombo);
    const increaseComboQuantity = useCartStore((state) => state.increaseComboQuantity);
    const decreaseComboQuantity = useCartStore((state) => state.decreaseComboQuantity);

    return (
        <ul className='asideOrderSummaryList'>
            {items.map((item, index) => (
                <ItemCardInOrder key={index} item={item} index={index} />
            ))}

            {combos.map((combo) => (
                <li key={`combo-${combo.combo.id}`} className='itemCardInOrder'>
                    <div className='itemDetails'>
                        <div className='itemNameRow'>
                            <p className='itemName'>{combo.combo.name}</p>
                        </div>
                        <p className='itemDescription'>{combo.combo.description}</p>
                        <span className='itemSizeBadge'>✨ <span>Combo</span></span>

                        {combo.focaccias.length > 0 && (
                            <div className='flavorSelectionContainer'>
                                <p className='flavorSelectionTitle'>Elegí sabores para el combo</p>
                                {combo.focaccias.map((slot, slotIndex) => (
                                    <select
                                        key={`combo-${combo.combo.id}-slot-${slotIndex}`}
                                        className='flavorSelectStyled'
                                        value={slot.focaccia.id > 0 ? String(slot.focaccia.id) : ''}
                                        onChange={(event) => {
                                            const selectedId = Number(event.target.value);
                                            if (!Number.isInteger(selectedId) || selectedId <= 0 || !onSelectComboFlavor) {
                                                return;
                                            }
                                            onSelectComboFlavor(combo.combo.id, slotIndex, selectedId);
                                        }}
                                    >
                                        <option value=''>Seleccionar sabor #{slotIndex + 1}</option>
                                        {availableFocaccias.map((focaccia) => (
                                            <option key={focaccia.id} value={focaccia.id}>
                                                {focaccia.name}
                                            </option>
                                        ))}
                                    </select>
                                ))}
                            </div>
                        )}

                        {combo.prepizzas && combo.prepizzas.length > 0 && (
                            <div className='comboIncludedItems'>
                                <p className='comboIncludedTitle'>🍕 Prepizzas incluidas</p>
                                <ul className='comboIncludedList'>
                                    {combo.prepizzas.map((p, i) => (
                                        <li key={i}>{p.quantity} x {p.label ?? 'Prepizza'}{p.size ? ` (${p.size === 'GRANDE' ? 'Grande' : 'Mediana'})` : ''}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {combo.extras && combo.extras.length > 0 && (
                            <div className='comboIncludedItems'>
                                <p className='comboIncludedTitle'>➕ Extras incluidos</p>
                                <ul className='comboIncludedList'>
                                    {combo.extras.map((e, i) => (
                                        <li key={i}>{e.quantity} x {e.label ?? 'Extra'}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                    <div className='itemPrice'>
                        <p>$ {(combo.unitPrice * combo.cantidad).toFixed(0)}</p>
                    </div>
                    <div className='itemQuantityContainer'>
                        <div className='itemQuantity'>
                            <button
                                type='button'
                                className='itemQuantityButton'
                                onClick={() => decreaseComboQuantity(combo.combo.id)}
                                aria-label='Restar cantidad de combo'
                            >
                                -
                            </button>
                            <span className='itemQuantityValue'>{combo.cantidad}</span>
                            <button
                                type='button'
                                className='itemQuantityButton'
                                onClick={() => increaseComboQuantity(combo.combo.id)}
                                aria-label='Sumar cantidad de combo'
                            >
                                +
                            </button>
                        </div>
                        <p className='itemQuantityPrice'>{combo.cantidad} x ${combo.unitPrice.toFixed(0)}</p>
                    </div>

                    <button
                        type='button'
                        className='itemDeleteIcon'
                        onClick={() => removeCombo(combo.combo.id)}
                        aria-label={`Eliminar ${combo.combo.name} del carrito`}
                    >
                        <TbTrash />
                    </button>
                </li>
            ))}
        </ul>
    );
};

export default OrderItemList;
