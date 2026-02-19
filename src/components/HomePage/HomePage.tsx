import { AboutUs } from '../../components/AboutUs/AboutUs'
import { Banner } from '../../components/Banner/Banner'
import { ConnectUs } from '../../components/ConnectUs/ConnectUs'
import { Header } from '../../components/Header/Header'
import { HowToOrder } from '../../components/HowToOrder/HowToOrder'
import { Chatbot } from '../../components/Chatbot/Chatbot';
import { ScrollLock } from '@/components/ScrollLock/ScrollLock';
import OurMenu from '../OurMenu/OurMenu';
import { CartUI } from '../CartUI/CartUI'
import './_homePage.scss'


export const HomePage = () => {
    return (
        <main className="homePage">
            <ScrollLock />

            <Header />
            <Banner />

            <section id="sobre-nosotros">
                <AboutUs />
            </section>

            <section id="menu">
                <OurMenu />
            </section>

            <section id="como-ordenar">
                <HowToOrder />
            </section>

            <section id="contacto">
                <ConnectUs />
            </section>

            <CartUI />
            <Chatbot />
        </main>
    );
};
