"use client";

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
                    <span className='badge'>🏢 Ventas Mayoristas</span>
                    <h1 className='title'>Focaccias artesanales <span>para negocios</span></h1>
                    <p className='description'>Trabajamos con cafeterías, eventos y comercios que buscan productos de calidad artesanal, con identidad y sabor real.</p>
                    <div className='heroStats' aria-label='Datos de servicio mayorista'>
                        <div>
                            <strong>Fresco</strong>
                            <span>producción a pedido</span>
                        </div>
                        <div>
                            <strong>Flexible</strong>
                            <span>volumen según demanda</span>
                        </div>
                        <div>
                            <strong>Directo</strong>
                            <span>trato sin intermediarios</span>
                        </div>
                    </div>
                    <div className='placesList'>
                        <PlaceCard icon="☕" label="Cafeterías" />
                        <PlaceCard icon="🎉" label="Eventos" />
                        <PlaceCard icon="🏪" label="Comercios" />
                        <PlaceCard icon="🍽️" label="Restaurantes" />
                        <PlaceCard icon="🍴" label="Catering" />
                    </div>
                    <div className='buttonsContainer'>
                        <Link href="#contacto" className='primaryWholesalerButton'><IoIosSend className='icon'/>Consultar ahora</Link>
                        <Link href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ''}`} className='secondaryWholesalerButton'><BsWhatsapp className='icon'/>WhatsApp directo</Link>
                    </div>
                </div>
                <div className='heroMedia'>
                    <Image
                        src="/wholesalers/HeroImage.webp"
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
                            <h3>Calidad garantizada</h3>
                            <p>Masa madre · Ingredientes frescos · Hecho en el día</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
