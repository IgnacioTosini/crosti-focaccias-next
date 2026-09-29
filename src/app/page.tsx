import { HomePage } from "@/components/sections/home/HomePage/HomePage";
import { UnauthorizedToast } from "@/components/sections/admin/UnauthorizedToast/UnauthorizedToast";
import { getServerFocaccias } from "@/services/FocacciaServerService";
import { getPublishedContent } from '@/services/SiteContentService';
import { PageContentProvider } from '@/components/content/PageContentProvider';

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const [{ error }, initialFocaccias, values] = await Promise.all([
    searchParams,
    getServerFocaccias(),
    getPublishedContent('home'),
  ]);

  return (
    <>
      <PageContentProvider page='home' values={values}><HomePage initialFocaccias={initialFocaccias} /></PageContentProvider>
      <UnauthorizedToast error={error} />
    </>
  );
}
