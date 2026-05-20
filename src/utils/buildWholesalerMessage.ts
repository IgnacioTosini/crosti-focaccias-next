export interface WholesalerFormValues {
    name: string;
    business: string;
    social: string;
    phone: string;
    details: string;
}

export const buildWholesalerMessage = (values: WholesalerFormValues): string => {
    const lines: string[] = [
        '¡Hola Crosti! 👋 Quiero consultar sobre compras mayoristas.',
        '',
        `👤 *Nombre:* ${values.name}`,
    ];

    if (values.business.trim()) {
        lines.push(`🏢 *Negocio/Empresa:* ${values.business}`);
    }
    if (values.social.trim()) {
        lines.push(`📱 *Instagram/Web:* ${values.social}`);
    }

    lines.push(`📞 *Teléfono:* ${values.phone}`);

    if (values.details.trim()) {
        lines.push('', `📝 *Detalles:*`, values.details);
    }

    return lines.join('\n');
};

export const sendWholesalerWhatsApp = (values: WholesalerFormValues): void => {
    const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '';
    const message = buildWholesalerMessage(values);
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${number}?text=${encoded}`, '_blank');
};
