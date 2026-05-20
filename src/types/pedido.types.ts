import type { FocacciaPedido } from './focaccia.types';
import type { ComboPedido } from './combo.types';

export type PedidoStatus =
    | 'PENDIENTE'
    | 'CONFIRMADO'
    | 'EN_PREPARACION'
    | 'LISTO'
    | 'ENTREGADO'
    | 'CANCELADO';

export type ApiResponse<T> = {
    data: T;
    success: boolean;
    message?: string;
};

export type PedidoFocacciaResponse = {
    focacciaId: number | null;
    name: string;
    description: string;
    mediumPrice: number;
    largePrice: number;
    price: number;
    size: 'MEDIANA' | 'GRANDE';
    unitPrice: number;
    lineSubtotal: number;
    lineDiscount: number;
    lineTotal: number;
    isVeggie?: boolean;
    imageUrl: string;
    imagePublicId: string;
    featured?: boolean;
    cantidad: number;
};

export type Pedido = {
    id: number;
    orderNumber: string;
    clientPhone: string;
    status: PedidoStatus;
    pedidoFocaccias: PedidoFocacciaResponse[];
    focaccias?: FocacciaPedido[];
    combos?: ComboPedido[];
    quantity: number;
    subtotal: number;
    discountTotal: number;
    totalPrice: number;
    notes?: string;
    orderDate: string;
    createdAt?: string;
    updatedAt?: string;
    deliveredAt?: string | null;
};

export type PedidoRequest = {
    clientPhone: string;
    focaccias: Array<{
        focacciaId: number;
        cantidad: number;
        size?: 'MEDIANA' | 'GRANDE';
        sabores?: string[];
    }>;
    combos?: Array<{
        comboId: number;
        cantidad: number;
        focaccias: Array<{
            focacciaId: number;
            size: 'GRANDE';
            sabores?: string[];
        }>;
        prepizzas?: Array<{
            label?: string;
            cantidad: number;
        }>;
        extras?: Array<{
            label?: string;
            cantidad: number;
        }>;
    }>;
    promoCode?: string;
};
