'use client';

import { useEffect, useRef } from 'react';
import { ConnectCard } from '../ConnectCard/ConnectCard'
import { animateConnectUs } from '@/animations';
import Image from 'next/image';
import './_connectUs.scss'

export const ConnectUs = () => {
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
          src='/personajes/crosti-lentes-de-sol.svg'
          alt='Crosti con lentes'
          width={90}
          height={90}
          className='connectCharacter'
        />
        <h2 className='connectUsTitle'>¡Conectemos!</h2>
        <Image
          src='/stickersAdicionales/herb-sprigs.png'
          alt='Sticker decorativo hierbas'
          width={76}
          height={76}
          className='connectSticker'
        />
      </div>
      <div className='connectCardsContainer'>
        <ConnectCard title='WhatsApp' description='Enviar mensaje' iconUrl='WhatsApp' link='https://wa.me/1234567890' />
        <ConnectCard title='Instagram' description='@crosti.focaccias' iconUrl='Instagram' link='https://www.instagram.com/crosti.focaccias' />
        <ConnectCard title='Ubicación' description='Mar del Plata' iconUrl='Map' />
      </div>
    </div>
  )
}
