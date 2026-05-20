import { useMemo, useState } from 'react';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import type { Pedido } from '@/types';
import { AdminOrderCard } from '../AdminOrderCard/AdminOrderCard';
import { usePedidos } from '@/hooks/usePedidos';
import './_pedidosList.scss';

const statusLabels: Record<string, string> = {
    ALL: 'Todos',
    PENDIENTE: 'Pendiente',
    CONFIRMADO: 'Confirmado',
    EN_PREPARACION: 'En preparacion',
    LISTO: 'Listo',
    ENTREGADO: 'Entregado',
    CANCELADO: 'Cancelado',
};

export const PedidosList = () => {
    const pedidos = usePedidos();

    const [statusFilter, setStatusFilter] = useState<string>('ALL');
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
            const matchesStatus = statusFilter === 'ALL' || pedido.status === statusFilter;
            if (!matchesStatus) {
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
    }, [orderedPedidos, search, statusFilter]);

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
        return <p className='ordersLoading'>Cargando pedidos...</p>;
    }

    if (pedidos.isError) {
        return <p className='ordersError'>No se pudieron cargar los pedidos.</p>;
    }

    return (
        <div className='ordersListContainer'>
            <div className='ordersHeader'>
                <h1>Pedidos</h1>
                <button
                    className='ordersToggleButton'
                    onClick={() => setOpen(o => !o)}
                    aria-label={open ? 'Ocultar lista de pedidos' : 'Mostrar lista de pedidos'}
                >
                    {open ? <FaAngleUp /> : <FaAngleDown />}
                </button>
            </div>

            <div className='ordersSummary'>
                <p><span>Total</span><strong>{summary.total}</strong></p>
                <p><span>Activos</span><strong>{summary.active}</strong></p>
                <p><span>Entregados</span><strong>{summary.delivered}</strong></p>
                <p><span>Cancelados</span><strong>{summary.cancelled}</strong></p>
            </div>

            <div className='ordersControls'>
                <input
                    type='text'
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder='Buscar por numero de pedido, ID o telefono...'
                    aria-label='Buscar pedido'
                />
                <select
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value)}
                    aria-label='Filtrar por estado'
                >
                    {Object.entries(statusLabels).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                    ))}
                </select>
            </div>

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
