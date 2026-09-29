'use client';

import { FaInstagram, FaWhatsapp } from 'react-icons/fa'
import { BiHeart } from 'react-icons/bi'
import { handleInstagramClick, handleWhatsAppClick } from '@/utils'
import Image from 'next/image'
import './_footer.scss'
import { usePageText } from '@/components/content/PageContentProvider';

export const Footer = () => {
  const t = usePageText();
  const currentYear = new Date().getFullYear();

  return (
    <footer className='footer'>
      <div className='footerTop'>
        <div className='footerBrand'>
          <Image src={t('footer.logo')} alt="Logo de Crosti" width={72} height={72} />
          <div className='footerBrandText'>
            <p>{t('footer.brand')}</p>
            <span>{t('footer.tagline')}</span>
          </div>
        </div>

        <p className='footerCredit'>{t('footer.credit')} <BiHeart className='heartIcon' /></p>

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
        <p>© {currentYear} {t('footer.copyright')}</p>
        <span>Creado por Ignacio Tosini</span>
      </div>
    </footer>
  )
}
