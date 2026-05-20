import type { FocacciaSize, FocacciaPedido } from './focaccia.types';

export type ComboItemType = 'focaccia' | 'prepizza' | 'extra';

export type ComboItem = {
    id?: number;
    itemType: ComboItemType;
    label?: string | null;
    quantity: number;
    size?: FocacciaSize | null;
    order?: number;
    sabores?: string[]; // Para focaccias de combo
};

export type ComboBase = {
    id: number;
    name: string;
    description: string;
    mediumPrice: number;
    largePrice: number;
    imageUrl: string;
    imagePublicId: string;
    featured: boolean;
    isVeggie: boolean;
    isAvailable: boolean;
    people: number;
    comboType: 'focaccias' | 'prepizzas' | 'combos';
    comboItems: ComboItem[];
};

export type ComboPedido = {
    combo: ComboBase;
    cantidad: number;
    unitPrice: number;
    subtotal: number;
    focaccias: FocacciaPedido[];
    prepizzas?: ComboItem[];
    extras?: ComboItem[];
};
