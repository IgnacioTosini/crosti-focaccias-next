import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { FocacciaPedido, ComboPedido, FocacciaSize } from "@/types";

type CartState = {
    focaccias: FocacciaPedido[];
    combos: ComboPedido[];
    quantity: number;
    totalPrice: number;
    isOrderOpen: boolean;

    setIsOrderOpen: (value: boolean) => void;
    addFocaccia: (item: FocacciaPedido) => void;
    increaseFocacciaQuantity: (focacciaId: number, size: FocacciaSize) => void;
    decreaseFocacciaQuantity: (focacciaId: number, size: FocacciaSize) => void;
    removeFocaccia: (focacciaId: number, size: FocacciaSize) => void;
    addCombo: (item: ComboPedido) => void;
    increaseComboQuantity: (comboId: number) => void;
    decreaseComboQuantity: (comboId: number) => void;
    setComboFlavorSelection: (comboId: number, slotIndex: number, selectedFocaccia: FocacciaPedido['focaccia']) => void;
    removeCombo: (comboId: number) => void;
    clearCart: () => void;
};

type LegacyPersistedState = {
    pedidoFocaccias?: FocacciaPedido[];
    focaccias?: FocacciaPedido[];
    combos?: ComboPedido[];
    quantity?: number;
    totalPrice?: number;
    isOrderOpen?: boolean;
};

const calculateCartTotals = (focaccias: FocacciaPedido[], combos: ComboPedido[]) => {
    const quantity =
        focaccias.reduce((acc, item) => acc + item.cantidad, 0) +
        combos.reduce((acc, item) => acc + item.cantidad, 0);

    const totalPrice =
        focaccias.reduce((acc, item) => acc + item.unitPrice * item.cantidad, 0) +
        combos.reduce((acc, item) => acc + item.unitPrice * item.cantidad, 0);

    return { quantity, totalPrice };
};

