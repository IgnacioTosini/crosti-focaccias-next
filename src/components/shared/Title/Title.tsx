import './_title.scss';

interface Props {
    title: string;
    subTitle?: string;
}

export const Title = ({ title, subTitle }: Props) => {
    return (
        <div className="title">
            <h1>{title}</h1>
            {subTitle && <h2>{subTitle}</h2>}
        </div>
    )
}
