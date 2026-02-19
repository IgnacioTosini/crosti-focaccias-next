'use client'

import { useCartStore } from "@/store/cart.store";
import { AsideOrderSummary } from "../AsideOrderSummary/AsideOrderSummary";

export const CartUI = () => {
    const { isOrderOpen } = useCartStore();

    return (
        <>
            {isOrderOpen && <AsideOrderSummary />}
        </>
    );
};
