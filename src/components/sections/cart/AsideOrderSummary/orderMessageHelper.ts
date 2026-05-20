import type { FocacciaPedido, ComboPedido } from '@/types';

type GenerateOrderMessageParams = {
    focaccias: FocacciaPedido[];
    combos: ComboPedido[];
    totalPrice: number;
    clientPhone: string;
};

export function generateOrderMessage({ focaccias, combos, totalPrice, clientPhone }: GenerateOrderMessageParams): string {
    let message = `CROSTI FOCACCIAS\n`;
    message += `Nuevo Pedido\n\n`;
    message += `================================\n`;
    message += `DETALLE DEL PEDIDO\n`;
    message += `================================\n\n`;

    focaccias.forEach((item, index) => {
        message += `${index + 1}. ${item.focaccia.name}\n`;
        message += `   Tamaño: ${item.size === 'GRANDE' ? 'Grande' : 'Mediana'}\n`;
        message += `   Cantidad: x${item.cantidad}\n`;
        message += `   Precio unit: $${item.unitPrice.toFixed(2)}\n`;
        message += `   Subtotal: $${(item.unitPrice * item.cantidad).toFixed(2)}\n`;
        if (item.sabores && item.sabores.length > 0) {
            message += `   Sabores: ${item.sabores.join(', ')}\n`;
        }
        message += `\n`;
    });

    combos.forEach((combo, index) => {
        message += `Combo ${index + 1}: ${combo.combo.name}\n`;
        message += `   Cantidad: x${combo.cantidad}\n`;
        message += `   Precio unit: $${combo.unitPrice.toFixed(2)}\n`;
        message += `   Subtotal: $${(combo.unitPrice * combo.cantidad).toFixed(2)}\n`;
        if (combo.focaccias && combo.focaccias.length > 0) {
            message += `   Focaccias:\n`;
            combo.focaccias.forEach((f, i) => {
                message += `      - ${f.cantidad} x ${f.focaccia.name} (${f.size})`;
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
    message += `TOTAL A PAGAR: $${totalPrice.toFixed(2)}\n`;
    message += `================================\n\n`;
    message += `Mi telefono de contacto:\n${clientPhone}\n\n`;
    message += `Muchas gracias!`;

    return message;
}
