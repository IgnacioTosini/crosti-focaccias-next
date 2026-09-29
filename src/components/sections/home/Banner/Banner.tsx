'use client';

import { useEffect, useRef } from 'react';
import { IoCartOutline, IoLogoWhatsapp } from 'react-icons/io5'
import { handleWhatsAppClick } from '@/utils'
import { animateBanner } from '@/animations'
import Image from 'next/image';
import './_banner.scss'
import { usePageText } from '@/components/content/PageContentProvider';

export const Banner = () => {
  const t = usePageText();
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
          <span className="bannerEyebrow">{t('banner.eyebrow')}</span>
          <h1 className="bannerTitle">{t('banner.title')}
            <span>{t('banner.highlight')}</span>
          </h1>
          <p className="bannerSubtitle">{t('banner.description')}</p>

          <div className='buttonsContainer'>
            <a className='menuButton' href="#menu"><IoCartOutline /><span>{t('banner.menuButton')}</span></a>
            <button className='whatsappButton' type='button' onClick={handleWhatsAppClick}><IoLogoWhatsapp /><span>{t('banner.whatsappButton')}</span></button>
          </div>
        </div>

        <div className="bannerContainer">
          <Image
            src={t('banner.image')}
            alt="Focaccias artesanales Crosti recién horneadas"
            fill
            priority
            fetchPriority="high"
            sizes="(max-width: 900px) 100vw, 520px"
            className="bannerImage"
          />
          <Image
            src={t('banner.character')}
            alt="Crosti"
            width={96}
            height={96}
            className="bannerCharacter"
          />
          <Image
            src={t('banner.stickerLeft')}
            alt="Sticker decorativo tomates"
            width={76}
            height={76}
            className="bannerSticker bannerStickerLeft"
          />
          <Image
            src={t('banner.stickerRight')}
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
