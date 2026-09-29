"use client";

import { usePageText } from '@/components/content/PageContentProvider';
import { useEffect, useRef } from 'react';
import { Title } from '@/components/shared/Title/Title';
import { StepCard } from '../StepCard/StepCard';
import Image from 'next/image';
import { animateProcess } from '@/animations';
import './_process.scss';

export const Process = () => {
    const t = usePageText();
    const processRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = animateProcess(processRef.current ?? undefined);

        return () => {
            ctx.revert();
        };
    }, []);

    const steps = [
        {
            stepNumber: 1,
            title: t('process.step1Title'),
            description: t('process.step1Text')
        },
        {
            stepNumber: 2,
            title: t('process.step2Title'),
            description: t('process.step2Text')
        },
        {
            stepNumber: 3,
            title: t('process.step3Title'),
            description: t('process.step3Text')
        },
        {
            stepNumber: 4,
            title: t('process.step4Title'),
            description: t('process.step4Text')
        },
    ];

    return (
        <div className="processSection" ref={processRef}>
            <div className="processContainer">
                <div className='titleWithStickers'>
                    <Image
                        src={t('process.stickerLeft')}
                        alt="Sticker decorativo ajo"
                        width={92}
                        height={92}
                        className='titleSticker titleStickerLeft'
                    />
                    <Title title={t('process.title')} subTitle={t('process.subtitle')} />
                    <Image
                        src={t('process.stickerRight')}
                        alt="Sticker decorativo cebolla"
                        width={88}
                        height={88}
                        className='titleSticker titleStickerRight'
                    />
                </div>
                <div className="processSteps">
                    {steps.map((step) => (
                        <StepCard
                            key={step.stepNumber}
                            stepNumber={step.stepNumber}
                            title={step.title}
                            description={step.description}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
