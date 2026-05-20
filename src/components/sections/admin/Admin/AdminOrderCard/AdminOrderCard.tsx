import type { ChangeEvent } from 'react';
import { BiTrash } from 'react-icons/bi';
import type { Pedido, PedidoStatus } from '@/types';
import { useDeletePedido, useUpdatePedidoStatus } from '@/hooks/usePedidos';
import './_adminOrderCard.scss';

type AdminOrderCardProps = {
    order: Pedido;
}

const currencyFormatter = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
});

const formatDate = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return '-';
    }

    return date.toLocaleString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const statusLabels: Record<string, string> = {
    PENDIENTE: 'Pendiente',
    CONFIRMADO: 'Confirmado',
    EN_PREPARACION: 'En preparacion',
    LISTO: 'Listo',
    ENTREGADO: 'Entregado',
    CANCELADO: 'Cancelado',
};

const statusOptions: PedidoStatus[] = [
    'PENDIENTE',
    'CONFIRMADO',
    'EN_PREPARACION',
    'LISTO',
    'ENTREGADO',
    'CANCELADO',
];

const allowedTransitions: Record<PedidoStatus, PedidoStatus[]> = {
    PENDIENTE: ['CONFIRMADO', 'CANCELADO'],
    CONFIRMADO: ['EN_PREPARACION', 'CANCELADO'],
    EN_PREPARACION: ['LISTO', 'CANCELADO'],
    LISTO: ['ENTREGADO', 'CANCELADO'],
    ENTREGADO: [],
    CANCELADO: ['PENDIENTE', 'CONFIRMADO', 'EN_PREPARACION', 'LISTO', 'ENTREGADO'],
};

const sizeLabels: Record<string, string> = {
    MEDIANA: 'Mediana',
    GRANDE: 'Grande',
};

const COMBOS_NOTES_PREFIX = 'COMBOS_JSON:';

type ComboSummary = {
    comboId: number;
    title: string;
    cantidad: number;
    unitPrice: number;
    subtotal: number;
    focaccias?: Array<{ label?: string; size?: 'MEDIANA' | 'GRANDE'; cantidad: number; sabores?: string[] }>;
    prepizzas?: Array<{ label?: string; cantidad: number }>;
    extras?: Array<{ label?: string; cantidad: number }>;
};

const parseComboSummary = (notes?: string): ComboSummary[] => {
    if (!notes || !notes.startsWith(COMBOS_NOTES_PREFIX)) {
        return [];
    }

    try {
        const raw = JSON.parse(notes.slice(COMBOS_NOTES_PREFIX.length));
        return Array.isArray(raw) ? raw as ComboSummary[] : [];
    } catch {
        return [];
    }
};

