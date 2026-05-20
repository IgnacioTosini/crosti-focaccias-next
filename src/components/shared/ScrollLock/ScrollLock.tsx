'use client'

import { useEffect } from "react";
import { useCartStore } from "@/store/cart.store";

export const ScrollLock = () => {
    const { isOrderOpen } = useCartStore();

    useEffect(() => {
        if (isOrderOpen) {
            document.documentElement.classList.add('modal-open');
        } else {
            document.documentElement.classList.remove('modal-open');
        }

        return () => {
            document.documentElement.classList.remove('modal-open');
        };
    }, [isOrderOpen]);

    return null;
};
