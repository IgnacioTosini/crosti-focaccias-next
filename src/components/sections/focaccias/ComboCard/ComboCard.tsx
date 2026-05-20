import { CustomButton } from '@/components/shared/CustomButton/CustomButton';
import { useCartStore } from '@/store/cart.store';
import type { ComboItem, ComboPedido } from '@/types';
import { handleWhatsAppClick } from '@/utils';
import './_comboCard.scss';

type ComboType = 'focaccias' | 'prepizzas' | 'combos';

interface Props {
    id: number;
    people: number;
    title: string;
    description: string;
    price: number;
    type: ComboType;
    items: ComboItem[];
}

export const ComboCard = ({ id, people, title, description, price, type, items }: Props) => {
    const addCombo = useCartStore(state => state.addCombo);
    const isPrepizzas = type === 'prepizzas';
    const isDegustacion = type === 'focaccias';

    const icon = type === 'focaccias' ? '⭐' : type === 'prepizzas' ? '🍕' : '👥';
    const badgeText = isPrepizzas
        ? 'PREPIZZAS'
        : isDegustacion
            ? 'DEGUSTACION'
            : `${people} PERSONAS`;
    const detailLines = isPrepizzas
        ? description.split('|').map((line) => line.trim()).filter(Boolean)
        : [description];

    const displayItems = !isPrepizzas
        ? items.filter((item) => item.label)
        : [];

    const handleAddToCart = () => {
        if (isPrepizzas) {
            handleWhatsAppClick();
            return;
        }

        const comboFocacciaSlots = items
            .filter((item) => item.itemType === 'focaccia')
            .flatMap((item) =>
                Array.from({ length: item.quantity }, () => ({
                    focaccia: {
                        id: 0,
                        name: '',
                        description: '',
                        mediumPrice: 0,
                        largePrice: 0,
                        imageUrl: '',
                        imagePublicId: '',
                        isAvailable: true,
                    },
                    size: item.size ?? 'MEDIANA',
                    cantidad: 1,
                    unitPrice: 0,
                    subtotal: 0,
                    sabores: [],
                }))
            );

        const comboPedido: ComboPedido = {
            combo: {
                id,
                name: title,
                description,
                mediumPrice: price,
                largePrice: price,
                imageUrl: '',
                imagePublicId: '',
                featured: false,
                isVeggie: false,
                isAvailable: true,
                people,
                comboType: type,
                comboItems: items,
            },
            cantidad: 1,
            unitPrice: price,
            subtotal: price,
            focaccias: comboFocacciaSlots,
            prepizzas: items.filter((item) => item.itemType === 'prepizza'),
            extras: items.filter((item) => item.itemType === 'extra'),
        };

        addCombo(comboPedido);
    };

    return (
        <article className={`comboCard ${isDegustacion ? 'comboCardDegustacion' : ''} ${isPrepizzas ? 'comboCardPrepizzas' : ''}`}>
            <div className='comboCardBody'>
                <h3 className='comboTitle'>{icon} {badgeText}</h3>
                <h4 className='comboSubtitle'>{title}</h4>
                <div className='comboDescription'>
                    {detailLines.map((line) => (
                        <p key={line}>{isPrepizzas ? `• ${line}` : line}</p>
                    ))}
                </div>

                {displayItems.length > 0 && (
                    <ul className='comboItemsList'>
                        {displayItems.map((item, i) => (
                            <li key={i}>
                                <span className='comboItemQty'>{item.quantity}x</span>
                                {item.label}
                                {item.size && <span className='comboItemSize'>{item.size === 'GRANDE' ? ' G' : ' M'}</span>}
                            </li>
                        ))}
                    </ul>
                )}

                <CustomButton
                    selectedPrice={price}
                    onAddToCart={handleAddToCart}
                    buttonLabel={isPrepizzas ? 'Consultar' : undefined}
                    showCartIcon={!isPrepizzas}
                    buttonVariant={isPrepizzas ? 'consult' : 'default'}
                />
            </div>
        </article>
    )
}
