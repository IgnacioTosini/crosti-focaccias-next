'use server';

import { cookies } from 'next/headers';

export async function verificationAdmin(formData: FormData) {
    const cookieStore = await cookies();
    const secret = formData.get('secret');
    const serverSecret = process.env.SECRET_API_KEY ?? process.env.NEXT_PUBLIC_SECRET_API_KEY;

    if (!serverSecret || secret !== serverSecret) {
        return { error: 'Clave incorrecta' };
    }

    cookieStore.set('admin-session', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
    });

    return { success: true };
}
