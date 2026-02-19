'use client'

import { useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { FaRegLightbulb } from 'react-icons/fa6'
import { ProductService } from '@/services/ProductService'
import { ItemCard } from '../../ItemCard/ItemCard'
import { SmartLoading } from '../../SmartLoading/SmartLoading'
import { animateOurMenu } from '../../../animations'
import { FocacciaItem } from '@/types'
import './_ourMenuClient.scss'

interface Props {
    initialData: FocacciaItem[]
}

export const OurMenuClient = ({ initialData }: Props) => {

    const { data, isFetching } = useQuery({
        queryKey: ['focaccias'],
        queryFn: ProductService.getFocaccias,
        initialData,
        staleTime: 1000 * 60 * 5,
    })

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

                {!hasData ? (
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

                        {/* Skeleton solo para refetch */}
                        {isFetching && (
                            <SmartLoading type="skeleton" count={3} />
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
