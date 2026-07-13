'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { loginAdmin } from '../actions/admin.actions'
import { toast } from 'react-toastify'
import './_adminLogin.scss'

export default function AdminLoginPage() {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleLogin = async (password: string) => {
        if (isSubmitting) return

        setIsSubmitting(true)
        const result = await loginAdmin(password)

        if (result.error) {
            toast.error(result.error)
            setIsSubmitting(false)
            return;
        }

        router.push('/admin')
    }

    return (
        <main className='adminLoginPage'>
            <form className='adminLoginForm' onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                const password = String(formData.get('password') ?? '')
                handleLogin(password)
            }}>
                <div className='adminLoginBrand'>
                    <Image src='/personajes/crosti-logo.svg' alt='Crosti' width={72} height={72} priority />
                    <div>
                        <p>Centro de control</p>
                        <span>Crosti Focaccias</span>
                    </div>
                </div>

                <div className='adminLoginHeader'>
                    <h1>Acceso administrador</h1>
                    <p>Ingresá tu contraseña para gestionar productos, combos y pedidos.</p>
                </div>

                <div className='adminLoginField'>
                    <label htmlFor="password">Contraseña</label>
                    <input id="password" name='password' type="password" autoComplete='current-password' placeholder='Ingresá la contraseña' />
                </div>

                <button type='submit' disabled={isSubmitting}>
                    {isSubmitting ? 'Ingresando...' : 'Ingresar al panel'}
                </button>
            </form>
        </main>
    )
}
