export interface UpdateStockDTO {
  name?: string;
  description?: string;
  quantity?: number;
  price?: number;
  originalPrice?: number;
  isDiscountActive?: boolean;
}
