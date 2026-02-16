const TOKEN_KEY = "@ecommerce:token";
const STORE_ID_KEY = "@ecommerce:storeId";

export const authStorage = {
    //pega o token do localStorage
    getToken: () => {
        return localStorage.getItem(TOKEN_KEY);
    },

    //salva o token no localStorage
    setToken: (token: string) => {
        localStorage.setItem(TOKEN_KEY, token);
    },
    
    // Salvar ID da loja (opcional, mas útil)
    setStoreId: (storeId: string) => {
        localStorage.setItem(STORE_ID_KEY, storeId);
    },
    
    // Pegar ID da loja
    getStoreId: () => {
        return localStorage.getItem(STORE_ID_KEY);
    },

    // Remover token (logout)
    removeToken: () => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(STORE_ID_KEY);
    },

    // Verificar se está autenticado
    isAuthenticated: () => {
        return !!localStorage.getItem(TOKEN_KEY);
    }
};