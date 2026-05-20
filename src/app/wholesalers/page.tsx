import { Footer } from "@/components/sections/home/Footer/Footer";
import { Hero, Process, WholesalersContact, WholesalersHeader, WhyCrosti } from "@/components/sections/wholesalers";

export default function WholesalersPage() {
    return (
        <div>
            <WholesalersHeader />
            <Hero />
            <WhyCrosti />
            <Process />
            {/* <OurMenu /> */}
            <WholesalersContact />
            <Footer />
        </div>
    );
}