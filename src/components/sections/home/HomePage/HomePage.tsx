import { AboutUs } from '../AboutUs/AboutUs'
import { Banner } from '../Banner/Banner'
import { ConnectUs } from '../ConnectUs/ConnectUs'
import { Header } from '../Header/Header'
import { HowToOrder } from '../HowToOrder/HowToOrder'
import { Chatbot } from '../Chatbot/Chatbot';
import { ScrollLock } from '@/components/shared/ScrollLock/ScrollLock';
import type { FocacciaItem } from '@/types';
import OurMenu from '../../focaccias/OurMenu/OurMenu';
import { CartUI } from '../../cart/CartUI/CartUI'
import { Footer } from '../Footer/Footer'
import './_homePage.scss'

interface HomePageProps {
    initialFocaccias?: FocacciaItem[];
}

export const HomePage = ({ initialFocaccias }: HomePageProps) => {
    return (
        <main className="homePage">
            <ScrollLock />

            <Header />
            <Banner />

            <section id="sobre-nosotros">
                <AboutUs />
            </section>

            <section id="menu">
                <OurMenu initialFocaccias={initialFocaccias} />
            </section>

            <section id="como-ordenar">
                <HowToOrder />
            </section>

            <section id="contacto">
                <ConnectUs />
            </section>

            <CartUI />
            <Chatbot />
            <Footer />
        </main>
    );
};
