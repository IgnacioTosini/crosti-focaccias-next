import { Title } from '@/components/shared/Title/Title';
import { WhyCard } from '../WhyCard/WhyCard';
import { FaAward, FaBoxes, FaLeaf, FaTruck } from 'react-icons/fa';
import { IoPeople } from 'react-icons/io5';
import Image from 'next/image';
import './_whyCrosti.scss';

export const WhyCrosti = () => {
    return (
        <div className="whyCrosti">
            <div className="whyCrostiContainer">
                <div className='titleWithStickers'>
                    <Image
                        src="/stickersAdicionales/vine-leaf.png"
                        alt="Sticker decorativo hoja"
                        width={96}
                        height={96}
                        className='titleSticker titleStickerLeft'
                    />
                    <Title title="¿Por qué elegir Crosti?" subTitle="Lo que nos hace diferentes" />
                    <Image
                        src="/stickersAdicionales/artichoke.png"
                        alt="Sticker decorativo alcachofa"
                        width={92}
                        height={92}
                        className='titleSticker titleStickerRight'
                    />
                </div>
                <div className='whyCrostiCards'>
                    <WhyCard icon={<FaAward className='whyCardIcon' />} title={'Producción artesanal'} description={'Cada focaccia hecha a mano con masa madre. Calidad que se nota desde la primera mordida.'} />
                    <WhyCard icon={<FaLeaf className='whyCardIcon' />} title={'Ingredientes de calidad'} description={'Seleccionamos ingredientes frescos y de temporada para garantizar el mejor sabor.'} />
                    <WhyCard icon={<FaTruck className='whyCardIcon' />} title={'Entregas programadas'} description={'Coordinamos horarios y frecuencias según las necesidades de tu negocio.'} />
                    <WhyCard icon={<FaLeaf className='whyCardIcon' />} title={'Opciones vegetarianas'} description={'Toda nuestra línea es apta para vegetarianos. Ideal para públicos diversos.'} />
                    <WhyCard icon={<FaBoxes className='whyCardIcon' />} title={'Pedidos personalizados'} description={'Adaptamos las cantidades y variedades a lo que necesita tu negocio.'} />
                    <WhyCard icon={<IoPeople className='whyCardIcon' />} title={'Atención directa'} description={'Trato personal y directo. Sin intermediarios, con respuesta rápida siempre.'} />
                </div>
            </div>
        </div>
    )
}
