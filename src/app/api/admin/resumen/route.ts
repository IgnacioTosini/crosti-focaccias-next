import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { activeOrderStatuses, businessDateKey, businessDateRange, type AdminDashboardSummary } from '@/lib/adminDashboard';

export const dynamic = 'force-dynamic';

const headers = { 'Cache-Control': 'private, no-store' };

export async function GET(request: NextRequest) {
    if (request.cookies.get('admin-session')?.value !== 'true') {
        return NextResponse.json({ message: 'Iniciá sesión para ver el resumen.' }, { status: 401, headers });
    }

    try {
        const day = businessDateKey(new Date());
        const range = businessDateRange(day)!;
        const orderDate = { gte: range.start, lt: range.end };
        const statusCounts = prisma.pedido.groupBy({
            by: ['status'],
            orderBy: { status: 'asc' },
            _count: { _all: true },
        });
        const [todayOrders, todayAmount, statuses, available, total, promotions, recentOrders] = await prisma.$transaction([
            prisma.pedido.count({ where: { orderDate } }),
            prisma.pedido.aggregate({ where: { orderDate, status: { not: 'CANCELADO' } }, _sum: { totalPrice: true } }),
            statusCounts,
            prisma.focaccia.count({ where: { isAvailable: true } }),
            prisma.focaccia.count(),
            prisma.promocion.count(),
            prisma.pedido.findMany({
                take: 5,
                orderBy: [{ orderDate: 'desc' }, { id: 'desc' }],
                select: { id: true, orderNumber: true, status: true, totalPrice: true, orderDate: true },
            }),
        ], { isolationLevel: 'RepeatableRead' });

        const count = (status: string) => statuses.find((item) => item.status === status)?._count._all ?? 0;
        const data: AdminDashboardSummary = {
            day,
            generatedAt: new Date().toISOString(),
            today: { orders: todayOrders, amount: todayAmount._sum.totalPrice ?? 0 },
            queue: {
                pending: count('PENDIENTE'),
                preparing: count('EN_PREPARACION'),
                ready: count('LISTO'),
                active: activeOrderStatuses.reduce((sum, status) => sum + count(status), 0),
            },
            catalog: { available, total, promotions },
            recentOrders: recentOrders.map((order) => ({ ...order, orderDate: order.orderDate.toISOString() })),
        };
        return NextResponse.json({ data }, { headers });
    } catch (error) {
        console.error('No se pudo cargar el resumen administrativo', error instanceof Error ? error.name : 'UnknownError');
        return NextResponse.json({ message: 'No pudimos cargar el resumen. Intentá nuevamente.' }, { status: 503, headers });
    }
}
