'use client';

import { useEffect, useRef } from 'react';
import { IoCartOutline } from 'react-icons/io5';
import { animateHeader } from '@/animations';
import Image from 'next/image';
import { useCartStore } from '@/store/cart.store';
import Link from 'next/link';
import './_header.scss'

export const Header = () => {
  const headerRef = useRef<HTMLDivElement>(null);
  const { quantity, totalPrice, setIsOrderOpen } = useCartStore();
  const preOrder = {
    quantity,
    totalPrice,
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
        <Link href="/" className='logoText' scroll={false} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <h1>Crosti</h1>
        </Link>
      </div>
      <nav className='navLinks'>
        <ul>
          <li><Link href="#sobre-nosotros">Sobre nosotros</Link></li>
          <li><Link href="#menu">Menú</Link></li>
          <li><Link href="#contacto">Contacto</Link></li>
        </ul>
        <div className='buttonsContainer'>
        <Link href='/wholesalers' className='wholesalersButton'>🏢 Mayoristas</Link>
          <button className='primaryButton' onClick={() => setIsOrderOpen(true)}><IoCartOutline /><span>Carrito</span><span>{preOrder.quantity}</span></button>
        </div>
      </nav>
    </div>
  )
}
