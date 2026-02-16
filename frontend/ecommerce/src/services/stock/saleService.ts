import apiEcommerce from "../ecommerceAPI/api";
import type { Sale, CreateSaleDTO } from "@/types/sale.type";

export class SaleService {
  async createSale(storeId: string, estoqueId: string, data: CreateSaleDTO) {
    const response = await apiEcommerce.post(
      `/store/${storeId}/stock/${estoqueId}/sale`,
      data
    );
    return response.data as Sale;
  }
  
  async readSalesByStore(storeId: string) {
    const response = await apiEcommerce.get(`/store/${storeId}/sales`);
    return response.data as Sale[];
  }

}

export const saleService = new SaleService();