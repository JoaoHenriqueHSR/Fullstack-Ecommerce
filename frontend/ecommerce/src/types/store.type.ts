export interface CreateStoreDTO {
    name: string;
    email: string;
    password: string;
    cnpj: string;
    postalCode: string;
}

export interface Store {
    _id: string;
    name: string;
    email: string;
    cnpj: string;
    postalCode: string;
}
