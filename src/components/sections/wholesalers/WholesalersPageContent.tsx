import { Footer } from '@/components/sections/home/Footer/Footer';
import { Hero, Process, WholesalersContact, WholesalersHeader, WhyCrosti } from './index';
import './_wholesalersPage.scss';

export function WholesalersPageContent() {
    return <div className='wholesalersPage'><WholesalersHeader /><Hero /><WhyCrosti /><Process /><WholesalersContact /><Footer /></div>;
}
