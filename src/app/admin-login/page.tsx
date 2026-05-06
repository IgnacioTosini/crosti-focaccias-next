'use client'

import { useRouter } from 'next/navigation'
import { loginAdmin } from '../actions/admin.actions'
import { toast } from 'react-toastify'
import './_adminLogin.scss'

export default function AdminLoginPage() {
    const router = useRouter()

    const handleLogin = async (password: string) => {
        const result = await loginAdmin(password)

        if (result.error) {
            toast.error(result.error)
            return;
        }

        router.push('/admin')
    }

    return (
        <form className='adminLoginForm' onSubmit={(e) => {
            e.preventDefault()
            const formData = new FormData(e.currentTarget)
            const password = String(formData.get('password') ?? '')
            handleLogin(password)
        }}>
            <h1>Login Admin</h1>
            <label htmlFor="password">Contraseña:</label>
            <input id="password" name='password' type="password" />
            <button type='submit'>
                Ingresar como administrador
            </button>
        </form>
    )
}
