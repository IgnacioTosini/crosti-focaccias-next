import axios from "axios";

const BASE_URL_PRODUCT =
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8080/api/focaccias";

export class ProductService {
    static async getFocaccias() {
        const { data } = await axios.get(BASE_URL_PRODUCT);
        return data;
    }

    static async getFocacciaById(id: number) {
        const { data } = await axios.get(`${BASE_URL_PRODUCT}/${id}`);
        return data;
    }

    static async getFeaturedFocaccias() {
        const { data } = await axios.get(`${BASE_URL_PRODUCT}/featured`);
        return data;
    }
}
