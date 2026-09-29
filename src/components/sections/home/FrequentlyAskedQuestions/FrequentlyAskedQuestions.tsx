'use client';

import Image from 'next/image';
import { FaChevronDown, FaWhatsapp } from 'react-icons/fa';
import { handleWhatsAppClick } from '@/utils';
import './_frequentlyAskedQuestions.scss';
import { usePageText } from '@/components/content/PageContentProvider';

export const FrequentlyAskedQuestions = () => {
    const t = usePageText();
    return (
    <div className='frequentlyAskedQuestions'>
        <div className='faqIntro'>
            <span className='faqEyebrow'>{t('faq.eyebrow')}</span>
            <h2>{t('faq.title')}</h2>
            <p>{t('faq.description')}</p>
            <Image
                src={t('faq.image')}
                alt='Crosti, personaje de la marca'
                width={190}
                height={190}
                className='faqCharacter'
            />
        </div>

        <div className='faqContent'>
            <div className='faqList'>
                {[1, 2, 3, 4, 5, 6].map((number) => (
                    <details className='faqItem' key={number}>
                        <summary>
                            <span>{t(`faq.question${number}`)}</span>
                            <FaChevronDown aria-hidden='true' />
                        </summary>
                        <div className='faqAnswer'><p>{t(`faq.answer${number}`)}</p></div>
                    </details>
                ))}
            </div>

            <div className='faqContact'>
                <div>
                    <strong>{t('faq.contactTitle')}</strong>
                    <p>{t('faq.contactDescription')}</p>
                </div>
                <button type='button' onClick={handleWhatsAppClick}>
                    <FaWhatsapp aria-hidden='true' /> {t('faq.contactButton')}
                </button>
            </div>
        </div>
    </div>
    );
};
