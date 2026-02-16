import apiEcommerce from "../ecommerceAPI/api";
import type { CreateStoreDTO, Store } from "@/types/store.type";

export class StoreService {
    async createStore(data: CreateStoreDTO): Promise<CreateStoreDTO> {
        const response = await apiEcommerce.post(`/store/`, data);
        return response.data;
    }

    async findStores() {
        const response = await apiEcommerce.get(`/store`);
        return response.data;
    }

    async findStoreById(storeId: string): Promise<Store> {
        const response = await apiEcommerce.get(`/store/${storeId}`);
        return response.data;
    }

    async updateStore(storeId: string, data: Partial<Store>): Promise<Store> {
        const response = await apiEcommerce.put(`/store/${storeId}`, data);
        return response.data;
    }

    async deleteStore(storeId: string): Promise<void> {
        await apiEcommerce.delete(`/store/${storeId}`);
    }
}

export const storeService = new StoreService();