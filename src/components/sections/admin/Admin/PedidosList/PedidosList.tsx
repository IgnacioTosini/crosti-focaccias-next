'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaAngleDown, FaAngleUp, FaSearch } from 'react-icons/fa';
import type { Pedido } from '@/types';
import { AdminOrderCard } from '../AdminOrderCard/AdminOrderCard';
import { AdminState } from '../AdminState/AdminState';
import { usePedidos } from '@/hooks/usePedidos';
import { matchesOrderFilters, orderFilterLabels, type OrderFilters } from '@/lib/adminDashboard';
import './_pedidosList.scss';

export const PedidosList = ({ initialFilters = { status: 'ALL', date: '', orderId: null } }: { initialFilters?: OrderFilters }) => {
    const pedidos = usePedidos();
    const router = useRouter();

    const [statusFilter, setStatusFilter] = useState(initialFilters.status);
    const [dateFilter, setDateFilter] = useState(initialFilters.date);
    const [orderIdFilter, setOrderIdFilter] = useState(initialFilters.orderId);
    const [search, setSearch] = useState('');
    const [open, setOpen] = useState(true);

    const orderedPedidos = useMemo(
        () => {
            const pedidosArray = Array.isArray(pedidos.data) ? pedidos.data : [];
            return [...pedidosArray].sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
        },
        [pedidos.data]
    );

    const filteredPedidos = useMemo(() => {
        const normalizedSearch = search.trim().toLowerCase();

        return orderedPedidos.filter((pedido) => {
            if (!matchesOrderFilters(pedido, { status: statusFilter, date: dateFilter, orderId: orderIdFilter })) {
                return false;
            }

            if (!normalizedSearch) {
                return true;
            }

            const orderNumber = String(pedido.orderNumber ?? '').toLowerCase();
            const phone = String(pedido.clientPhone ?? '').toLowerCase();
            const id = String(pedido.id).toLowerCase();

            return orderNumber.includes(normalizedSearch)
                || phone.includes(normalizedSearch)
                || id.includes(normalizedSearch);
        });
    }, [orderedPedidos, search, statusFilter, dateFilter, orderIdFilter]);

    const clearFilters = () => {
        setStatusFilter('ALL');
        setDateFilter('');
        setOrderIdFilter(null);
        setSearch('');
        router.replace('/admin/pedidos', { scroll: false });
    };

    const summary = useMemo(() => {
        return orderedPedidos.reduce(
            (acc, pedido) => {
                acc.total += 1;
                if (pedido.status === 'PENDIENTE' || pedido.status === 'CONFIRMADO' || pedido.status === 'EN_PREPARACION' || pedido.status === 'LISTO') {
                    acc.active += 1;
                }
                if (pedido.status === 'ENTREGADO') {
                    acc.delivered += 1;
                }
                if (pedido.status === 'CANCELADO') {
                    acc.cancelled += 1;
                }
                return acc;
            },
            { total: 0, active: 0, delivered: 0, cancelled: 0 }
        );
    }, [orderedPedidos]);

    if (pedidos.isLoading) {
        return (
            <AdminState
                variant='loading'
                title='Cargando pedidos'
                description='Estamos buscando los pedidos más recientes.'
            />
        );
    }

    if (pedidos.isError) {
        return (
            <AdminState
                variant='error'
                title='No se pudieron cargar los pedidos'
                description='Revisá la conexión o intentá nuevamente en unos segundos.'
            />
        );
    }

    return (
        <div className='ordersListContainer'>
            <div className='ordersHeader'>
                <div>
                    <span className='ordersEyebrow'>Gestión</span>
                    <h1>Pedidos</h1>
                    <p>Seguimiento de pedidos entrantes, estados y totales.</p>
                </div>
                <div className='ordersHeaderMeta'>
                    <span>{filteredPedidos.length} visibles</span>
                    <button
                        className='ordersToggleButton'
                        onClick={() => setOpen(o => !o)}
                        aria-label={open ? 'Ocultar lista de pedidos' : 'Mostrar lista de pedidos'}
                    >
                        {open ? <FaAngleUp /> : <FaAngleDown />}
                    </button>
                </div>
            </div>

            <div className='ordersSummary'>
                <p><span>Total</span><strong>{summary.total}</strong></p>
                <p><span>Activos</span><strong>{summary.active}</strong></p>
                <p><span>Entregados</span><strong>{summary.delivered}</strong></p>
                <p><span>Cancelados</span><strong>{summary.cancelled}</strong></p>
            </div>

            <div className='ordersControls'>
                <label className='ordersSearchControl'>
                    <FaSearch />
                    <input
                        type='text'
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder='Buscar por número, ID o teléfono...'
                        aria-label='Buscar pedido'
                    />
                </label>
                <select
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value)}
                    aria-label='Filtrar por estado'
                >
                    {Object.entries(orderFilterLabels).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                    ))}
                </select>
                <label className='ordersDateControl'>
                    <span>Fecha (Argentina)</span>
                    <input type='date' value={dateFilter} onChange={(event) => setDateFilter(event.target.value)} aria-label='Filtrar por fecha de pedido' />
                </label>
            </div>

            {(statusFilter !== 'ALL' || dateFilter || orderIdFilter !== null || search) && (
                <div className='ordersActiveFilters'>
                    <p>{orderIdFilter !== null ? `Mostrando el pedido #${orderIdFilter}` : 'Mostrando pedidos filtrados'}</p>
                    <button type='button' onClick={clearFilters}>Limpiar filtros y ver todos</button>
                </div>
            )}

            <ul
                className={`ordersList${open ? ' open' : ''}`}
            >
                {filteredPedidos.length === 0 && (
                    <li className='ordersEmpty'>No hay pedidos para los filtros seleccionados.</li>
                )}
                {filteredPedidos.map((pedido: Pedido) => (
                    <li key={pedido.id}>
                        <AdminOrderCard order={pedido} />
                    </li>
                ))}
            </ul>
        </div>
    )
}
