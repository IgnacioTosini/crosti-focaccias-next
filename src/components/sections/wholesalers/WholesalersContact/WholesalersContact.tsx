"use client";

import { useEffect, useRef } from 'react';
import { Title } from '@/components/shared/Title/Title'
import { WholesalersForm } from '../WholesalersForm/WholesalersForm'
import Image from 'next/image'
import { animateWholesalersContact } from '@/animations';
import './_wholesalersContact.scss'

export const WholesalersContact = () => {
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
                        src="/stickersAdicionales/cherry-tomatoes.png"
                        alt="Sticker decorativo tomates"
                        width={92}
                        height={92}
                        className='titleSticker titleStickerLeft'
                    />
                    <Title title={'Contacto mayorista'} subTitle='Hablemos de tu negocio' />
                    <Image
                        src="/stickersAdicionales/cheese-wedge.png"
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
