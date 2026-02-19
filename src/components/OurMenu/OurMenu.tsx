import { OurMenuClient } from './OurMenuClient/OurMenuClient'

async function getFocacciasServer() {
  const res = await fetch('http://localhost:8080/api/focaccias', {
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
