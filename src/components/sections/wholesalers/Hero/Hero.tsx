import Link from 'next/link'
import { PlaceCard } from '../PlaceCard/PlaceCard'
import Image from 'next/image'
import { MdOutlineStarOutline } from "react-icons/md";
import { IoIosSend } from "react-icons/io";
import { BsWhatsapp } from "react-icons/bs";
import './_hero.scss';

export const Hero = () => {
    return (
        <div className="wholesalersHero">
            <div className='contentContainer'>
                <div className='contentLeft'>
                    <span className='badge'>🏢 Ventas Mayoristas</span>
                    <h1 className='title'>Focaccias artesanales <span>para negocios</span></h1>
                    <p className='description'>Trabajamos con cafeterías, eventos y comercios que buscan productos de calidad artesanal, con identidad y sabor real.</p>
                    <div className='placesList'>
                        <PlaceCard icon="☕" label="Cafeterías" />
                        <PlaceCard icon="🎉" label="Eventos" />
                        <PlaceCard icon="🏪" label="Comercios" />
                        <PlaceCard icon="🍽️" label="Restaurantes" />
                        <PlaceCard icon="🍴" label="Catering" />
                    </div>
                    <div className='buttonsContainer'>
                        <Link href="#contacto" className='primaryWholesalerButton'><IoIosSend className='icon'/>Consultar ahora</Link>
                        <Link href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`} className='secondaryWholesalerButton'><BsWhatsapp className='icon'/>Whatsapp directo</Link>
                    </div>
                </div>
                <picture>
                    <Image src="/wholesalers/HeroImage.webp" alt="Crosti Mayorista" width={550} height={420} className='heroImage' />
                    <div className='qualityBadgeContainer'>
                        <MdOutlineStarOutline />
                        <div className='qualityBadge'>
                            <h3>Calidad garantizada</h3>
                            <p>Masa madre · Ingredientes frescos · Hecho en el día</p>
                        </div>
                    </div>
                </picture>
            </div>
        </div>
    )
}
