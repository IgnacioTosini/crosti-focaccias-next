// Helpers para AsideOrderSummary

import { z } from 'zod';
import { phoneSchema } from '@/schemas/pedidoSchema';

export function validatePhoneNumber(value: string): string {
    const numbersOnly = value.replace(/\D/g, '');
    try {
        phoneSchema.parse(numbersOnly);
        return '';
    } catch (error) {
        if (error instanceof z.ZodError) {
            return error.issues[0].message;
        }
        return 'Error desconocido';
    }
}
