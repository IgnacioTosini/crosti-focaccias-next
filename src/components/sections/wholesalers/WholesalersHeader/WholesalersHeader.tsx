'use client';

import { useEffect, useRef } from 'react';
import { animateHeader } from '@/animations';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import './_wholesalersHeader.scss'

export const WholesalersHeader = () => {
  const router = useRouter();
  const headerRef = useRef<HTMLDivElement>(null);

  const handleBackToSite = () => {
    router.push('/');
  };

  useEffect(() => {
    const ctx = animateHeader(headerRef.current ?? undefined);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div className='header' ref={headerRef}>
      <div className='logoContainer'>
        <Image src="/personajes/crosti-logo.svg" alt="Crosti Logo" width={50} height={50} />
        <button className='logoText' onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <h1>Crosti</h1>
        </button>
      </div>
      <nav className='navLinks'>
        <ul>
          <li><button className="adminHeaderButton" onClick={handleBackToSite}>Volver al sitio</button></li>
          <li><Link href="/wholesalers/#menu">Ver Menú</Link></li>
          <li><Link href="/wholesalers/#contacto">Contacto</Link></li>
        </ul>
      </nav>
    </div>
  )
}
