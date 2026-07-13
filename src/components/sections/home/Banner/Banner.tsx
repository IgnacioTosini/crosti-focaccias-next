'use client';

import { useEffect, useRef } from 'react';
import { IoCartOutline, IoLogoWhatsapp } from 'react-icons/io5'
import { handleWhatsAppClick } from '@/utils'
import { animateBanner } from '@/animations'
import Image from 'next/image';
import './_banner.scss'

export const Banner = () => {
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = animateBanner(bannerRef.current ?? undefined);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section className="banner" ref={bannerRef} aria-label="Crosti Focaccias">
      <div className="bannerContent">
        <div className="bannerText">
          <span className="bannerEyebrow">Focaccias artesanales en Mar del Plata</span>
          <h1 className="bannerTitle">La ola de sabor en
            <span>La Feliz</span>
          </h1>
          <p className="bannerSubtitle">Masa madre, ingredientes frescos y focaccias hechas en el día para compartir sin vueltas.</p>

          <div className='buttonsContainer'>
            <a className='menuButton' href="#menu"><IoCartOutline /><span>Ver menú</span></a>
            <button className='whatsappButton' type='button' onClick={handleWhatsAppClick}><IoLogoWhatsapp /><span>WhatsApp</span></button>
          </div>
        </div>

        <div className="bannerContainer">
          <Image
            src="/wholesalers/HeroImage.webp"
            alt="Focaccias artesanales Crosti recién horneadas"
            fill
            priority
            fetchPriority="high"
            sizes="(max-width: 900px) 100vw, 520px"
            className="bannerImage"
          />
          <Image
            src="/personajes/crosti-original.svg"
            alt="Crosti"
            width={96}
            height={96}
            className="bannerCharacter"
          />
          <Image
            src="/stickersAdicionales/cherry-tomatoes.png"
            alt="Sticker decorativo tomates"
            width={76}
            height={76}
            className="bannerSticker bannerStickerLeft"
          />
          <Image
            src="/stickersAdicionales/focaccia-piece.png"
            alt="Sticker decorativo focaccia"
            width={76}
            height={76}
            className="bannerSticker bannerStickerRight"
          />
        </div>
      </div>
    </section>
  )
}
