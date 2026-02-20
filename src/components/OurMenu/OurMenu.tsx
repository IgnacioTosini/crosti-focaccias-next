'use client'

import { useFocaccias } from '@/hooks/focaccia/useFocaccias'
import { OurMenuClient } from './OurMenuClient/OurMenuClient'

export default function OurMenu() {
  const { data, isLoading } = useFocaccias()

  if (isLoading && !data) {
    return <p>Cargando menú...</p>
  }

  return <OurMenuClient initialData={data ?? []} />
}