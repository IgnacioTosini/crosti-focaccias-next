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
    <div className="banner" ref={bannerRef}>
      <div className="bannerContainer">
        <Image
          src="/personajes/crosti-logo.svg"
          alt="Banner de focaccias"
          fill
          priority
          className="bannerImage"
        />
      </div>
      <div className="bannerText">
        <Image
          src="/stickersAdicionales/cherry-tomatoes.png"
          alt="Sticker decorativo tomates"
          width={76}
          height={76}
          className="bannerSticker bannerStickerLeft"
        />
        <h1 className="bannerTitle">La ola de sabor en
          <span>La Feliz 🌊</span>
        </h1>
        <Image
          src="/stickersAdicionales/focaccia-piece.png"
          alt="Sticker decorativo focaccia"
          width={76}
          height={76}
          className="bannerSticker bannerStickerRight"
        />
        <p className="bannerSubtitle">Focaccias caseras hechas en el día</p>
      </div>
      <div className='buttonsContainer'>
        <button className='menuButton'><a href="#menu"><IoCartOutline /><span>Ver Menú</span></a></button>
        <button className='whatsappButton' onClick={handleWhatsAppClick}><IoLogoWhatsapp /><span>WhatsApp</span></button>
      </div>
    </div>
  )
}
