"use client";

import { usePageText } from '@/components/content/PageContentProvider';
import { useEffect, useRef } from 'react';
import { Title } from '@/components/shared/Title/Title'
import { WholesalersForm } from '../WholesalersForm/WholesalersForm'
import Image from 'next/image'
import { animateWholesalersContact } from '@/animations';
import './_wholesalersContact.scss'

export const WholesalersContact = () => {
    const t = usePageText();
    const wholesalersContactRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const ctx = animateWholesalersContact(wholesalersContactRef.current ?? undefined);

        return () => {
            ctx.revert();
        };
    }, []);

    return (
        <section className="wholesalersContact" id="contacto" ref={wholesalersContactRef}>
            <div className="wholesalersContactContainer">
                <div className='titleWithStickers'>
                    <Image
                        src={t('contact.stickerLeft')}
                        alt="Sticker decorativo tomates"
                        width={92}
                        height={92}
                        className='titleSticker titleStickerLeft'
                    />
                    <Title title={t('contact.title')} subTitle={t('contact.subtitle')} />
                    <Image
                        src={t('contact.stickerRight')}
                        alt="Sticker decorativo queso"
                        width={90}
                        height={90}
                        className='titleSticker titleStickerRight'
                    />
                </div>
                <WholesalersForm />
            </div>
        </section>
    )
}
