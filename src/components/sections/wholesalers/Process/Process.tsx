import { Title } from '@/components/shared/Title/Title';
import { StepCard } from '../StepCard/StepCard';
import Image from 'next/image';
import './_process.scss';

export const Process = () => {
    const steps = [
        {
            stepNumber: 1,
            title: 'Contacto',
            description: 'Completa el formulario o escribinos por WhatsApp con los datos de tu negocio.'
        },
        {
            stepNumber: 2,
            title: 'Definir cantidades',
            description: 'Te asesoramos sobre variedades, volumenes y precios segun tus necesidades.'
        },
        {
            stepNumber: 3,
            title: 'Coordinación',
            description: 'Acordamos días, horarios y modalidad de entrega o retiro.'
        },
        {
            stepNumber: 4,
            title: 'Producción y envío',
            description: 'Producimos fresco y entregamos puntual para que tu negocio brille.'
        },
    ];

    return (
        <div className="processSection">
            <div className="processContainer">
                <div className='titleWithStickers'>
                    <Image
                        src="/stickersAdicionales/garlic-clove.png"
                        alt="Sticker decorativo ajo"
                        width={92}
                        height={92}
                        className='titleSticker titleStickerLeft'
                    />
                    <Title title="El proceso" subTitle="Cómo funciona" />
                    <Image
                        src="/stickersAdicionales/onion-rings.png"
                        alt="Sticker decorativo cebolla"
                        width={88}
                        height={88}
                        className='titleSticker titleStickerRight'
                    />
                </div>
                <div className="processSteps">
                    {steps.map((step) => (
                        <StepCard
                            key={step.stepNumber}
                            stepNumber={step.stepNumber}
                            title={step.title}
                            description={step.description}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
