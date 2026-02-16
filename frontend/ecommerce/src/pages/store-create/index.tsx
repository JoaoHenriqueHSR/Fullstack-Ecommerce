import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { storeService } from "@/services/stock/storeService";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import MyButtonComponent from "@/components/MyButton";
import MyInputComponent from "@/components/MyInput";
import { authStorage } from "@/services/auth/authStorage";
import { authService } from "@/services/auth/authService";


export default function CriarLojaPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    cep: "",
    cnpj: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setForm(prev => ({ ...prev, [id]: value }));
  };


  const createLoja = async (e: React.FormEvent) => {
    e.preventDefault();

    try {

      await storeService.createStore({
        name: form.name,
        email: form.email,
        password: form.password,
        postalCode: form.cep,
        cnpj: form.cnpj
      });

      const response = await authService.loginStore({
        email: form.email,
        password: form.password
      });

      const { token, storeId } = response;

      authStorage.setToken(token);
      authStorage.setStoreId(storeId);
      navigate("/home");

    } catch (error) {
      console.log("Erro ao criar conta", error)
    }
  }

  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Crie uma conta</CardTitle>
          <CardDescription className="text-center">
            Entre com os dados da sua loja para começar
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={createLoja} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome da Loja</Label>
              <MyInputComponent id="name" placeholder="MinhaLoja" value={form.name} onChange={handleChange} required />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">E-mail</Label>
              <MyInputComponent id="email" type="email" placeholder="admin@loja.com" value={form.email} onChange={handleChange} required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="cep">CEP</Label>
                <MyInputComponent id="cep" placeholder="00000-000" value={form.cep} onChange={handleChange} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cnpj">CNPJ</Label>
                <MyInputComponent id="cnpj" placeholder="00.000.000/0001-00" value={form.cnpj} onChange={handleChange} required />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Senha</Label>
              <MyInputComponent id="password" type="password" value={form.password} onChange={handleChange} required />
            </div>

            <MyButtonComponent type="submit" className="w-full mt-4">
              Criar conta e acessar
            </MyButtonComponent>
          </form>
        </CardContent>

        <CardFooter>
          <div className="flex">
            <p>Já tem uma conta?</p>
            <Link to="/login" className="text-blue-700">Entrar</Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
