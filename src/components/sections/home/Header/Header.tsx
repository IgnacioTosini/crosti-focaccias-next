'use client';

import { useEffect, useRef, useState } from 'react';
import { IoBusinessOutline, IoCartOutline, IoClose, IoMenu } from 'react-icons/io5';
import { animateHeader } from '@/animations';
import Image from 'next/image';
import { useCartStore } from '@/store/cart.store';
import Link from 'next/link';
import './_header.scss'
import { usePageText } from '@/components/content/PageContentProvider';

export const Header = () => {
  const t = usePageText();
  const headerRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className={`siteHeader ${isMenuOpen ? 'isMenuOpen' : ''}`} ref={headerRef}>
      <div className='siteHeaderInner'>
        <div className='logoContainer'>
          <Image src={t('nav.logo')} alt="Crosti Logo" width={44} height={44} priority />
          <Link
            href="/"
            className='logoText'
            scroll={false}
            onClick={() => {
              closeMenu();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <h1>Crosti</h1>
          </Link>
        </div>

        <button
          className='mobileMenuButton'
          type='button'
          aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={isMenuOpen}
          aria-controls='main-navigation'
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          {isMenuOpen ? <IoClose /> : <IoMenu />}
        </button>

        <nav className='navLinks' id='main-navigation' aria-label='Navegación principal'>
          <ul>
            <li><Link href="#sobre-nosotros" onClick={closeMenu}>{t('nav.about')}</Link></li>
            <li><Link href="#menu" onClick={closeMenu}>{t('nav.menu')}</Link></li>
            <li><Link href="#preguntas-frecuentes" onClick={closeMenu}>{t('nav.faq')}</Link></li>
            <li><Link href="#contacto" onClick={closeMenu}>{t('nav.contact')}</Link></li>
          </ul>
          <div className='buttonsContainer'>
            <Link href='/wholesalers' className='wholesalersButton' onClick={closeMenu}>
              <IoBusinessOutline />
              <span>{t('nav.wholesalers')}</span>
            </Link>
            <button
              className='primaryButton'
              type='button'
              onClick={() => {
                closeMenu();
                setIsOrderOpen(true);
              }}
            >
              <IoCartOutline />
              <span>{t('nav.cart')}</span>
              <span className='cartBadge'>{preOrder.quantity}</span>
            </button>
          </div>
        </nav>
      </div>
    </header>
  )
}
