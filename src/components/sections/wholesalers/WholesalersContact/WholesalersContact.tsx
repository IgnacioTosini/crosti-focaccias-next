import { Title } from '@/components/shared/Title/Title'
import { WholesalersForm } from '../WholesalersForm/WholesalersForm'
import Image from 'next/image'
import './_wholesalersContact.scss'

export const WholesalersContact = () => {
    return (
        <section className="wholesalersContact" id="contacto">
            <div className="wholesalersContactContainer">
                <div className='titleWithStickers'>
                    <Image
                        src="/stickersAdicionales/cherry-tomatoes.png"
                        alt="Sticker decorativo tomates"
                        width={92}
                        height={92}
                        className='titleSticker titleStickerLeft'
                    />
                    <Title title={'Contacto mayorista'} subTitle='Hablemos de tu negocio' />
                    <Image
                        src="/stickersAdicionales/cheese-wedge.png"
                        alt="Sticker decorativo queso"
                        width={90}
                        height={90}
                        className='titleSticker titleStickerRight'
                    />
                </div>
                <WholesalersForm />
            </div>
        </section>
    )
}
