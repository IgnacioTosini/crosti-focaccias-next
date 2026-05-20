'use client';

import { useState, useEffect, useRef } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import { BiTrash } from 'react-icons/bi';
import { toast } from 'react-toastify';
import { z } from 'zod';
import { createPedidoSchema } from '@/schemas/pedidoSchema';
import { animateAsideOrderSummaryOpen, animateAsideOrderSummaryClose } from '@/animations';
import { useCreatePedido } from '@/hooks/usePedidos';
import { useFocaccias } from '@/hooks/focaccia/useFocaccias';
import { useCartStore } from '@/store/cart.store';
import { validatePhoneNumber } from './helpers';
import { generateOrderMessage } from './orderMessageHelper';
import OrderItemList from './OrderItemList';
import { PhoneAndSend } from './PhoneAndSend';
import './_asideOrderSummary.scss';

export const AsideOrderSummary = () => {
    const { focaccias, combos, quantity, totalPrice, clearCart, setIsOrderOpen, setComboFlavorSelection } = useCartStore();
    const { data: availableFocacciasData } = useFocaccias();
    const availableFocaccias = (availableFocacciasData ?? []).filter((item) => item.isAvailable);
    const preOrder = {
        focaccias,
        combos,
        quantity,
        totalPrice,
    };
    const hasItems = preOrder.focaccias.length > 0 || preOrder.combos.length > 0;

    const createPedido = useCreatePedido();
    const [clientPhone, setClientPhone] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [isClosing, setIsClosing] = useState(false);
    const [isSendingOrder, setIsSendingOrder] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (panelRef.current && overlayRef.current) {
            animateAsideOrderSummaryOpen(panelRef.current, overlayRef.current);
        }
    }, []);

    const handleClose = () => {
        if (isClosing || !panelRef.current || !overlayRef.current) return;

        setIsClosing(true);
        animateAsideOrderSummaryClose(panelRef.current, overlayRef.current, () => {
            setIsOrderOpen(false);
            setIsClosing(false);
        });
    };

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    const handleMenuClick = () => {
        handleClose();
        setTimeout(() => {
            window.location.href = "#menu";
        }, 400);
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setClientPhone(value.replace(/\D/g, ''));
        setPhoneError(validatePhoneNumber(value));
    };

    // Modularizado: usar helper para generar el mensaje de pedido
    const getOrderMessage = () =>
        generateOrderMessage({
            focaccias: preOrder.focaccias,
            combos: preOrder.combos,
            totalPrice: preOrder.totalPrice,
            clientPhone,
        });

    const handleSelectComboFlavor = (comboId: number, slotIndex: number, selectedFocacciaId: number) => {
        const selectedFocaccia = availableFocaccias.find((item) => item.id === selectedFocacciaId);
        if (!selectedFocaccia) {
            return;
        }

        setComboFlavorSelection(comboId, slotIndex, {
            id: selectedFocaccia.id,
            name: selectedFocaccia.name,
            description: selectedFocaccia.description,
            mediumPrice: selectedFocaccia.mediumPrice,
            largePrice: selectedFocaccia.largePrice,
            isVeggie: selectedFocaccia.isVeggie,
            imageUrl: selectedFocaccia.imageUrl,
            imagePublicId: selectedFocaccia.imagePublicId,
            featured: selectedFocaccia.featured,
            isAvailable: selectedFocaccia.isAvailable,
        });
    };

    const handleSendWhatsApp = async () => {
        // Prevenir múltiples clicks
        if (isSendingOrder) return;

        setIsSendingOrder(true);

        const missingComboFlavors = preOrder.combos.some((combo) =>
            combo.focaccias.some((slot) => !Number.isInteger(slot.focaccia.id) || slot.focaccia.id <= 0)
        );

        if (missingComboFlavors) {
            toast.error('Completá los sabores de cada focaccia en los combos antes de enviar.');
            setIsSendingOrder(false);
            return;
        }

        const orderLines = new Map<string, { focacciaId: number; cantidad: number; size: 'MEDIANA' | 'GRANDE' }>();

        preOrder.focaccias.forEach((item) => {
            const normalizedSize = item.size === 'GRANDE' ? 'GRANDE' : 'MEDIANA';
            const key = `${item.focaccia.id}_${normalizedSize}`;
            const existing = orderLines.get(key);

            if (existing) {
                existing.cantidad += item.cantidad;
            } else {
                orderLines.set(key, {
                    focacciaId: item.focaccia.id,
                    cantidad: item.cantidad,
                    size: normalizedSize,
                });
            }
        });

        preOrder.combos.forEach((combo) => {
            combo.focaccias.forEach((slot) => {
                if (!Number.isInteger(slot.focaccia.id) || slot.focaccia.id <= 0) {
                    return;
                }

                const slotSize = slot.size === 'GRANDE' ? 'GRANDE' : 'MEDIANA';
                const key = `${slot.focaccia.id}_${slotSize}`;
                const existing = orderLines.get(key);

                if (existing) {
                    existing.cantidad += 1;
                } else {
                    orderLines.set(key, {
                        focacciaId: slot.focaccia.id,
                        cantidad: 1,
                        size: slotSize,
                    });
                }
            });
        });

        // Preparar datos del pedido
        const pedidoData = {
            clientPhone: clientPhone,
            focaccias: [...orderLines.values()]
        };

        try {
            if (pedidoData.focaccias.length > 0) {
                // Validar con Zod antes de enviar
                const validatedData = createPedidoSchema.parse(pedidoData);

                // Guardar el pedido en BD
                await createPedido.mutateAsync(validatedData);
            }

            const message = getOrderMessage();
            const businessWhatsApp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '';

            // Abrir WhatsApp del negocio con el mensaje del cliente
            const whatsappUrl = `https://wa.me/${businessWhatsApp}?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');

            toast.success('Pedido guardado exitosamente. ¡Serás redirigido a WhatsApp!');
            setClientPhone('');
            setPhoneError('');
            handleClose();
        } catch (error) {
            if (error instanceof z.ZodError) {
                // Error de validación de Zod
                const firstError = error.issues[0];
                if (firstError.path.includes('clientPhone')) {
                    setPhoneError(firstError.message);
                } else {
                    toast.error(firstError.message);
                }
            } else {
                // Error del servidor
                toast.error('Error al guardar el pedido');
                console.error(error);
            }
            setIsSendingOrder(false);
        }
    };

    return (
        <div className='asideOrderSummaryOverlay' ref={overlayRef} onClick={handleOverlayClick}>
            <div className='asideOrderSummary' ref={panelRef}>
                <div className='asideOrderSummaryHeader'>
                    <div className='asideOrderSummaryTitle'>
                        <FaShoppingCart className='asideOrderSummaryIcon' /> <p className='asideOrderSummaryText'>Tu pedido {<span className='asideOrderSummaryNumber'>{preOrder.quantity}</span>}</p>
                    </div>
                    <IoClose onClick={handleClose} className='asideOrderSummaryCloseButton' />
                </div>

                <div className='asideOrderSummaryContent'>
                    {!hasItems ? (
                        <div className='emptyCartMessage'>
                            <FaShoppingCart className='emptyCartIcon' />
                            <p>No hay items en el pedido.</p>
                            <span>Agrega algunos productos para continuar.</span>
                            <button className='emptyCartButton' onClick={handleMenuClick}>Ver menú</button>
                        </div>
                    ) : (
                        <>
                            <OrderItemList
                                items={preOrder.focaccias}
                                combos={preOrder.combos}
                                availableFocaccias={availableFocaccias}
                                onSelectComboFlavor={handleSelectComboFlavor}
                            />
                            <button className='asideOrderSummaryButton delete' onClick={() => clearCart()}><BiTrash /> Vaciar pedido</button>
                        </>
                    )}
                </div>

                {hasItems && (
                    <div className='asideOrderSummaryFooter'>
                        <p className='asideOrderSummaryTotal'>Total: ${preOrder.totalPrice.toFixed(2)}</p>
                        <PhoneAndSend
                            clientPhone={clientPhone}
                            phoneError={phoneError}
                            isSendingOrder={isSendingOrder}
                            handlePhoneChange={handlePhoneChange}
                            handleSendWhatsApp={handleSendWhatsApp}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
