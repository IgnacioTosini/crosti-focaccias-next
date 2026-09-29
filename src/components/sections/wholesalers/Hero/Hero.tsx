"use client";

import { usePageText } from '@/components/content/PageContentProvider';
import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { PlaceCard } from '../PlaceCard/PlaceCard'
import Image from 'next/image'
import { MdOutlineStarOutline } from "react-icons/md";
import { IoIosSend } from "react-icons/io";
import { BsWhatsapp } from "react-icons/bs";
import { animateWholesalersHero } from '@/animations';
import './_hero.scss';

export const Hero = () => {
    const t = usePageText();
    const heroRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = animateWholesalersHero(heroRef.current ?? undefined);

        return () => {
            ctx.revert();
        };
    }, []);

    return (
        <div className="wholesalersHero" ref={heroRef}>
            <div className='contentContainer'>
                <div className='contentLeft'>
                    <span className='badge'>{t('hero.badge')}</span>
                    <h1 className='title'>{t('hero.title')} <span>{t('hero.highlight')}</span></h1>
                    <p className='description'>{t('hero.description')}</p>
                    <div className='heroStats' aria-label='Datos de servicio mayorista'>
                        <div>
                            <strong>{t('hero.stat1Title')}</strong>
                            <span>{t('hero.stat1Text')}</span>
                        </div>
                        <div>
                            <strong>{t('hero.stat2Title')}</strong>
                            <span>{t('hero.stat2Text')}</span>
                        </div>
                        <div>
                            <strong>{t('hero.stat3Title')}</strong>
                            <span>{t('hero.stat3Text')}</span>
                        </div>
                    </div>
                    <div className='placesList'>
                        <PlaceCard icon="☕" label={t('hero.place1')} />
                        <PlaceCard icon="🎉" label={t('hero.place2')} />
                        <PlaceCard icon="🏪" label={t('hero.place3')} />
                        <PlaceCard icon="🍽️" label={t('hero.place4')} />
                        <PlaceCard icon="🍴" label={t('hero.place5')} />
                    </div>
                    <div className='buttonsContainer'>
                        <Link href="#contacto" className='primaryWholesalerButton'><IoIosSend className='icon'/>{t('hero.contactButton')}</Link>
                        <Link href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ''}`} className='secondaryWholesalerButton'><BsWhatsapp className='icon'/>{t('hero.whatsappButton')}</Link>
                    </div>
                </div>
                <div className='heroMedia'>
                    <Image
                        src={t('hero.image')}
                        alt="Crosti Mayorista"
                        width={550}
                        height={420}
                        className='heroImage'
                        priority
                        fetchPriority='high'
                        sizes='(max-width: 768px) 100vw, 550px'
                    />
                    <div className='qualityBadgeContainer'>
                        <MdOutlineStarOutline />
                        <div className='qualityBadge'>
                            <h3>{t('hero.qualityTitle')}</h3>
                            <p>{t('hero.qualityText')}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
