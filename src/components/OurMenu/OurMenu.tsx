'use client';

import { useEffect, useMemo, useState } from 'react';
import { FaRegLightbulb } from 'react-icons/fa6'
import { ItemCard } from '../ItemCard/ItemCard'
import { SmartLoading } from '../SmartLoading/SmartLoading'
import { animateOurMenu } from '../../animations';
import { FocacciaItem } from '@/types';
import { useFocaccias } from '@/hooks/focaccia/useFocaccias';
import './_ourMenu.scss'

export const OurMenu = () => {

  const { data, isLoading, isFetching } = useFocaccias();
  const focaccias = useMemo(() => {
    return data?.data ?? [];
  }, [data]);

  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (!isLoading && focaccias.length > 0) {
      animateOurMenu();
    }
  }, [isLoading, focaccias]);

  const hasData = focaccias.length > 0;
  const showLoadingMessage = isLoading && !hasData;
  const showSkeletonLoading = isFetching && hasData;

  const displayedFocaccias = showAll
    ? focaccias
    : focaccias.slice(0, 4);

  const hasMoreToShow =
    focaccias.length > 4 && !showAll;

  return (
    <div className='ourMenu'>
      <h2 className='ourMenuTitle'>Nuestras Focaccias</h2>

      <div className='menuItemsContainer'>

        {showLoadingMessage ? (
          <SmartLoading
            type="initial"
            message="Cargando nuestras deliciosas focaccias..."
          />
        ) : hasData ? (
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

            {showSkeletonLoading && (
              <SmartLoading type="skeleton" count={3} />
            )}
          </>
        ) : (
          <div className='emptyState'>
            <p>No hay focaccias disponibles en este momento.</p>
          </div>
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
