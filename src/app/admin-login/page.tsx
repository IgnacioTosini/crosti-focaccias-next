'use client'

import { useRouter } from 'next/navigation'
import { loginAdmin } from '../actions/admin.actions'
import { toast } from 'react-toastify'
import './_adminLogin.scss'

export default function AdminLoginPage() {
    const router = useRouter()

    const handleLogin = async () => {
        const password = (document.getElementById('password') as HTMLInputElement)?.value;
        if (password !== process.env.NEXT_PUBLIC_SECRET_API_KEY) {
            toast.error('Clave incorrecta');
            return;
        }
        await loginAdmin()
        router.push('/admin')
    }

    return (
        <form className='adminLoginForm' onSubmit={(e) => {
            e.preventDefault()
            handleLogin()
        }}>
            <h1>Login Admin</h1>
            <label htmlFor="password">Contraseña:</label>
            <input id="password" type="password" />
            <button onClick={handleLogin}>
                Ingresar como administrador
            </button>
        </form>
    )
}
