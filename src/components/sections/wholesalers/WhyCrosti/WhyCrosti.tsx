"use client";

import { usePageText } from '@/components/content/PageContentProvider';
import { useEffect, useRef } from 'react';
import { Title } from '@/components/shared/Title/Title';
import { WhyCard } from '../WhyCard/WhyCard';
import { FaAward, FaBoxes, FaLeaf, FaTruck } from 'react-icons/fa';
import { IoPeople } from 'react-icons/io5';
import Image from 'next/image';
import { animateWhyCrosti } from '@/animations';
import './_whyCrosti.scss';

export const WhyCrosti = () => {
    const t = usePageText();
    const whyCrostiRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = animateWhyCrosti(whyCrostiRef.current ?? undefined);

        return () => {
            ctx.revert();
        };
    }, []);

    return (
        <div className="whyCrosti" ref={whyCrostiRef}>
            <div className="whyCrostiContainer">
                <div className='titleWithStickers'>
                    <Image
                        src={t('why.stickerLeft')}
                        alt="Sticker decorativo hoja"
                        width={96}
                        height={96}
                        className='titleSticker titleStickerLeft'
                    />
                    <Title title={t('why.title')} subTitle={t('why.subtitle')} />
                    <Image
                        src={t('why.stickerRight')}
                        alt="Sticker decorativo alcachofa"
                        width={92}
                        height={92}
                        className='titleSticker titleStickerRight'
                    />
                </div>
                <div className='whyCrostiCards'>
                    <WhyCard icon={<FaAward className='whyCardIcon' />} title={t('why.card1Title')} description={t('why.card1Text')} />
                    <WhyCard icon={<FaLeaf className='whyCardIcon' />} title={t('why.card2Title')} description={t('why.card2Text')} />
                    <WhyCard icon={<FaTruck className='whyCardIcon' />} title={t('why.card3Title')} description={t('why.card3Text')} />
                    <WhyCard icon={<FaLeaf className='whyCardIcon' />} title={t('why.card4Title')} description={t('why.card4Text')} />
                    <WhyCard icon={<FaBoxes className='whyCardIcon' />} title={t('why.card5Title')} description={t('why.card5Text')} />
                    <WhyCard icon={<IoPeople className='whyCardIcon' />} title={t('why.card6Title')} description={t('why.card6Text')} />
                </div>
            </div>
        </div>
    )
}
