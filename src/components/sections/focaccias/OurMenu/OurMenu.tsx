'use client'

import { animateOurMenu } from '@/animations'
import { useFocaccias } from '@/hooks/focaccia/useFocaccias'
import { FocacciaItem } from '@/types'
import { useMemo, useState, useEffect, useRef } from 'react'
import { FaRegLightbulb } from 'react-icons/fa'
import { SmartLoading } from '../SmartLoading/SmartLoading'
import { CombosSection } from '../CombosSection/CombosSection'
import { FocacciasSection } from '../FocacciasSection/FocacciasSection'
import './_ourMenu.scss'

interface OurMenuProps {
  initialFocaccias?: FocacciaItem[]
}

export default function OurMenu({ initialFocaccias }: OurMenuProps) {
  const ourMenuRef = useRef<HTMLDivElement>(null)
  // Polling cada 30 s para reflejar cambios del admin sin recargar la página,
  // igual que el comportamiento de CombosSection con usePromociones.
  const { data, isLoading, isFetching, isError } = useFocaccias(initialFocaccias, { refetchIntervalMs: 30_000 })

  const focaccias = useMemo(() => {
    return (data ?? []).filter((item) => item.isAvailable)
  }, [data])

  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    if (focaccias.length > 0) {
      const ctx = animateOurMenu(ourMenuRef.current ?? undefined)

      return () => {
        ctx.revert()
      }
    }
  }, [focaccias])

  const hasData = focaccias.length > 0

  const displayedFocaccias = showAll
    ? focaccias
    : focaccias.slice(0, 4)

  const hasMoreToShow =
    focaccias.length > 4 && !showAll

  return (
    <div className='ourMenu' ref={ourMenuRef}>
      <h2 className='ourMenuTitle'>Nuestro Menú</h2>
      <CombosSection />
      <div className='menuItemsContainer'>
        {isLoading && !hasData ? (
          <SmartLoading type="initial" count={4} message="Cargando nuestras focaccias..." />
        ) : isError && !hasData ? (
          <div className='emptyState'>
            <p>No pudimos cargar el menú ahora mismo. Intentá nuevamente en unos segundos.</p>
          </div>
        ) : !hasData ? (
          <div className='emptyState'>
            <p>No hay focaccias disponibles en este momento.</p>
          </div>
        ) : (
          <FocacciasSection focaccias={focaccias} displayedFocaccias={displayedFocaccias} hasMoreToShow={hasMoreToShow} setShowAll={setShowAll} isFetching={isFetching} hasData={hasData} />
        )}
      </div>

      <div className='extraInfo'>
        <FaRegLightbulb />
        <div className='extraInfoContent'>
          <h4>Extra info:</h4>
          <p>
            Tenés tamaños mediana y grande. Si te sobra, podés congelarla hasta por 60 días ❄️
          </p>
        </div>
      </div>
    </div>
  )
}