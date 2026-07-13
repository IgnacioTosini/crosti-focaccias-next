import type { ReactNode } from 'react';
import { FaExclamationTriangle, FaInbox, FaSpinner } from 'react-icons/fa';
import './_adminState.scss';

type AdminStateVariant = 'loading' | 'error' | 'empty';

type AdminStateProps = {
    variant: AdminStateVariant;
    title: string;
    description?: string;
    action?: ReactNode;
};

const icons = {
    loading: FaSpinner,
    error: FaExclamationTriangle,
    empty: FaInbox,
};

export const AdminState = ({ variant, title, description, action }: AdminStateProps) => {
    const Icon = icons[variant];

    return (
        <div className={`adminState adminState--${variant}`} role={variant === 'error' ? 'alert' : 'status'}>
            <span className='adminStateIcon' aria-hidden='true'>
                <Icon />
            </span>
            <div>
                <h2>{title}</h2>
                {description && <p>{description}</p>}
            </div>
            {action && <div className='adminStateAction'>{action}</div>}
        </div>
    );
};
