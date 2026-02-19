import { useState } from 'react';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import type { Pedido } from '../../../types';
import { AdminOrderCard } from '../AdminOrderCard/AdminOrderCard';
import { usePedidos } from '@/hooks/usePedidost';
import './_pedidosList.scss';

export const PedidosList = () => {
    const pedidos = usePedidos();
    const pedidosArray = Array.isArray(pedidos.data) ? pedidos.data : [];
    const [open, setOpen] = useState(true);

    return (
        <div className='productListContainer'>
            <div className='header'>
                <h1>Pedidos Existentes</h1>
                <button
                    className='downButton'
                    onClick={() => setOpen(o => !o)}
                    aria-label={open ? 'Ocultar lista de pedidos' : 'Mostrar lista de pedidos'}
                >
                    {open ? <FaAngleUp /> : <FaAngleDown />}
                </button>
            </div>
            <ul
                className={`productListUl${open ? ' open' : ''}`}
            >
                {pedidosArray.map((pedido: Pedido) => (
                    <li key={pedido.id}>
                        <AdminOrderCard order={pedido} />
                    </li>
                ))}
            </ul>
        </div>
    )
}
