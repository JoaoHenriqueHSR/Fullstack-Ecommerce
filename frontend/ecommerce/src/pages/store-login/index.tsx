import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import MyInputComponent from "@/components/MyInput";
import { Label } from "@/components/ui/label"
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authStorage } from "@/services/auth/authStorage";
import { authService } from "@/services/auth/authService";
import { Link } from 'react-router-dom';
import MyButtonComponent from "@/components/MyButton";

export default function LoginPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setForm(prev => ({ ...prev, [id]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authService.loginStore({
        email: form.email,
        password: form.password
      });

      const { token, storeId } = response;

      authStorage.setToken(token);
      authStorage.setStoreId(storeId);

      navigate("/home");

    } catch (error: any) {
      console.error("Erro ao fazer login", error);
      setError(error.response?.data?.message || "Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-lg"> {/* Aumentei para max-w-md para respirar melhor */}
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Entrar na sua conta</CardTitle>
          <CardDescription className="text-center">
            Entre com os dados da sua loja
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="bg-red-100 border border-red-700 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="email">E-mail</Label>
              <MyInputComponent id="email" type="email" placeholder="admin@loja.com" value={form.email} onChange={handleChange} required />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Senha</Label>
              <MyInputComponent id="password" type="password" value={form.password} onChange={handleChange} required />
            </div>

            <MyButtonComponent type="submit" className="w-full mt-4" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </MyButtonComponent>
          </form>
        </CardContent>

        <CardFooter>
          <div className="flex">
            <p>Não tem uma conta?</p>
            <Link to="/create" className="text-blue-700">Criar</Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}