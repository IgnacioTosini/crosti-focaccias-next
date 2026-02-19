import { create } from "zustand";
import { FocacciaItem, PedidoFocaccia } from "@/types";
import { persist } from "zustand/middleware";

type CartState = {
    pedidoFocaccias: PedidoFocaccia[];
    quantity: number;
    totalPrice: number;
    isOrderOpen: boolean;

    setIsOrderOpen: (value: boolean) => void;
    addToCart: (focaccia: FocacciaItem) => void;
    removeFromCart: (focacciaId: number) => void;
    lessQuantityToItem: (focacciaId: number) => void;
    clearCart: () => void;
};

export const useCartStore = create<CartState>()(
    persist(
        (set) => ({
            pedidoFocaccias: [],
            quantity: 0,
            totalPrice: 0,
            isOrderOpen: false,

            setIsOrderOpen: (value) => set({ isOrderOpen: value }),

            addToCart: (focaccia) =>
                set((state) => {
                    const existing = state.pedidoFocaccias.find(
                        (item) => item.focaccia.id === focaccia.id
                    );

                    let updated: PedidoFocaccia[];

                    if (existing) {
                        updated = state.pedidoFocaccias.map((item) =>
                            item.focaccia.id === focaccia.id
                                ? { ...item, cantidad: item.cantidad + 1 }
                                : item
                        );
                    } else {
                        updated = [
                            ...state.pedidoFocaccias,
                            { focaccia, cantidad: 1 },
                        ];
                    }

                    const quantity = updated.reduce(
                        (acc, item) => acc + item.cantidad,
                        0
                    );

                    const totalPrice = updated.reduce(
                        (acc, item) =>
                            acc + item.focaccia.price * item.cantidad,
                        0
                    );

                    return {
                        pedidoFocaccias: updated,
                        quantity,
                        totalPrice,
                    };
                }),

            removeFromCart: (focacciaId) =>
                set((state) => {
                    const updated = state.pedidoFocaccias.filter(
                        (item) => item.focaccia.id !== focacciaId
                    );

                    const quantity = updated.reduce(
                        (acc, item) => acc + item.cantidad,
                        0
                    );

                    const totalPrice = updated.reduce(
                        (acc, item) =>
                            acc + item.focaccia.price * item.cantidad,
                        0
                    );

                    return { pedidoFocaccias: updated, quantity, totalPrice };
                }),

            lessQuantityToItem: (focacciaId) =>
                set((state) => {
                    const updated = state.pedidoFocaccias
                        .map((item) =>
                            item.focaccia.id === focacciaId
                                ? { ...item, cantidad: item.cantidad - 1 }
                                : item
                        )
                        .filter((item) => item.cantidad > 0);

                    const quantity = updated.reduce(
                        (acc, item) => acc + item.cantidad,
                        0
                    );

                    const totalPrice = updated.reduce(
                        (acc, item) =>
                            acc + item.focaccia.price * item.cantidad,
                        0
                    );

                    return { pedidoFocaccias: updated, quantity, totalPrice };
                }),

            clearCart: () =>
                set({
                    pedidoFocaccias: [],
                    quantity: 0,
                    totalPrice: 0,
                }),
        }),
        {
            name: "crosti-cart",
        }
    )
)
