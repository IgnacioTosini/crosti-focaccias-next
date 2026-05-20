import { FiMessageCircle } from 'react-icons/fi';

interface PhoneAndSendProps {
    clientPhone: string;
    phoneError: string;
    isSendingOrder: boolean;
    handlePhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSendWhatsApp: () => void;
}

export const PhoneAndSend = ({ clientPhone, phoneError, isSendingOrder, handlePhoneChange, handleSendWhatsApp }: PhoneAndSendProps) => (
    <>
        <div className='phoneInputContainer'>
            <label htmlFor='clientPhone'>Tu número de WhatsApp:</label>
            <input
                type='tel'
                id='clientPhone'
                placeholder='1112345678 (solo números)'
                value={clientPhone}
                onChange={handlePhoneChange}
                className={`phoneInput ${phoneError ? 'error' : ''}`}
                maxLength={15}
            />
            {phoneError && <span className='phoneError'>{phoneError}</span>}
        </div>
        <button
            className='asideOrderSummaryButton'
            onClick={handleSendWhatsApp}
            disabled={!!phoneError || clientPhone.length < 10 || isSendingOrder}
        >
            <FiMessageCircle />
            <span>{isSendingOrder ? 'Enviando...' : 'Enviar pedido por WhatsApp'}</span>
        </button>
        <span className='asideOrderSummaryDisclaimer'>Te llevará a WhatsApp con tu pedido completo</span>
    </>
);
