import apiEcommerce from "../ecommerceAPI/api";
import type { LoginDTO, LoginResponse } from "@/types/login.type";

export class AuthService {

    async loginStore(data: LoginDTO): Promise<LoginResponse> {
        const response = await apiEcommerce.post("/auth/login", data);
        return response.data;
    }

}

export const authService = new AuthService();