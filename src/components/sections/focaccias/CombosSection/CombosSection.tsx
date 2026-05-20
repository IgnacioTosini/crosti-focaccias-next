"use client";

import { useRef, useEffect } from 'react';
import { ComboCard } from '../ComboCard/ComboCard';
import { usePromociones } from '@/hooks/promociones/usePromociones';
import { animateCombosSection } from '@/animations';
import './_combosSection.scss';

export const CombosSection = () => {
    const { data: combos = [] } = usePromociones({ refetchIntervalMs: 30_000 });
    const combosSectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (combos.length > 0 && combosSectionRef.current) {
            const ctx = animateCombosSection(combosSectionRef.current);
            return () => { ctx.revert(); };
        }
    }, [combos]);

    return (
        <div className='combosSection' ref={combosSectionRef}>
            <h2 className='combosTitle'>✨ Combos & Especiales</h2>
            <div className='combosGrid'>
                {combos.map((combo) => (
                    <ComboCard
                        key={combo.id}
                        id={combo.id}
                        people={combo.people}
                        title={combo.title}
                        description={combo.description}
                        price={combo.price}
                        type={combo.type}
                        items={combo.items}
                    />
                ))}
            </div>
        </div>
    )
}
