
import Link from 'next/link';
import './_dashboard.scss';

const sections = [
    {
        href: '/admin/focaccias',
        icon: '🍕',
        title: 'Focaccias',
        description: 'Gestioná el catálogo de focaccias: agregar, editar y eliminar productos.',
    },
    {
        href: '/admin/combos',
        icon: '🛍️',
        title: 'Combos',
        description: 'Administrá los combos disponibles y sus precios especiales.',
    },
    {
        href: '/admin/pedidos',
        icon: '📋',
        title: 'Pedidos',
        description: 'Revisá y gestioná los pedidos entrantes y su estado de entrega.',
    },
];

export default function AdminPage() {
    return (
        <div className="admin-dashboard">
            <div className="admin-dashboard__header">
                <h1>Panel de Control</h1>
                <p>Seleccioná una sección para comenzar a gestionar.</p>
            </div>
            <div className="admin-dashboard__grid">
                {sections.map((section) => (
                    <Link key={section.href} href={section.href} className="dashboard-card">
                        <div className="dashboard-card__icon">{section.icon}</div>
                        <p className="dashboard-card__title">{section.title}</p>
                        <p className="dashboard-card__description">{section.description}</p>
                        <span className="dashboard-card__arrow">→</span>
                    </Link>
                ))}
            </div>
        </div>
    );
}