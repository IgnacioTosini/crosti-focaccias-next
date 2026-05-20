import type { FocacciaItem } from '@/types/focaccia.types';
import { ItemCard } from '../ItemCard/ItemCard';
import { SmartLoading } from '../SmartLoading/SmartLoading';
import './_focacciasSection.scss';

interface Props {
    focaccias: FocacciaItem[];
    displayedFocaccias: FocacciaItem[];
    hasMoreToShow: boolean;
    setShowAll: (value: boolean) => void;
    isFetching: boolean;
    hasData: boolean;
}

export const FocacciasSection = ({
    focaccias,
    displayedFocaccias,
    hasMoreToShow,
    setShowAll,
    isFetching,
    hasData
}: Props) => {
    return (
        <div className='focacciasSection'>
            <h2 className='sectionTitle'>🍞 Focaccias</h2>
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
        </div>
    )
}
