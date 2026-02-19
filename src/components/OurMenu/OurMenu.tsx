import { OurMenuClient } from './OurMenuClient/OurMenuClient'

async function getFocacciasServer() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/focaccias`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Error fetching focaccias');
  }

  return res.json();
}

export default async function OurMenu() {
  const data = await getFocacciasServer();

  return <OurMenuClient initialData={data.data} />;
}
