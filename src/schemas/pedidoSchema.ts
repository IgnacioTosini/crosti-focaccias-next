import { z } from 'zod';

/**
 * Schema de validación para el teléfono del cliente
 */
export const phoneSchema = z.string()
    .regex(/^\d+$/, 'Solo se permiten números')
    .min(10, 'El número debe tener al menos 10 dígitos')
    .max(15, 'El número no puede tener más de 15 dígitos')
    .transform(val => val.trim());

/**
 * Schema de validación para una focaccia en el pedido
 */
export const pedidoFocacciaSchema = z.object({
    focacciaId: z.number()
        .positive('ID de focaccia inválido')
        .int('ID debe ser un número entero'),
    size: z.enum(['MEDIANA', 'GRANDE']).optional(),
    cantidad: z.number()
        .min(1, 'La cantidad debe ser al menos 1')
        .max(20, 'No puedes pedir más de 100 unidades')
        .int('La cantidad debe ser un número entero')
});

const comboDetailItemSchema = z.object({
    label: z.string().trim().min(1).optional(),
    cantidad: z.number().int().min(1).max(20),
});

const comboFocacciaDetailSchema = comboDetailItemSchema.extend({
    size: z.enum(['MEDIANA', 'GRANDE']).optional(),
    sabores: z.array(z.string().trim().min(1)).optional(),
});

export const pedidoComboSchema = z.object({
    comboId: z.number().int().positive('ID de combo inválido'),
    title: z.string().trim().min(1, 'El combo debe tener título'),
    cantidad: z.number().int().min(1).max(20),
    unitPrice: z.number().min(0),
    subtotal: z.number().min(0),
    focaccias: z.array(comboFocacciaDetailSchema).optional(),
    prepizzas: z.array(comboDetailItemSchema).optional(),
    extras: z.array(comboDetailItemSchema).optional(),
});

/**
 * Schema completo de validación para crear un pedido
 */
export const createPedidoSchema = z.object({
    clientPhone: phoneSchema,
    promoCode: z.string().trim().min(2, 'Código de promoción inválido').max(50, 'Código demasiado largo').optional(),
    focaccias: z.array(pedidoFocacciaSchema)
        .max(20, 'No puedes agregar más de 50 items diferentes'),
    combos: z.array(pedidoComboSchema).optional(),
}).refine(
    (data) => data.focaccias.length > 0 || (data.combos?.length ?? 0) > 0,
    {
        message: 'Debes agregar al menos una focaccia o combo al pedido',
        path: ['focaccias'],
    }
);

/**
 * Schema para validar el pedido completo con información de precio
 */
export const fullPedidoSchema = createPedidoSchema.extend({
    totalPrice: z.number()
        .min(0, 'El precio total no puede ser negativo'),
    quantity: z.number()
        .min(1, 'La cantidad total debe ser al menos 1')
});

/**
 * Tipos inferidos de los schemas
 */
export type PhoneValidation = z.infer<typeof phoneSchema>;
export type PedidoFocacciaValidation = z.infer<typeof pedidoFocacciaSchema>;
export type PedidoComboValidation = z.infer<typeof pedidoComboSchema>;
export type CreatePedidoValidation = z.infer<typeof createPedidoSchema>;
export type FullPedidoValidation = z.infer<typeof fullPedidoSchema>;
