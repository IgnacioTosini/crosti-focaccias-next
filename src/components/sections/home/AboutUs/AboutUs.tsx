'use client';

import { useEffect, useRef } from 'react';
import { IoLeafSharp } from 'react-icons/io5'
import { animateAboutUs } from '@/animations'
import './_aboutUs.scss'
import Image from 'next/image';

export const AboutUs = () => {
  const aboutUsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = animateAboutUs(aboutUsRef.current ?? undefined);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div className='aboutUsContainer' ref={aboutUsRef}>
      <div className='aboutUsTitleWrapper'>
        <h2 className='aboutUsTitle'>Sobre Crosti</h2>
        <div className='aboutUsCharacterFloat'>
          <Image src='/personajes/crosti-original.svg' alt='Crosti' width={80} height={80} />
        </div>
      </div>
      <div className='textImageContainer'>
        <div className='textContainer'>
          <p className='aboutUsText'>Crosti nació del amor por la cocina artesanal y la pasión por crear momentos especiales alrededor de la mesa. Cada focaccia es preparada con masa madre, ingredientes frescos y el cariño de siempre.</p>
          <p className='aboutUsText'>Desde Mar del Plata, llevamos el sabor auténtico de Italia a tu hogar, con opciones que cuidan tanto el paladar como las preferencias de cada familia.</p>

          <span className='aboutUsText leafText'><IoLeafSharp className='leaf'/>100% opciones veggie disponibles</span>
        </div>
        <picture className='imageContainer'>
          <Image src='/LogoCrosti.png' alt='Logo de Crosti' width={100} height={150} />
          <span className='aboutUsText'>Hecho con amor y tradición</span>
        </picture>
      </div>
    </div>
  )
}