export const useCartStore = create<CartState>()(
    persist(
        (set) => ({
            focaccias: [],
            combos: [],
            quantity: 0,
            totalPrice: 0,
            isOrderOpen: false,

            setIsOrderOpen: (value) => set({ isOrderOpen: value }),

            addFocaccia: (item) => set((state) => {
                // Si ya existe la misma focaccia y tamaño, suma cantidad
                const idx = state.focaccias.findIndex(f => f.focaccia.id === item.focaccia.id && f.size === item.size);
                let focaccias;
                if (idx >= 0) {
                    focaccias = [...state.focaccias];
                    focaccias[idx] = {
                        ...focaccias[idx],
                        cantidad: focaccias[idx].cantidad + item.cantidad,
                        subtotal: focaccias[idx].unitPrice * (focaccias[idx].cantidad + item.cantidad),
                    };
                } else {
                    focaccias = [
                        ...state.focaccias,
                        {
                            ...item,
                            subtotal: item.unitPrice * item.cantidad,
                        },
                    ];
                }
                const quantity = focaccias.reduce((acc, i) => acc + i.cantidad, 0) + state.combos.reduce((acc, c) => acc + c.cantidad, 0);
                const totalPrice = focaccias.reduce((acc, i) => acc + i.unitPrice * i.cantidad, 0) + state.combos.reduce((acc, c) => acc + c.unitPrice * c.cantidad, 0);
                return { focaccias, quantity, totalPrice };
            }),

            increaseFocacciaQuantity: (focacciaId, size) =>
                set((state) => {
                    const focaccias = state.focaccias.map((item) =>
                        item.focaccia.id === focacciaId && item.size === size
                            ? {
                                ...item,
                                cantidad: item.cantidad + 1,
                                subtotal: item.unitPrice * (item.cantidad + 1),
                            }
                            : item
                    );

                    const { quantity, totalPrice } = calculateCartTotals(focaccias, state.combos);
                    return { focaccias, quantity, totalPrice };
                }),

            decreaseFocacciaQuantity: (focacciaId, size) =>
                set((state) => {
                    const focaccias = state.focaccias
                        .map((item) =>
                            item.focaccia.id === focacciaId && item.size === size
                                ? {
                                    ...item,
                                    cantidad: item.cantidad - 1,
                                    subtotal: item.unitPrice * (item.cantidad - 1),
                                }
                                : item
                        )
                        .filter((item) => item.cantidad > 0);

                    const { quantity, totalPrice } = calculateCartTotals(focaccias, state.combos);
                    return { focaccias, quantity, totalPrice };
                }),

            removeFocaccia: (focacciaId, size) => set((state) => {
                const focaccias = state.focaccias.filter(f => !(f.focaccia.id === focacciaId && f.size === size));
                const quantity = focaccias.reduce((acc, i) => acc + i.cantidad, 0) + state.combos.reduce((acc, c) => acc + c.cantidad, 0);
                const totalPrice = focaccias.reduce((acc, i) => acc + i.unitPrice * i.cantidad, 0) + state.combos.reduce((acc, c) => acc + c.unitPrice * c.cantidad, 0);
                return { focaccias, quantity, totalPrice };
            }),

            addCombo: (item) => set((state) => {
                // Si ya existe el mismo combo (por id), suma cantidad
                const idx = state.combos.findIndex(c => c.combo.id === item.combo.id);
                let combos;
                if (idx >= 0) {
                    combos = [...state.combos];
                    const currentCombo = combos[idx];
                    combos[idx] = {
                        ...currentCombo,
                        cantidad: currentCombo.cantidad + item.cantidad,
                        subtotal: currentCombo.unitPrice * (currentCombo.cantidad + item.cantidad),
                        // Al sumar otra unidad del combo, agregamos nuevos slots de sabor sin seleccionar.
                        focaccias: [...currentCombo.focaccias, ...item.focaccias],
                    };
                } else {
                    combos = [
                        ...state.combos,
                        {
                            ...item,
                            subtotal: item.unitPrice * item.cantidad,
                        },
                    ];
                }
                const quantity = state.focaccias.reduce((acc, i) => acc + i.cantidad, 0) + combos.reduce((acc, c) => acc + c.cantidad, 0);
                const totalPrice = state.focaccias.reduce((acc, i) => acc + i.unitPrice * i.cantidad, 0) + combos.reduce((acc, c) => acc + c.unitPrice * c.cantidad, 0);
                return { combos, quantity, totalPrice };
            }),

            increaseComboQuantity: (comboId) =>
                set((state) => {
                    const combos = state.combos.map((combo) => {
                        if (combo.combo.id !== comboId) {
                            return combo;
                        }

                        const slotsPerUnit = combo.cantidad > 0
                            ? Math.max(0, Math.floor(combo.focaccias.length / combo.cantidad))
                            : 0;

                        const extraSlots = slotsPerUnit > 0
                            ? Array.from({ length: slotsPerUnit }, () => ({
                                focaccia: {
                                    id: 0,
                                    name: '',
                                    description: '',
                                    mediumPrice: 0,
                                    largePrice: 0,
                                    imageUrl: '',
                                    imagePublicId: '',
                                    isAvailable: true,
                                },
                                size: 'MEDIANA' as FocacciaSize,
                                cantidad: 1,
                                unitPrice: 0,
                                subtotal: 0,
                                sabores: [],
                            }))
                            : [];

                        return {
                            ...combo,
                            cantidad: combo.cantidad + 1,
                            subtotal: combo.unitPrice * (combo.cantidad + 1),
                            focaccias: [...combo.focaccias, ...extraSlots],
                        };
                    });

                    const { quantity, totalPrice } = calculateCartTotals(state.focaccias, combos);
                    return { combos, quantity, totalPrice };
                }),

            decreaseComboQuantity: (comboId) =>
                set((state) => {
                    const combos = state.combos
                        .map((combo) => {
                            if (combo.combo.id !== comboId) {
                                return combo;
                            }

                            const nextCantidad = combo.cantidad - 1;
                            if (nextCantidad <= 0) {
                                return null;
                            }

                            const slotsPerUnit = combo.cantidad > 0
                                ? Math.max(0, Math.floor(combo.focaccias.length / combo.cantidad))
                                : 0;

                            const nextFocaccias = slotsPerUnit > 0
                                ? combo.focaccias.slice(0, Math.max(0, combo.focaccias.length - slotsPerUnit))
                                : combo.focaccias;

                            return {
                                ...combo,
                                cantidad: nextCantidad,
                                subtotal: combo.unitPrice * nextCantidad,
                                focaccias: nextFocaccias,
                            };
                        })
                        .filter((combo): combo is ComboPedido => combo !== null);

                    const { quantity, totalPrice } = calculateCartTotals(state.focaccias, combos);
                    return { combos, quantity, totalPrice };
                }),

            setComboFlavorSelection: (comboId, slotIndex, selectedFocaccia) =>
                set((state) => {
                    const combos = state.combos.map((combo) => {
                        if (combo.combo.id !== comboId) {
                            return combo;
                        }

                        const focaccias = combo.focaccias.map((slot, index) => {
                            if (index !== slotIndex) {
                                return slot;
                            }

                            return {
                                ...slot,
                                focaccia: selectedFocaccia,
                            };
                        });

                        return {
                            ...combo,
                            focaccias,
                        };
                    });

                    return { combos };
                }),

            removeCombo: (comboId) => set((state) => {
                const combos = state.combos.filter(c => c.combo.id !== comboId);
                const quantity = state.focaccias.reduce((acc, i) => acc + i.cantidad, 0) + combos.reduce((acc, c) => acc + c.cantidad, 0);
                const totalPrice = state.focaccias.reduce((acc, i) => acc + i.unitPrice * i.cantidad, 0) + combos.reduce((acc, c) => acc + c.unitPrice * c.cantidad, 0);
                return { combos, quantity, totalPrice };
            }),

            clearCart: () => set({ focaccias: [], combos: [], quantity: 0, totalPrice: 0 }),
        }),
        {
            name: "crosti-cart",
            version: 3,
            migrate: (persistedState: unknown) => {
                const state = (persistedState ?? {}) as LegacyPersistedState;

                const focaccias = Array.isArray(state.focaccias)
                    ? state.focaccias
                    : Array.isArray(state.pedidoFocaccias)
                        ? state.pedidoFocaccias
                        : [];

                const combos = Array.isArray(state.combos) ? state.combos : [];
                const { quantity, totalPrice } = calculateCartTotals(focaccias, combos);

                return {
                    focaccias,
                    combos,
                    quantity,
                    totalPrice,
                    isOrderOpen: Boolean(state.isOrderOpen),
                };
            },
        }
    )
);
