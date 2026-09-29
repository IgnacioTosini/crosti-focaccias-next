'use client';

import { useEffect, useRef } from 'react';
import { ConnectCard } from '../ConnectCard/ConnectCard'
import { animateConnectUs } from '@/animations';
import Image from 'next/image';
import './_connectUs.scss'
import { usePageText } from '@/components/content/PageContentProvider';

export const ConnectUs = () => {
  const t = usePageText();
  const connectUsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = animateConnectUs(connectUsRef.current ?? undefined);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div className='connectUs' ref={connectUsRef}>
      <div className='connectUsTitleWrap'>
        <Image
          src={t('contact.character')}
          alt='Crosti con lentes'
          width={90}
          height={90}
          className='connectCharacter'
        />
        <h2 className='connectUsTitle'>{t('contact.title')}</h2>
        <Image
          src={t('contact.sticker')}
          alt='Sticker decorativo hierbas'
          width={76}
          height={76}
          className='connectSticker'
        />
      </div>
      <div className='connectCardsContainer'>
        <ConnectCard title={t('contact.whatsappTitle')} description={t('contact.whatsappDescription')} iconUrl='WhatsApp' />
        <ConnectCard title={t('contact.instagramTitle')} description={t('contact.instagramDescription')} iconUrl='Instagram' link='https://www.instagram.com/crosti.focaccias' />
        <ConnectCard title={t('contact.locationTitle')} description={t('contact.locationDescription')} iconUrl='Map' />
      </div>
    </div>
  )
}
