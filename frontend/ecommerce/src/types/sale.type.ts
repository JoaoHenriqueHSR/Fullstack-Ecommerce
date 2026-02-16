export interface Sale {
  _id: string;
  stockId: string;
  storeId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  createdAt: string;
}

export interface CreateSaleDTO {
  quantity: number;
}