import './_stepCard.scss';

interface Props {
    stepNumber: number;
    title: string;
    description: string;
}

export const StepCard = ({ stepNumber, title, description }: Props) => {
    return (
        <div className="stepCard">
            <div className="stepMarker">{String(stepNumber).padStart(2, '0')}</div>
            <div className="stepContent">
                <h3>{title}</h3>
                <p>{description}</p>
            </div>
        </div>
    )
}
