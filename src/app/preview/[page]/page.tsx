import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { isContentPage } from '@/lib/siteContent';
import { ContentPreview } from '@/components/content/ContentPreview';
import { getServerFocaccias } from '@/services/FocacciaServerService';

export const metadata: Metadata = { title: 'Vista previa', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function PreviewPage({ params }: { params: Promise<{ page: string }> }) {
    if ((await cookies()).get('admin-session')?.value !== 'true') redirect('/?error=unauthorized');
    const { page } = await params;
    if (!isContentPage(page)) notFound();
    const focaccias = page === 'home' ? await getServerFocaccias() : undefined;
    return <ContentPreview page={page} initialFocaccias={focaccias} />;
}
