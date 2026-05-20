import { BiCart } from "react-icons/bi"
import './_customButton.scss'

interface Props {
    selectedPrice: number;
    isAvailable?: boolean;
    onAddToCart: () => void;
    buttonLabel?: string;
    showCartIcon?: boolean;
    buttonVariant?: 'default' | 'consult';
    showPrice?: boolean;
}

export const CustomButton = ({
    selectedPrice,
    isAvailable = true,
    onAddToCart,
    buttonLabel,
    showCartIcon = true,
    buttonVariant = 'default',
    showPrice = true,
}: Props) => {
    const label = buttonLabel ?? (isAvailable ? 'Agregar' : 'No disponible');

    return (
        <div className='itemCardFooter'>
            {showPrice ? <p className='itemPrice'>{`$${Math.round(selectedPrice).toLocaleString('es-AR')}`}</p> : null}
            <button className={`addToCartButton ${buttonVariant === 'consult' ? 'consultButton' : ''}`} onClick={onAddToCart} disabled={!isAvailable}>
                {showCartIcon ? <BiCart /> : null} {label}
            </button>
        </div>
    )
}
