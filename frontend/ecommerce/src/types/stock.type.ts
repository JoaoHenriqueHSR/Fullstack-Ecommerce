export interface Stock {
  _id: string;
  name: string;
  description?: string;
  quantity: number;
  price: number;
  originalPrice: number;
  isDiscountActive?: boolean;
  storeId: string;
}

export interface CreateStockDTO {
  name: string;
  description?: string;
  quantity: number;
  price: number;
}

export interface UpdateStockDTO {
  nome?: string;
  description?: string;
  quantity?: number;
  price?: number;
}