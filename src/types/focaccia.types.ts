// Estructura base para focaccias individuales
export type FocacciaSize = 'MEDIANA' | 'GRANDE';

export type FocacciaBase = {
    id: number;
    name: string;
    description: string;
    mediumPrice: number;
    largePrice: number;
    isVeggie?: boolean;
    imageUrl: string;
    imagePublicId: string;
    featured?: boolean;
    isAvailable?: boolean;
};

// Compatibilidad con el código existente del menú y admin.
export type FocacciaItem = FocacciaBase & {
    price?: number;
    pedidos?: unknown[];
};

export type FocacciaCreate = Omit<FocacciaBase, 'id'> & {
    price?: number;
};

export type FocacciaPedido = {
    focaccia: FocacciaBase;
    size: FocacciaSize;
    cantidad: number;
    unitPrice: number;
    subtotal: number;
    sabores?: string[]; // Si aplica, para combos
};
