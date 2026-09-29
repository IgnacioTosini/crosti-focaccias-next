import type { Pedido, PedidoStatus } from '../types/pedido.types';

export const BUSINESS_TIME_ZONE = 'America/Argentina/Buenos_Aires';

export const orderStatusLabels: Record<PedidoStatus, string> = {
    PENDIENTE: 'Pendiente',
    CONFIRMADO: 'Confirmado',
    EN_PREPARACION: 'En preparación',
    LISTO: 'Listo',
    ENTREGADO: 'Entregado',
    CANCELADO: 'Cancelado',
};

export const activeOrderStatuses: PedidoStatus[] = ['PENDIENTE', 'CONFIRMADO', 'EN_PREPARACION', 'LISTO'];
export const orderFilterLabels: Record<string, string> = {
    ALL: 'Todos',
    ACTIVOS: 'Activos',
    EN_CURSO: 'En preparación / listos',
    NO_CANCELADOS: 'Sin cancelados',
    ...orderStatusLabels,
};

export function businessDateKey(date: Date): string {
    const parts = new Intl.DateTimeFormat('en-CA', {
        timeZone: BUSINESS_TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit',
    }).formatToParts(date);
    const part = (type: string) => parts.find((item) => item.type === type)?.value;
    return `${part('year')}-${part('month')}-${part('day')}`;
}

export function businessDateRange(day: string) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return null;
    // Argentina opera en UTC-3; el servidor puede estar en otra zona horaria.
    const start = new Date(`${day}T00:00:00-03:00`);
    if (Number.isNaN(start.getTime()) || businessDateKey(start) !== day) return null;
    return { start, end: new Date(start.getTime() + 86_400_000) };
}

export type OrderFilters = { status: string; date: string; orderId: number | null };

export function parseOrderFilters(params: { estado?: string; fecha?: string; pedido?: string }): OrderFilters {
    const orderId = Number(params.pedido);
    return {
        status: params.estado && Object.hasOwn(orderFilterLabels, params.estado) ? params.estado : 'ALL',
        date: params.fecha && businessDateRange(params.fecha) ? params.fecha : '',
        orderId: Number.isSafeInteger(orderId) && orderId > 0 ? orderId : null,
    };
}

export function matchesOrderFilters(order: Pick<Pedido, 'id' | 'status' | 'orderDate'>, filters: OrderFilters) {
    if (filters.orderId !== null && order.id !== filters.orderId) return false;
    if (filters.date && businessDateKey(new Date(order.orderDate)) !== filters.date) return false;
    switch (filters.status) {
        case 'ALL': return true;
        case 'ACTIVOS': return activeOrderStatuses.includes(order.status);
        case 'EN_CURSO': return order.status === 'EN_PREPARACION' || order.status === 'LISTO';
        case 'NO_CANCELADOS': return order.status !== 'CANCELADO';
        default: return order.status === filters.status;
    }
}

export type AdminDashboardSummary = {
    day: string;
    generatedAt: string;
    today: { orders: number; amount: number };
    queue: { pending: number; preparing: number; ready: number; active: number };
    catalog: { available: number; total: number; promotions: number };
    recentOrders: Array<Pick<Pedido, 'id' | 'orderNumber' | 'status' | 'totalPrice' | 'orderDate'>>;
};
