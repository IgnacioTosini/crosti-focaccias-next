import { WholesalersPageContent } from '@/components/sections/wholesalers/WholesalersPageContent';
import { PageContentProvider } from '@/components/content/PageContentProvider';
import { getPublishedContent } from '@/services/SiteContentService';

export default async function WholesalersPage() {
    const values = await getPublishedContent('wholesalers');
    return (
        <PageContentProvider page='wholesalers' values={values}><WholesalersPageContent /></PageContentProvider>
    );
}
