'use client';

import { useEffect } from 'react';
import { IoCartOutline } from 'react-icons/io5';
import { animateHeader } from '../../animations';
import Image from 'next/image';
import { useCartStore } from '@/store/cart.store';
import './_header.scss'

export const Header = () => {
  const { pedidoFocaccias, quantity, totalPrice, setIsOrderOpen } = useCartStore();
  const preOrder = {
    pedidoFocaccias,
    quantity,
    totalPrice,
  };

  useEffect(() => {
    animateHeader();
  }, []);

  return (
    <div className='header'>
      <div className='logoContainer'>
        <Image src="/LogoCrosti.png" alt="Crosti Logo" width={50} height={50} />
        <button className='logoText' onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <h1>Crosti</h1>
        </button>
      </div>
      <nav className='navLinks'>
        <ul>
          <li><a href="#sobre-nosotros">Sobre nosotros</a></li>
          <li><a href="#menu">Menú</a></li>
          <li><a href="#contacto">Contacto</a></li>
        </ul>
        <div className='buttonsContainer'>
          <button className='primaryButton' onClick={() => setIsOrderOpen(true)}><IoCartOutline /><span>Carrito</span><span>{preOrder.quantity}</span></button>
        </div>
      </nav>
    </div>
  )
}
