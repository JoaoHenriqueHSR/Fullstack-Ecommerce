import { ClipboardCheck, Package, DollarSign, TrendingUp, AlertCircle, FileClock, Layers, BadgeDollarSign, Plus } from "lucide-react";
import apiEcommerce from "@/services/ecommerceAPI/api";
import { authStorage } from "@/services/auth/authStorage";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import type { Store } from "@/types/store.type";
import type { Stock } from "@/types/stock.type";
import type { Sale } from "@/types/sale.type";

import MyButtonComponent from "@/components/MyButton";
import MyCardComponent from "@/components/MyCard";
import { storeService } from "@/services/stock/storeService";
import { stockService } from "@/services/stock/stockService";
import { saleService } from "@/services/stock/saleService";

export default function HomeLojaPage() {
  const [store, setStore] = useState<Store | null>(null);
  const [stock, setStock] = useState<Stock[]>([]);
  const [sale, setSale] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  
  const storeId = authStorage.getStoreId();

  const fetchStore = async () => {
    try {
      const response = await storeService.findStoreById(storeId!);
      setStore(response);
    } catch (error) {
      console.error("Erro ao buscar loja:", error);
    }
  };

  const fetchStock = async () => {
    try {
      const response = await stockService.readStocks(storeId!);
      setStock(response);
    } catch (error) {
      console.error("Erro ao buscar estoque:", error);
    }
  };

  const fetchSales = async () => {
    try {
      const response = await saleService.readSalesByStore(storeId!);
      setSale(response);
    } catch (error) {
      console.error("Erro ao buscar vendas:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchStore(), fetchStock(), fetchSales()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const totalProdutos = stock.reduce((prev, p) => prev + p.quantity, 0);

  const valorTotalEstoque = stock.reduce((prev, p) => prev + p.price * p.quantity, 0);

  const vendasHoje = sale.filter((sale) => new Date(sale.createdAt).toDateString() === new Date().toDateString());

  const faturamentoHoje = vendasHoje.reduce((prev, sale) => prev + sale.totalPrice, 0);

  const produtosEstoqueBaixo = stock.filter((p) => p.quantity < 10 && p.quantity > 0);

  const noStock = stock.filter((p) => p.quantity <= 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Bem-vindo, {store?.name || "Loja"}
          </h1>
          <p className="text-gray-600 mt-1">
            Visão geral da performance do seu inventário hoje
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

        <MyCardComponent title="Total de Produtos nos estoques" desc={totalProdutos}>
          <div className="bg-blue-100 p-3 rounded-lg">
            <Package className="text-blue-600" size={24} />
          </div>
        </MyCardComponent>

        <MyCardComponent title="Total de Produtos" desc={`R$ ${valorTotalEstoque.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}>
          <div className="bg-green-100 p-3 rounded-lg">
            <DollarSign className="text-green-600" size={24} />
          </div>
        </MyCardComponent>

        <MyCardComponent title="Vendas Hoje" desc={vendasHoje.length}>
          <div className="bg-purple-100 p-3 rounded-lg">
            <ClipboardCheck className="text-purple-600" size={24} />
          </div>
        </MyCardComponent>

        <MyCardComponent title="Faturamento Hoje" desc={`R$ ${faturamentoHoje.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}>
          <div className="bg-orange-100 p-3 rounded-lg">
            <TrendingUp className="text-orange-600" size={24} />
          </div>
        </MyCardComponent>
      </div>

      <div className="bg-white border rounded-lg p-6 shadow-sm mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Ações
        </h2>
        <div className="flex flex-wrap gap-4">
          <MyButtonComponent className="bg-blue-600 hover:bg-blue-700" onClick={() => navigate("/stock/create")}>
            <Plus />
            Adicionar Produto
          </MyButtonComponent>
          <MyButtonComponent className="bg-green-600 hover:bg-green-700" onClick={() => navigate("/sale")}>
            <BadgeDollarSign />
            Registrar Venda
          </MyButtonComponent>
          <MyButtonComponent className="bg-purple-600 hover:bg-purple-700" onClick={() => navigate("/stock")}>
            <Layers />
            Ver Estoque Completo
          </MyButtonComponent>
          <MyButtonComponent className="bg-yellow-600 hover:bg-yellow-700" onClick={() => navigate("/sale/history")}>
            <FileClock />
            Ver Historico de vendas
          </MyButtonComponent>
        </div>
      </div>

      <div className="bg-white border border-yellow-200 rounded-lg p-6 shadow-sm mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-yellow-100 p-2 rounded-lg">
            <AlertCircle className="text-yellow-600" size={24} />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">
            Produtos com Estoque Baixo
          </h2>
        </div>
        <div className="space-y-3">
          {produtosEstoqueBaixo.length > 0 ? produtosEstoqueBaixo.map((produto) => (
            <div
              key={produto._id}
              className="flex justify-between items-center p-3 bg-yellow-50 hover:bg-yellow-100 rounded-lg cursor-pointer"
              onClick={() => { navigate("/stock/edit/" + produto._id) }}
            >
              <div>
                <p className="font-medium text-gray-800">{produto.name}</p>
                <p className="text-sm text-gray-600">
                  Quantidade: {produto.quantity}
                </p>
              </div>
              <span className="bg-yellow-200 text-yellow-800 text-xs font-semibold px-3 py-1 rounded-full">
                Baixo
              </span>
            </div>
          )) :
            <div>
              <p>0</p>
            </div>
          }
        </div>
      </div>

      <div className="bg-white border border-red-200 rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-red-100 p-2 rounded-lg">
            <AlertCircle className="text-red-600" size={24} />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">
            Produto sem estoque
          </h2>
        </div>
        <div className="space-y-3">
          {noStock.length > 0 ? noStock.map((produto) => (
            <div
              key={produto._id}
              className="flex justify-between items-center p-3 bg-red-50 hover:bg-red-100 rounded-lg cursor-pointer"
              onClick={() => { navigate("/stock/edit/" + produto._id) }}
            >
              <div>
                <p className="font-medium text-gray-800">{produto.name}</p>
                <p className="text-sm text-gray-600">
                  Quantidade: {produto.quantity}
                </p>
              </div>
              <span className="bg-red-200 text-red-800 text-xs font-semibold px-3 py-1 rounded-full">
                Falta
              </span>
            </div>
          )) :
            <div>
              <p>0</p>
            </div>
          }
        </div>
      </div>
    </div>
  );
}