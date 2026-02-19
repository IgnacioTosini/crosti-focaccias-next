export const handleWhatsAppClick = () => {
    window.open(`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ''}`, '_blank');
};

export const handleInstagramClick = () => {
    window.open('https://www.instagram.com/crosti.focaccias', '_blank');
};