import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Search, CheckCircle } from "lucide-react";
import { stockService } from "@/services/stock/stockService";
import { saleService } from "@/services/stock/saleService";
import { authStorage } from "@/services/auth/authStorage";
import type { Stock } from "@/types/stock.type";
import MyButtonComponent from "@/components/MyButton";
import MyInputComponent from "@/components/MyInput";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import MyReturnButtonComponent from "@/components/MyReturnButton";

export default function RegistrarVendaPage() {
  const navigate = useNavigate();
  const lojaId = authStorage.getStoreId()!;

  const [estoque, setEstoque] = useState<Stock[]>([]);
  const [filteredEstoque, setFilteredEstoque] = useState<Stock[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [selectedProduto, setSelectedProduto] = useState<Stock | null>(null);
  const [quantidade, setQuantidade] = useState("");
  const [error, setError] = useState("");

  // Buscar estoque
  const fetchEstoque = async () => {
    try {
      setLoading(true);
      const produtos = await stockService.readStocks(lojaId);
      // Filtrar apenas produtos com estoque disponível
      const disponveis = produtos.filter((p) => p.quantity > 0);
      setEstoque(disponveis);
      setFilteredEstoque(disponveis);
    } catch (error) {
      console.error("Erro ao buscar estoque:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEstoque();
  }, []);

  // Filtrar produtos por nome
  useEffect(() => {
    const filtered = estoque.filter((produto) =>
      produto.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEstoque(filtered);
  }, [searchTerm, estoque]);

  // Selecionar produto
  const handleSelectProduto = (produtoId: string) => {
    const produto = estoque.find((p) => p._id === produtoId);
    setSelectedProduto(produto || null);
    setQuantidade("");
    setError("");
  };

  // Validar quantidade
  const handleQuantidadeChange = (value: string) => {
    setQuantidade(value);
    setError("");

    if (!selectedProduto) return;

    const qtd = parseInt(value);
    if (qtd > selectedProduto.quantity) {
      setError(
        `Estoque insuficiente! Disponível: ${selectedProduto.quantity} unidades`
      );
    } else if (qtd <= 0) {
      setError("Quantidade deve ser maior que zero");
    }
  };

  // Calcular valor total
  const calcularValorTotal = (): number => {
    if (!selectedProduto || !quantidade) return 0;
    const preco = selectedProduto.price || selectedProduto.originalPrice;
    return preco * parseInt(quantidade);
  };

  // Registrar venda
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedProduto) {
      setError("Selecione um produto");
      return;
    }

    const qtd = parseInt(quantidade);
    if (!qtd || qtd <= 0) {
      setError("Informe uma quantidade válida");
      return;
    }

    if (qtd > selectedProduto.quantity) {
      setError("Estoque insuficiente");
      return;
    }

    try {
      setSubmitting(true);

      await saleService.createSale(lojaId, selectedProduto._id, {
        quantity: qtd,
      });

      alert("Venda registrada com sucesso!");
      navigate("/sale/history");
    } catch (error) {
      console.error("Erro ao registrar venda:", error);
      alert("Erro ao registrar venda. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl">Carregando produtos...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <MyReturnButtonComponent />

        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Registrar Venda
        </h1>
        <p className="text-gray-600">
          Selecione o produto e a quantidade para registrar uma venda
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de Produtos */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Produtos Disponíveis</CardTitle>
              <CardDescription>
                {estoque.length} produtos em estoque
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative mb-4">
                <MyInputComponent type="text" placeholder="Buscar produto..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                >
                  <Search className="text-gray-400" size={20} />
                </MyInputComponent>
              </div>

              {/* Lista */}
              {estoque.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  Nenhum produto disponível no estoque
                </p>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredEstoque.map((produto) => (
                    <div
                      key={produto._id}
                      onClick={() => handleSelectProduto(produto._id)}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedProduto?._id === produto._id
                        ? "border-blue-500 bg-blue-50"
                        : "hover:border-gray-300 hover:bg-gray-50"
                        }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800">
                            {produto.name}
                          </h3>
                          {produto.description && (
                            <p className="text-sm text-gray-600 mt-1">
                              {produto.description}
                            </p>
                          )}
                        </div>
                        {selectedProduto?._id === produto._id && (
                          <CheckCircle className="text-blue-600" size={24} />
                        )}
                      </div>
                      <div className="flex justify-between items-center mt-3">
                        <div>
                          <span className="text-lg font-bold text-green-600">
                            R$ {(produto.price).toFixed(2)}
                          </span>
                          {produto.isDiscountActive && (
                            <span className="text-sm text-gray-400 line-through ml-2">
                              R$ {produto.originalPrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                        <span
                          className={`text-sm px-3 py-1 rounded-full ${produto.quantity < 10
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                            }`}
                        >
                          {produto.quantity} em estoque
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Resumo da Venda */}
        <div>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart size={24} />
                Resumo da Venda
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  {/* Produto Selecionado */}
                  {selectedProduto ? (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-blue-600 font-medium mb-1">
                        Produto Selecionado
                      </p>
                      <p className="font-semibold text-gray-800">
                        {selectedProduto.name}
                      </p>
                      <p className="text-sm text-gray-600 mt-2">
                        Preço unitário: R${" "}
                        {(
                          selectedProduto.price ||
                          selectedProduto.originalPrice
                        ).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-600">
                        Estoque disponível: {selectedProduto.quantity}{" "}
                        unidades
                      </p>
                    </div>
                  ) : (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                      <p className="text-gray-500">
                        Selecione um produto
                      </p>
                    </div>
                  )}

                  {/* Quantidade */}
                  <div className="space-y-2">
                    <Label htmlFor="quantidade">Quantidade</Label>
                    <MyInputComponent
                      id="quantidade"
                      type="number"
                      min="1"
                      max={selectedProduto?.quantity || 0}
                      placeholder="0"
                      value={quantidade}
                      onChange={(e) => handleQuantidadeChange(e.target.value)}
                      disabled={!selectedProduto}
                      className={error ? "border-red-500" : ""}
                    />
                    {error && <p className="text-sm text-red-500">{error}</p>}
                  </div>

                  {/* Valor Total */}
                  {selectedProduto && quantidade && !error && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-sm text-green-600 font-medium mb-1">
                        Valor Total
                      </p>
                      <p className="text-3xl font-bold text-green-700">
                        R$ {calcularValorTotal().toFixed(2)}
                      </p>
                    </div>
                  )}

                  <MyButtonComponent
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700"
                    disabled={!selectedProduto || !quantidade || !!error || submitting}
                  >
                    {submitting ? "Registrando..." : "Confirmar Venda"}
                  </MyButtonComponent>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}