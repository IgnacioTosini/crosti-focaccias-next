import { FaInstagram, FaMapMarkerAlt, FaWhatsapp } from 'react-icons/fa';
import { handleWhatsAppClick } from '@/utils';
import './_connectCard.scss';

type ConnectCardProps = {
    title: string;
    description: string;
    link?: string;
    iconUrl: string;
}

export const ConnectCard = ({ title, description, iconUrl, link }: ConnectCardProps) => {
    const iconMap = {
        'WhatsApp': <FaWhatsapp className='connectCardIcon whatsappIcon' />,
        'Instagram': <FaInstagram className='connectCardIcon instagramIcon' />,
        'Map': <FaMapMarkerAlt className='connectCardIcon mapIcon' />,
    };
    const isWhatsApp = iconUrl === 'WhatsApp';
    const cardClassName = `connectCard connectCard${iconUrl}`;
    const actionClassName = iconUrl ? `connectCardDescription ${iconUrl}` : 'connectCardDescription';

    return (
        <article className={cardClassName}>
            <div className='connectCardIcon'>
                {iconMap[iconUrl as keyof typeof iconMap]}
            </div>
            <h3 className='connectCardTitle'>{title}</h3>
            {isWhatsApp ? (
                <button type='button' className={actionClassName} onClick={handleWhatsAppClick}>{description}</button>
            ) : link ? (
                <a href={link} target='_blank' rel='noreferrer' className={actionClassName}>{description}</a>
            ) : (
                <p className='connectCardDescription'>{description}</p>
            )}
        </article>
    )
}
