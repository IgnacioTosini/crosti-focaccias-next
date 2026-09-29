'use client';

import { useEffect, useRef } from 'react';
import { IoLeafSharp } from 'react-icons/io5'
import { animateAboutUs } from '@/animations'
import './_aboutUs.scss'
import Image from 'next/image';
import { usePageText } from '@/components/content/PageContentProvider';

export const AboutUs = () => {
  const t = usePageText();
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
        <h2 className='aboutUsTitle'>{t('about.title')}</h2>
        <div className='aboutUsCharacterFloat'>
          <Image src={t('about.character')} alt='Crosti' width={80} height={80} />
        </div>
      </div>
      <div className='textImageContainer'>
        <div className='textContainer'>
          <span className='aboutUsKicker'>{t('about.eyebrow')}</span>
          <p className='aboutUsText'>{t('about.paragraph1')}</p>
          <p className='aboutUsText'>{t('about.paragraph2')}</p>

          <div className='aboutUsHighlights'>
            <span className='aboutUsText leafText'><IoLeafSharp className='leaf' />{t('about.veggie')}</span>
            <span className='aboutUsText doughText'>{t('about.dough')}</span>
          </div>
        </div>
        <figure className='imageContainer'>
          <Image
            src={t('about.image')}
            alt='Crosti, personaje de la marca'
            width={340}
            height={420}
            className='aboutUsCharacter'
          />
          <figcaption className='aboutUsText'>{t('about.caption')}</figcaption>
        </figure>
      </div>
    </div>
  )
}
