'use client';

import { toast, type ToastContentProps, type ToastOptions } from 'react-toastify';
import { useCartStore } from '@/store/cart.store';
import './_cartToast.scss';

const CART_TOAST_ID = 'cart-added';

export function notifyCartAddition(name: string, detail?: string) {
    const content = ({ closeToast }: ToastContentProps) => (
        <div className='cart-toast__content'>
            <strong className='cart-toast__title'>Agregado al carrito</strong>
            <p className='cart-toast__product'>{name}</p>
            {detail && <p className='cart-toast__detail'>{detail}</p>}
            <button
                type='button'
                className='cart-toast__action'
                onClick={() => {
                    closeToast();
                    useCartStore.getState().setIsOrderOpen(true);
                }}
            >
                Ver carrito <span aria-hidden='true'>→</span>
            </button>
        </div>
    );
    const options: ToastOptions = {
        toastId: CART_TOAST_ID,
        className: 'cart-toast',
        position: 'bottom-right',
        autoClose: 3500,
        closeOnClick: false,
        pauseOnHover: true,
        role: 'status',
        ariaLabel: `Agregado al carrito: ${name}${detail ? `. ${detail}` : ''}`,
    };

    // Reutiliza el aviso para que agregar varios productos no tape el menú.
    if (toast.isActive(CART_TOAST_ID)) {
        toast.update(CART_TOAST_ID, { ...options, render: content });
    } else {
        toast.success(content, options);
    }
}
