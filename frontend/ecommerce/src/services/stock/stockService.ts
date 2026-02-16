// src/services/stock/stockService.ts
import apiEcommerce from "../ecommerceAPI/api";
import type { Stock, CreateStockDTO, UpdateStockDTO } from "@/types/stock.type";

export class StockService {
    async createStock(storeId: string, data: CreateStockDTO) {
        const response = await apiEcommerce.post(`/store/${storeId}/stock`, data);
        return response.data as Stock;
    }

    async readStockById(storeId: string, stockId: string): Promise<Stock> {
        const response = await apiEcommerce.get(`/store/${storeId}/stock/${stockId}`);
        return response.data as Stock;
    }

    async readStocks(storeId: string) {
        const response = await apiEcommerce.get(`/store/${storeId}/stock`);
        return response.data as Stock[];
    }

    async updateStock(storeId: string, stockId: string, data: UpdateStockDTO) {
        const response = await apiEcommerce.put(`/store/${storeId}/stock/${stockId}`, data);
        return response.data as Stock;
    }

    async deleteStock(storeId: string, stockId: string) {
        const response = await apiEcommerce.delete(`/store/${storeId}/stock/${stockId}`);
        return response.data;
    }

    async applyDiscountStock(storeId: string, stockId: string, percentage: number) {
        const response = await apiEcommerce.patch(`/store/${storeId}/stock/${stockId}/discount`, { percentage });
        return response.data as Stock;
    }

    async removeDiscountStock(storeId: string, stockId: string) {
        const response = await apiEcommerce.patch(`/store/${storeId}/stock/${stockId}/remove-discount`);
        return response.data as Stock;
    }
}

export const stockService = new StockService();