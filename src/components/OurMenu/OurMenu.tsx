'use client'

import { animateOurMenu } from '@/animations'
import { useFocaccias } from '@/hooks/focaccia/useFocaccias'
import { FocacciaItem } from '@/types'
import { useMemo, useState, useEffect } from 'react'
import { FaRegLightbulb } from 'react-icons/fa'
import { ItemCard } from '../ItemCard/ItemCard'
import { SmartLoading } from '../SmartLoading/SmartLoading'
import './_ourMenu.scss'

interface OurMenuProps {
  initialFocaccias?: FocacciaItem[]
}

export default function OurMenu({ initialFocaccias }: OurMenuProps) {
  const { data, isLoading, isFetching, isError } = useFocaccias(initialFocaccias)

  const focaccias = useMemo(() => {
    return data ?? []
  }, [data])

  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    if (focaccias.length > 0) {
      animateOurMenu()
    }
  }, [focaccias])

  const hasData = focaccias.length > 0

  const displayedFocaccias = showAll
    ? focaccias
    : focaccias.slice(0, 4)

  const hasMoreToShow =
    focaccias.length > 4 && !showAll

  return (
    <div className='ourMenu'>
      <h2 className='ourMenuTitle'>Nuestras Focaccias</h2>
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
          <>
            {displayedFocaccias.map((focaccia: FocacciaItem) => (
              <ItemCard key={focaccia.id} focaccia={focaccia} />
            ))}

            {hasMoreToShow && (
              <div className='loadMoreContainer'>
                <button
                  className='loadMoreButton'
                  onClick={() => setShowAll(true)}
                >
                  Ver {focaccias.length - displayedFocaccias.length} focaccias más
                </button>
              </div>
            )}

            {isFetching && hasData && (
              <SmartLoading type="more" />
            )}
          </>
        )}
      </div>

      <div className='extraInfo'>
        <FaRegLightbulb />
        <div className='extraInfoContent'>
          <h4>Extra info:</h4>
          <p>
            Son tamaño grande. Si te sobra, podés congelarla hasta por 60 días ❄️
          </p>
        </div>
      </div>
    </div>
  )
}