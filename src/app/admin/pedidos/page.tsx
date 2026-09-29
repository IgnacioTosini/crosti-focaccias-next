import { PedidosList } from '@/components/sections/admin/Admin/PedidosList/PedidosList';
import { parseOrderFilters } from '@/lib/adminDashboard';

export default async function AdminPedidosPage({ searchParams }: {
  searchParams: Promise<{ estado?: string; fecha?: string; pedido?: string }>;
}) {
  const filters = parseOrderFilters(await searchParams);
  return (
    <section>
      <PedidosList key={`${filters.status}-${filters.date}-${filters.orderId}`} initialFilters={filters} />
    </section>
  );
}
