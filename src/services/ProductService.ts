import axios from "axios";

const BASE_URL_PRODUCT =
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8080/api";

export class ProductService {
    static async getFocaccias() {
        console.log('Fetching focaccias from API...');
        const { data } = await axios.get(`${BASE_URL_PRODUCT}/focaccias`);
        return data;
    }

    static async getFocacciaById(id: number) {
        const { data } = await axios.get(`${BASE_URL_PRODUCT}/focaccias/${id}`);
        return data;
    }

    static async getFeaturedFocaccias() {
        const { data } = await axios.get(`${BASE_URL_PRODUCT}/focaccias/featured`);
        return data;
    }
}
