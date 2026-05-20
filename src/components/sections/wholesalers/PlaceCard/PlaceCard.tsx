import './_placeCard.scss';

interface Props {
    icon: string;
    label: string;
}

export const PlaceCard = ({ icon, label }: Props) => {
    return (
        <div className='placeCard'>
            <span className='placeCardIcon'>{icon}</span>
            <p className='placeCardLabel'>{label}</p>
        </div>
    )
}
