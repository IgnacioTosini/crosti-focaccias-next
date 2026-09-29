import assert from 'node:assert/strict';
import test from 'node:test';
import { businessDateKey, businessDateRange, matchesOrderFilters, parseOrderFilters } from './adminDashboard.ts';

test('el día comercial cambia a las 03:00 UTC, incluso entre años', () => {
    assert.equal(businessDateKey(new Date('2027-01-01T02:59:59.999Z')), '2026-12-31');
    assert.equal(businessDateKey(new Date('2027-01-01T03:00:00.000Z')), '2027-01-01');
    const { start, end } = businessDateRange('2026-12-31');
    assert.equal(start.toISOString(), '2026-12-31T03:00:00.000Z');
    assert.equal(end.toISOString(), '2027-01-01T03:00:00.000Z');
});

test('valida las fechas y respeta el año bisiesto', () => {
    for (const date of ['2026-02-29', '2026-04-31', '2026-13-01', 'mañana', '2026-9-29']) {
        assert.equal(businessDateRange(date), null);
    }
    assert.equal(businessDateRange('2028-02-29').end.toISOString(), '2028-03-01T03:00:00.000Z');
});

test('un enlace con filtros inválidos vuelve a la lista completa', () => {
    assert.deepEqual(parseOrderFilters({ estado: 'inventado', fecha: '2026-02-30', pedido: '-1' }), { status: 'ALL', date: '', orderId: null });
    assert.deepEqual(parseOrderFilters({ estado: '__proto__', pedido: '1.5' }), { status: 'ALL', date: '', orderId: null });
});

const order = (id, status, orderDate = '2026-09-29T15:00:00Z') => ({ id, status, orderDate });
const statuses = ['PENDIENTE', 'CONFIRMADO', 'EN_PREPARACION', 'LISTO', 'ENTREGADO', 'CANCELADO'];
const orders = statuses.map((status, index) => order(index + 1, status));

test('los accesos a activos, en curso e importe excluyen los estados correctos', () => {
    const ids = (estado) => orders.filter((item) => matchesOrderFilters(item, parseOrderFilters({ estado }))).map((item) => item.id);
    assert.deepEqual(ids('ACTIVOS'), [1, 2, 3, 4]);
    assert.deepEqual(ids('EN_CURSO'), [3, 4]);
    assert.deepEqual(ids('NO_CANCELADOS'), [1, 2, 3, 4, 5]);
    assert.deepEqual(ids('PENDIENTE'), [1]);
});

test('abrir un pedido usa el ID exacto y no una coincidencia parcial', () => {
    const filters = parseOrderFilters({ pedido: '2' });
    assert.equal(matchesOrderFilters(order(2, 'PENDIENTE'), filters), true);
    assert.equal(matchesOrderFilters(order(12, 'PENDIENTE'), filters), false);
    assert.equal(matchesOrderFilters(order(20, 'PENDIENTE'), filters), false);
});

test('el filtro de importe del día coincide con los límites horarios del resumen', () => {
    const filters = parseOrderFilters({ fecha: '2026-09-29', estado: 'NO_CANCELADOS' });
    assert.equal(matchesOrderFilters(order(1, 'LISTO', '2026-09-29T02:59:59.999Z'), filters), false);
    assert.equal(matchesOrderFilters(order(2, 'LISTO', '2026-09-29T03:00:00Z'), filters), true);
    assert.equal(matchesOrderFilters(order(3, 'ENTREGADO', '2026-09-30T02:59:59.999Z'), filters), true);
    assert.equal(matchesOrderFilters(order(4, 'LISTO', '2026-09-30T03:00:00Z'), filters), false);
    assert.equal(matchesOrderFilters(order(5, 'CANCELADO'), filters), false);
    assert.equal(matchesOrderFilters(order(6, 'PENDIENTE', '2026-09-28T03:00:00Z'), parseOrderFilters({ estado: 'PENDIENTE' })), true);
});
