'use client';

import { FaInstagram, FaWhatsapp } from 'react-icons/fa'
import { BiHeart } from 'react-icons/bi'
import { handleInstagramClick, handleWhatsAppClick } from '@/utils'
import Image from 'next/image'
import './_footer.scss'

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='footer'>
      <div className='footerTop'>
        <div className='footerBrand'>
          <Image src="/personajes/crosti-logo.svg" alt="Logo de Crosti" width={72} height={72} />
          <div className='footerBrandText'>
            <p>Crosti Focaccias</p>
            <span>Artesanales en Mar del Plata</span>
          </div>
        </div>

        <p className='footerCredit'>Hecho con amor en Mar del Plata <BiHeart className='heartIcon' /></p>

        <div className='footerLinks'>
          <button type='button' className='footerSocial instagram' onClick={handleInstagramClick} aria-label='Abrir Instagram de Crosti'>
            <FaInstagram className='footerIcon' />
          </button>
          <button type='button' className='footerSocial whatsapp' onClick={handleWhatsAppClick} aria-label='Enviar WhatsApp a Crosti'>
            <FaWhatsapp className='footerIcon' />
          </button>
        </div>
      </div>
      <div className='footerBottom'>
        <p>© {currentYear} Crosti Focaccias. Todos los derechos reservados.</p>
        <span>Creado por Ignacio Tosini</span>
      </div>
    </footer>
  )
}
