import type { FocacciaPedido, ComboPedido } from '@/types';

type GenerateOrderMessageParams = {
    focaccias: FocacciaPedido[];
    combos: ComboPedido[];
    totalPrice: number;
    clientPhone: string;
};

const money = (value: number) => `$${new Intl.NumberFormat('es-AR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
}).format(value)}`;

const sizeLabel = (size?: string) => size === 'GRANDE' ? 'Grande' : 'Mediana';

export function generateOrderMessage({ focaccias, combos, totalPrice, clientPhone }: GenerateOrderMessageParams): string {
    let message = `CROSTI FOCACCIAS\n`;
    message += `Nuevo Pedido\n\n`;
    message += `================================\n`;
    message += `DETALLE DEL PEDIDO\n`;
    message += `================================\n\n`;

    focaccias.forEach((item, index) => {
        message += `${index + 1}. ${item.focaccia.name}\n`;
        message += `   Tamaño: ${sizeLabel(item.size)}\n`;
        message += `   Cantidad: x${item.cantidad}\n`;
        message += `   Precio unit: ${money(item.unitPrice)}\n`;
        message += `   Subtotal: ${money(item.unitPrice * item.cantidad)}\n`;
        if (item.sabores && item.sabores.length > 0) {
            message += `   Sabores: ${item.sabores.join(', ')}\n`;
        }
        message += `\n`;
    });

    combos.forEach((combo, index) => {
        message += `Combo ${index + 1}: ${combo.combo.name}\n`;
        message += `   Cantidad: x${combo.cantidad}\n`;
        message += `   Precio unit: ${money(combo.unitPrice)}\n`;
        message += `   Subtotal: ${money(combo.unitPrice * combo.cantidad)}\n`;
        if (combo.focaccias && combo.focaccias.length > 0) {
            message += `   Focaccias:\n`;
            combo.focaccias.forEach((f, slotIndex) => {
                const name = f.focaccia.name?.trim() || `Sabor pendiente #${slotIndex + 1}`;
                message += `      - ${f.cantidad} x ${name} (${sizeLabel(f.size)})`;
                if (f.sabores && f.sabores.length > 0) message += ` [Sabores: ${f.sabores.join(', ')}]`;
                message += `\n`;
            });
        }
        if (combo.prepizzas && combo.prepizzas.length > 0) {
            message += `   Prepizzas:\n`;
            combo.prepizzas.forEach((p) => {
                message += `      - ${p.quantity} x ${p.label ?? 'Prepizza'}\n`;
            });
        }
        if (combo.extras && combo.extras.length > 0) {
            message += `   Extras:\n`;
            combo.extras.forEach((e) => {
                message += `      - ${e.quantity} x ${e.label ?? 'Extra'}\n`;
            });
        }
        message += `\n`;
    });

    message += `================================\n`;
    message += `TOTAL A PAGAR: ${money(totalPrice)}\n`;
    message += `================================\n\n`;
    message += `Mi telefono de contacto:\n${clientPhone}\n\n`;
    message += `Muchas gracias!`;

    return message;
}
