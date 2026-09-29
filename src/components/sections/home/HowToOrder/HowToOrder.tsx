'use client';

import { useEffect, useRef } from 'react';
import { FiMessageCircle, FiShoppingBag } from 'react-icons/fi'
import { FaMapMarkerAlt, FaRegCalendarCheck } from 'react-icons/fa'
import { animateHowToOrder } from '@/animations';
import Image from 'next/image';
import './_howToOrder.scss'
import { usePageText } from '@/components/content/PageContentProvider';

export const HowToOrder = () => {
  const t = usePageText();
  const icons = [<FiShoppingBag key='menu' className='stepIcon stepIconMenu' />, <FiMessageCircle key='contact' className='stepIcon stepIconContact' />, <FaMapMarkerAlt key='map' className='stepIcon stepIconMap' />];
  const steps = icons.map((icon, index) => ({
    number: `0${index + 1}`, icon,
    title: t(`order.step${index + 1}Title`),
    details: [t(`order.step${index + 1}Line1`), t(`order.step${index + 1}Line2`)],
  }));
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
          src={t('order.stickerLeft')}
          alt='Sticker decorativo ajo'
          width={74}
          height={74}
          className='titleSticker titleStickerLeft'
        />
        <h2 className='howToOrderTitle'>{t('order.title')}</h2>
        <Image
          src={t('order.stickerRight')}
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
              {step.details.map((detail, index) => (
                <p className='stepDescription' key={index}>{detail}</p>
              ))}
            </div>
          </article>
        ))}
      </div>
      <div className='howToOrderNote'>
        <FaRegCalendarCheck />
        <span>{t('order.note')}</span>
      </div>
    </div>
  )
}
