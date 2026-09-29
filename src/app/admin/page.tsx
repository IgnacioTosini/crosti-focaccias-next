'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { FaArrowRight, FaCalendarAlt, FaClipboardList, FaClock, FaCoins, FaEdit, FaPizzaSlice, FaSyncAlt, FaTags, FaUtensils } from 'react-icons/fa';
import { BUSINESS_TIME_ZONE, orderStatusLabels, type AdminDashboardSummary } from '@/lib/adminDashboard';
import './_dashboard.scss';

const currency = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0, maximumFractionDigits: 2 });
const time = new Intl.DateTimeFormat('es-AR', { timeZone: BUSINESS_TIME_ZONE, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
const shortDate = new Intl.DateTimeFormat('es-AR', { timeZone: BUSINESS_TIME_ZONE, day: '2-digit', month: '2-digit', year: 'numeric' });
const longDate = new Intl.DateTimeFormat('es-AR', { timeZone: BUSINESS_TIME_ZONE, weekday: 'long', day: 'numeric', month: 'long' });

export default function AdminPage() {
    const summary = useQuery({
        queryKey: ['admin-dashboard'],
        queryFn: async ({ signal }): Promise<AdminDashboardSummary> => {
            const response = await fetch('/api/admin/resumen', { cache: 'no-store', signal });
            if (!response.ok) throw new Error('No se pudo cargar el resumen.');
            return (await response.json()).data;
        },
        staleTime: 0,
        gcTime: 0,
        refetchOnMount: 'always',
        refetchOnWindowFocus: true,
        refetchInterval: 30_000,
        refetchIntervalInBackground: false,
    });
    const data = summary.data;
    const metrics = [
        { title: 'Pedidos de hoy', value: data?.today.orders, description: 'Recibidos durante el día', icon: FaClipboardList, tone: 'neutral', href: data ? `/admin/pedidos?fecha=${data.day}` : '/admin/pedidos' },
        { title: 'Pendientes de confirmar', value: data?.queue.pending, description: 'Incluye pedidos de días anteriores', icon: FaClock, tone: 'pending', href: '/admin/pedidos?estado=PENDIENTE' },
        { title: 'En preparación / listos', value: data ? data.queue.preparing + data.queue.ready : undefined, description: data ? `${data.queue.preparing} en preparación · ${data.queue.ready} listos` : 'Pedidos por preparar o entregar', icon: FaUtensils, tone: 'ready', href: '/admin/pedidos?estado=EN_CURSO' },
        { title: 'Importe del día', value: data ? currency.format(data.today.amount) : undefined, description: 'ARS · No incluye cancelados', icon: FaCoins, tone: 'amount', href: data ? `/admin/pedidos?fecha=${data.day}&estado=NO_CANCELADOS` : '/admin/pedidos' },
    ];
    const sections = [
        { href: '/admin/contenido', icon: FaEdit, title: 'Contenido', count: 'Inicio y Mayoristas', description: 'Editá los textos del sitio y revisalos antes de publicar.' },
        { href: '/admin/focaccias', icon: FaPizzaSlice, title: 'Focaccias', count: data ? `${data.catalog.available} disponibles de ${data.catalog.total}` : 'Catálogo de productos', description: 'Agregá, editá y actualizá la disponibilidad de tus focaccias.' },
        { href: '/admin/combos', icon: FaTags, title: 'Combos', count: data ? `${data.catalog.promotions} cargados` : 'Combos y especiales', description: 'Administrá las propuestas para compartir y sus precios.' },
        { href: '/admin/pedidos?estado=ACTIVOS', icon: FaClipboardList, title: 'Pedidos', count: data ? `${data.queue.active} activos` : 'Gestión de pedidos', description: 'Seguí los pedidos desde la confirmación hasta la entrega.' },
    ];

    return (
        <div className='admin-dashboard'>
            <header className='admin-dashboard__header'>
                <div>
                    <h1>Panel de Control</h1>
                    <p>Tu día en Crosti, de un vistazo.</p>
                </div>
                <button className='dashboard-refresh' onClick={() => void summary.refetch()} disabled={summary.isFetching}>
                    <FaSyncAlt aria-hidden='true' className={summary.isFetching ? 'is-spinning' : ''} />
                    {summary.isFetching ? 'Actualizando…' : 'Actualizar'}
                </button>
            </header>

            <section className='dashboard-overview' aria-labelledby='overview-title' aria-busy={summary.isPending}>
                <div className='dashboard-section-heading'>
                    <h2 id='overview-title'>Resumen del día</h2>
                    {data && <span className='dashboard-date'><FaCalendarAlt aria-hidden='true' /> {longDate.format(new Date(`${data.day}T12:00:00-03:00`))}</span>}
                </div>
                {summary.isError && (
                    <div className='dashboard-notice' role='alert'>
                        <p>{data ? 'No pudimos actualizar los datos. Estás viendo el último resumen disponible.' : 'No pudimos cargar el resumen. Revisá la conexión e intentá nuevamente.'}</p>
                        <button onClick={() => void summary.refetch()} disabled={summary.isFetching}>Reintentar</button>
                    </div>
                )}
                <div className='dashboard-metrics'>
                    {metrics.map(({ title, value, description, icon: Icon, tone, href }) => (
                        <Link href={href} key={title} className={`dashboard-metric dashboard-metric--${tone}`}>
                            <div className='dashboard-metric__heading'><span>{title}</span><Icon aria-hidden='true' /></div>
                            <strong className={value === undefined && summary.isPending ? 'dashboard-skeleton' : ''}>{value ?? <span aria-label={summary.isPending ? 'Cargando' : 'Sin datos'}>—</span>}</strong>
                            <div className='dashboard-metric__footer'><span>{description}</span><FaArrowRight aria-hidden='true' /></div>
                        </Link>
                    ))}
                </div>
                <p className='dashboard-updated' role='status'>
                    {data ? `Actualizado a las ${time.format(new Date(data.generatedAt))} · Hora de Argentina · Se actualiza cada 30 s` : summary.isPending ? 'Cargando el resumen…' : 'Los datos no están disponibles.'}
                </p>
            </section>

            <section className='dashboard-recent' aria-labelledby='recent-orders-title'>
                <div className='dashboard-section-heading'>
                    <div><h2 id='recent-orders-title'>Últimos pedidos</h2><p>Los 5 más recientes, de todos los días.</p></div>
                    <Link href='/admin/pedidos' className='dashboard-text-link'>Ver todos <FaArrowRight aria-hidden='true' /></Link>
                </div>
                {!data ? (
                    <div className='dashboard-empty' role='status'><FaClipboardList aria-hidden='true' /><p>{summary.isPending ? 'Cargando los últimos pedidos…' : 'No pudimos obtener los últimos pedidos.'}</p></div>
                ) : data.recentOrders.length === 0 ? (
                    <div className='dashboard-empty'><span className='dashboard-empty__icon'><FaClipboardList aria-hidden='true' /></span><h3>Todavía no hay pedidos</h3><p>Cuando llegue el primero, lo vas a ver acá para empezar a gestionarlo.</p></div>
                ) : (
                    <div className='dashboard-table-wrapper' tabIndex={0} role='region' aria-label='Últimos cinco pedidos'>
                        <table className='dashboard-table' role='table'>
                            <thead role='rowgroup'><tr role='row'><th role='columnheader' scope='col'>Pedido</th><th role='columnheader' scope='col'>Fecha y hora</th><th role='columnheader' scope='col'>Estado</th><th role='columnheader' scope='col' className='dashboard-table__amount'>Importe</th><th role='columnheader' scope='col'><span className='dashboard-sr-only'>Acciones</span></th></tr></thead>
                            <tbody role='rowgroup'>{data.recentOrders.map((order) => (
                                <tr key={order.id} role='row'>
                                    <th scope='row' role='rowheader'><span className='dashboard-order-id'>#{order.id}</span><span className='dashboard-order-number'>{order.orderNumber}</span></th>
                                    <td role='cell' className='dashboard-table__date' data-label='Fecha y hora'><time dateTime={order.orderDate}>{shortDate.format(new Date(order.orderDate))}<span className='dashboard-order-time'>{time.format(new Date(order.orderDate))} h</span></time></td>
                                    <td role='cell' className='dashboard-table__status'><span className={`dashboard-status dashboard-status--${order.status.toLowerCase()}`}>{orderStatusLabels[order.status]}</span></td>
                                    <td role='cell' className='dashboard-table__amount' data-label='Importe'>{currency.format(order.totalPrice)}</td>
                                    <td role='cell' className='dashboard-table__action'><Link className='dashboard-order-link' href={`/admin/pedidos?pedido=${order.id}`} aria-label={`Abrir pedido ${order.orderNumber || order.id}`}>Abrir <FaArrowRight aria-hidden='true' /></Link></td>
                                </tr>
                            ))}</tbody>
                        </table>
                    </div>
                )}
            </section>

            <section aria-labelledby='management-title'>
                <div className='dashboard-section-heading'><h2 id='management-title'>Gestioná tu negocio</h2></div>
                <div className='admin-dashboard__grid'>
                    {sections.map(({ href, icon: Icon, title, count, description }) => (
                        <Link key={title} href={href} className='dashboard-card'>
                            <div className='dashboard-card__top'><span className='dashboard-card__icon'><Icon aria-hidden='true' /></span><span className='dashboard-card__count'>{count}</span></div>
                            <h3 className='dashboard-card__title'>{title}</h3>
                            <p className='dashboard-card__description'>{description}</p>
                            <span className='dashboard-card__arrow' aria-hidden='true'>→</span>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
}
