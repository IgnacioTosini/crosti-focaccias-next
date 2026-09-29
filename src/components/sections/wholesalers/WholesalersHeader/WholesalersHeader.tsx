'use client';

import { usePageText } from '@/components/content/PageContentProvider';
import { useEffect, useRef } from 'react';
import { animateWholesalersHeader } from '@/animations';
import Image from 'next/image';
import Link from 'next/link';
import './_wholesalersHeader.scss'

export const WholesalersHeader = () => {
    const t = usePageText();
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = animateWholesalersHeader(headerRef.current ?? undefined);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <header className='wholesalersHeader' ref={headerRef}>
      <div className='logoContainer'>
        <Image src={t('nav.logo')} alt="Crosti Logo" width={50} height={50} priority />
        <Link className='logoText' href='/'>
          <h1>Crosti</h1>
        </Link>
      </div>
      <nav className='navLinks'>
        <ul>
          <li><Link className="adminHeaderButton" href="/">{t('nav.back')}</Link></li>
          <li><Link href="#contacto">{t('nav.contact')}</Link></li>
        </ul>
      </nav>
    </header>
  )
}
