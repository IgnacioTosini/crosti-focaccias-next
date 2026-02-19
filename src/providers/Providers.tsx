'use client';

import { ReactQueryProvider } from "./ReactQueryProvider";

interface Props {
    children: React.ReactNode;
}

export const Providers = ({ children }: Props) => {
    return (
        <ReactQueryProvider>
            {children}
        </ReactQueryProvider>
    )
}
