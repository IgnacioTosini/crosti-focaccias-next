import './_whyCard.scss';

interface Props {
    icon: React.ReactNode;
    title: string;
    description: string;
}

export const WhyCard = ({ icon, title, description }: Props) => {
    return (
        <div className="whyCard">
            {icon}
            <h3>{title}</h3>
            <p className="whyCardDescription">{description}</p>
        </div>
    )
}
