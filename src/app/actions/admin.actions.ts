'use server'

import { cookies } from 'next/headers'

export async function loginAdmin() {
    const cookieStore = await cookies()

    cookieStore.set('admin-session', 'true', {
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24,
    })
}
