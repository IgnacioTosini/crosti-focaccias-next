'use client';

import { useEffect, useRef } from 'react';
import { FiMessageCircle, FiShoppingBag } from 'react-icons/fi'
import { FaMapMarkerAlt, FaRegCalendarCheck } from 'react-icons/fa'
import { animateHowToOrder } from '@/animations';
import Image from 'next/image';
import './_howToOrder.scss'

const steps = [
  {
    number: '01',
    title: 'Elegí',
    icon: <FiShoppingBag className='stepIcon stepIconMenu' />,
    details: ['Revisá sabores, tamaños y combos.', 'Agregá al carrito lo que querés compartir.'],
  },
  {
    number: '02',
    title: 'Confirmá',
    icon: <FiMessageCircle className='stepIcon stepIconContact' />,
    details: ['Enviá el pedido por WhatsApp.', 'Lo tomamos con anticipación para el finde.'],
  },
  {
    number: '03',
    title: 'Coordiná',
    icon: <FaMapMarkerAlt className='stepIcon stepIconMap' />,
    details: ['Entrega en zonas de Mar del Plata.', 'También podés retirar y elegir medio de pago.'],
  },
];

export const HowToOrder = () => {
  const howToOrderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = animateHowToOrder(howToOrderRef.current ?? undefined);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div className='howToOrder' ref={howToOrderRef}>
      <div className='howToOrderTitleWrap'>
        <Image
          src='/stickersAdicionales/garlic-clove.png'
          alt='Sticker decorativo ajo'
          width={74}
          height={74}
          className='titleSticker titleStickerLeft'
        />
        <h2 className='howToOrderTitle'>¿Cómo Pedir?</h2>
        <Image
          src='/stickersAdicionales/onion-rings.png'
          alt='Sticker decorativo cebolla'
          width={74}
          height={74}
          className='titleSticker titleStickerRight'
        />
      </div>
      <div className='howToOrderSteps'>
        {steps.map((step) => (
          <article className='step' key={step.number}>
            <div className='stepMarker'>{step.number}</div>
            <div className='stepIconWrap'>{step.icon}</div>
            <div className='stepContent'>
              <h3 className='stepTitle'>{step.title}</h3>
              {step.details.map((detail) => (
                <p className='stepDescription' key={detail}>{detail}</p>
              ))}
            </div>
          </article>
        ))}
      </div>
      <div className='howToOrderNote'>
        <FaRegCalendarCheck />
        <span>Los pedidos se coordinan con anticipación para que salga todo fresco.</span>
      </div>
    </div>
  )
}
