export interface CreateStockDTO {
  name: string;
  description: string;
  quantity: number;
  price: number;
  originalPrice: number;
  storeId: string;
}