export const AdminOrderCard = ({ order }: AdminOrderCardProps) => {
    const deletePedido = useDeletePedido();
    const updatePedidoStatus = useUpdatePedidoStatus();
    const comboSummary = parseComboSummary(order.notes);
    const focacciasCount = order.pedidoFocaccias.reduce((acc, pf) => acc + pf.cantidad, 0);
    const combosCount = comboSummary.reduce((acc, combo) => acc + combo.cantidad, 0);
    const productsCount = focacciasCount + combosCount;

    const availableStatusOptions = [
        order.status,
        ...(allowedTransitions[order.status] ?? []),
    ];

    const handleDelete = () => {
        if (!window.confirm(`¿Eliminar el pedido ${order.orderNumber || order.id}?`)) {
            return;
        }

        deletePedido.mutate(order.id);
    };

    const handleStatusChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const nextStatus = event.target.value as PedidoStatus;
        if (nextStatus === order.status) {
            return;
        }

        updatePedidoStatus.mutate({ id: order.id, status: nextStatus });
    };

    return (
        <div className='adminOrderCard'>
            <div className='adminOrderCardContent'>
                <div className='adminOrderTop'>
                    <div className='adminOrderCardHeader'>
                        <h2 className='adminOrderId'>Pedido {order.orderNumber || `#${order.id}`}</h2>
                        <p className='adminOrderMeta'>ID interno: #{order.id}</p>
                        <p className='adminOrderMeta'>Tel: {order.clientPhone}</p>
                        <p className='adminOrderMeta'>Fecha: {formatDate(order.orderDate)}</p>
                    </div>
                    <label className={`adminOrderStatus adminOrderStatus--${order.status.toLowerCase()}`}>
                        <span className='adminOrderStatusLabel'>Estado</span>
                        <select
                            value={order.status}
                            onChange={handleStatusChange}
                            disabled={updatePedidoStatus.isPending}
                            aria-label={`Cambiar estado del pedido ${order.orderNumber || order.id}`}
                        >
                            {statusOptions
                                .filter((statusOption) => availableStatusOptions.includes(statusOption))
                                .map((statusOption) => (
                                <option key={statusOption} value={statusOption}>
                                    {statusLabels[statusOption] ?? statusOption}
                                </option>
                                ))}
                        </select>
                    </label>
                </div>

                <div className='adminOrderTotals'>
                    <p>
                        <span>Productos</span>
                        <strong>{productsCount}</strong>
                        {comboSummary.length > 0 && (
                            <span>
                                {focacciasCount} focaccia(s) + {combosCount} combo(s)
                            </span>
                        )}
                    </p>
                    <p>
                        <span>Subtotal</span>
                        <strong>{currencyFormatter.format(order.subtotal)}</strong>
                    </p>
                    <p>
                        <span>Total</span>
                        <strong>{currencyFormatter.format(order.totalPrice)}</strong>
                    </p>
                </div>

                <div className='adminOrderFocaccias'>
                    <h3>Detalle del pedido</h3>
                    <ul className='adminOrderFocacciasList'>
                        {order.pedidoFocaccias.length === 0 && (
                            <li className='adminOrderFocacciaItem adminOrderFocacciaItem--empty'>
                                No hay items cargados para este pedido.
                            </li>
                        )}
                        {order.pedidoFocaccias.map((pf) => (
                            <li key={`${pf.focacciaId}_${pf.size}`} className='adminOrderFocacciaItem'>
                                <p className='focacciaName'>{pf.name}</p>
                                <div className='focacciaMeta'>
                                    <span>Tamaño: {sizeLabels[pf.size] ?? pf.size}</span>
                                    <span>Cantidad: {pf.cantidad}</span>
                                    <span>Unitario: {currencyFormatter.format(pf.unitPrice)}</span>
                                    <span>Subtotal: {currencyFormatter.format(pf.lineSubtotal)}</span>
                                    <span>Total linea: {currencyFormatter.format(pf.lineTotal)}</span>
                                </div>
                            </li>
                        ))}
                    </ul>

                    {comboSummary.length > 0 && (
                        <>
                            <h3>Combos del pedido</h3>
                            <ul className='adminOrderFocacciasList'>
                                {comboSummary.map((combo) => (
                                    <li key={`${combo.comboId}_${combo.title}`} className='adminOrderFocacciaItem comboSummaryItem'>
                                        <p className='focacciaName'>{combo.title}</p>
                                        <div className='focacciaMeta'>
                                            <span>Cantidad: {combo.cantidad}</span>
                                            <span>Unitario: {currencyFormatter.format(combo.unitPrice)}</span>
                                            <span>Subtotal: {currencyFormatter.format(combo.subtotal)}</span>
                                        </div>
                                        <div className='comboSection'>
                                            <p className='comboSectionTitle'>Sabores elegidos</p>
                                            {combo.focaccias && combo.focaccias.length > 0 ? (
                                                <ul className='comboFlavorList'>
                                                    {combo.focaccias.map((item, index) => (
                                                        <li key={`${combo.comboId}_flavor_${index}`} className='comboFlavorItem'>
                                                            {item.cantidad} x {item.label ?? 'Sin detalle'}
                                                            {item.size ? ` (${sizeLabels[item.size] ?? item.size})` : ''}
                                                            {item.sabores && item.sabores.length > 0 ? ` - Sabores: ${item.sabores.join(', ')}` : ''}
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p className='comboSectionEmpty'>Sin sabores cargados</p>
                                            )}
                                        </div>
                                        {combo.prepizzas && combo.prepizzas.length > 0 && (
                                            <div className='focacciaMeta comboSectionMeta'>
                                                <span>Prepizzas: {combo.prepizzas.map((item) => `${item.cantidad} x ${item.label ?? 'Sin detalle'}`).join(' | ')}</span>
                                            </div>
                                        )}
                                        {combo.extras && combo.extras.length > 0 && (
                                            <div className='focacciaMeta comboSectionMeta'>
                                                <span>Extras: {combo.extras.map((item) => `${item.cantidad} x ${item.label ?? 'Sin detalle'}`).join(' | ')}</span>
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </div>

                <button
                    className='adminOrderDeleteButton'
                    onClick={handleDelete}
                    aria-label={`Eliminar pedido ${order.id}`}
                    disabled={deletePedido.isPending}
                >
                    <BiTrash />
                </button>
            </div>
        </div>
    )
}
