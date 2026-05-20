'use client';

import { FaInstagram, FaWhatsapp } from 'react-icons/fa'
import { BiHeart } from 'react-icons/bi'
import { handleInstagramClick, handleWhatsAppClick } from '@/utils'
import Image from 'next/image'
import './_footer.scss'

export const Footer = () => {
  return (
    <div className='footer'>
      <div className='footerTop'>
        <picture className='footerLogo'>
          <Image src="/personajes/crosti-logo.svg" alt="Logo de Crosti" width={90} height={100} />
          <figcaption>Crosti Focaccias</figcaption>
        </picture>
        <div className='footerLinks'>
          <FaInstagram className='footerIcon instagram' onClick={handleInstagramClick} />
          <FaWhatsapp className='footerIcon whatsapp' onClick={handleWhatsAppClick} />
        </div>
        <p className='footerCredit'>Hecho con amor en Mar del Plata <BiHeart className='heartIcon' /></p>
      </div>
      <div className='footerBottom'>
        <p>© {new Date().getFullYear()} Crosti Focaccias. Todos los derechos reservados.</p>
        <span>Creado por Ignacio Tosini</span>
      </div>
    </div>
  )
}
