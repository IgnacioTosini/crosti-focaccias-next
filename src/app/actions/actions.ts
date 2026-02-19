'use server';

import { cookies } from 'next/headers';

export async function verificationAdmin(formData: FormData) {
    const cookieStore = await cookies();
    const secret = formData.get('secret');

    if (secret !== process.env.NEXT_PUBLIC_SECRET_API_KEY) {
        return { error: 'Clave incorrecta' };
    }

    cookieStore.set('admin-session', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
    });

    return { success: true };
}
