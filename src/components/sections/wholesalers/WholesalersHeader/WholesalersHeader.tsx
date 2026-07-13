'use client';

import { useEffect, useRef } from 'react';
import { animateWholesalersHeader } from '@/animations';
import Image from 'next/image';
import Link from 'next/link';
import './_wholesalersHeader.scss'

export const WholesalersHeader = () => {
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
        <Image src="/personajes/crosti-logo.svg" alt="Crosti Logo" width={50} height={50} priority />
        <Link className='logoText' href='/'>
          <h1>Crosti</h1>
        </Link>
      </div>
      <nav className='navLinks'>
        <ul>
          <li><Link className="adminHeaderButton" href="/">Volver al sitio</Link></li>
          <li><Link href="/wholesalers/#contacto">Contacto</Link></li>
        </ul>
      </nav>
    </header>
  )
}
