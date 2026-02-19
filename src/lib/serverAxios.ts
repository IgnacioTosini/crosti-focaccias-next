import axios from 'axios'

export const serverAxios = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8080/api",
    headers: {
        'X-API-KEY': process.env.INTERNAL_API_KEY,
    },
})