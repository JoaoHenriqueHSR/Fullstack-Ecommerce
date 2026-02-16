import { useState, useEffect } from "react";
import { Pencil, Trash2, Plus, Search } from "lucide-react";
import { authStorage } from "@/services/auth/authStorage";
import { stockService } from "@/services/stock/stockService";
import type { Stock } from "@/types/stock.type";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useNavigate } from "react-router-dom";
import { Percent } from "lucide-react";
import MyButtonComponent from "@/components/MyButton";

import MyReturnButtonComponent from "@/components/MyReturnButton";

import { MyAlertDialogComponent } from "@/components/MyAlertDialog";

import MyInputComponent from "@/components/MyInput";
import MyButtonTableComponent from "@/components/MyBttonTable";

export default function ListarEstoquePage() {
  const [stock, setStock] = useState<Stock[]>([]);
  const [filteredEstoque, setFilteredStock] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [produtoParaDeletar, setProdutoParaDeletar] = useState<string | null>(null);

  const lojaId = authStorage.getStoreId()!;
  const navigate = useNavigate();

  const fetchEstoque = async () => {
    try {
      setLoading(true);
      const product = await stockService.readStocks(lojaId);
      setStock(product);
      setFilteredStock(product);
    } catch (error) {
      console.error("Erro ao buscar estoque:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEstoque();
  }, []);

  useEffect(() => {
    const filtered = stock.filter((produto) =>
      produto.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStock(filtered);
  }, [searchTerm, stock]);

  const handleDelete = async (estoqueId: string) => {
    try {
      await stockService.deleteStock(lojaId, estoqueId);

      // Atualizar lista após deletar
      setStock(stock.filter((p) => p._id !== estoqueId));
      setProdutoParaDeletar(null);

      alert("Produto deletado com sucesso!");
    } catch (error) {
      console.error("Erro ao deletar produto:", error);
      alert("Erro ao deletar produto!");
    }
  };

  const handleRemoveDiscount = async (storeId: string, stockId: string) => {
    await stockService.removeDiscountStock(storeId, stockId);
    fetchEstoque();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl">Carregando estoque...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <MyReturnButtonComponent />
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Gerenciar Estoque
        </h1>
        <p className="text-gray-600">
          Visualize e gerencie todos os produtos do seu estoque
        </p>
      </div>

      <div className="bg-white border rounded-lg p-4 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <MyInputComponent
            type="text"
            placeholder="Buscar produto por nome..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          >
            <Search className="text-gray-400" size={20} />
          </MyInputComponent>

        </div>

        <MyButtonComponent onClick={() => navigate("/stock/create")}>
          <Plus size={20} className="mr-2" />
          Adicionar Produto
        </MyButtonComponent>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border rounded-lg p-4">
          <p className="text-gray-600 text-sm mb-1">Total de Produtos</p>
          <p className="text-2xl font-bold text-gray-800">{stock.length}</p>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <p className="text-gray-600 text-sm mb-1">Itens em Estoque</p>
          <p className="text-2xl font-bold text-gray-800">
            {stock.reduce((acc, p) => acc + p.quantity, 0)}
          </p>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <p className="text-gray-600 text-sm mb-1">Valor Total</p>
          <p className="text-2xl font-bold text-gray-800">
            R$ {stock.reduce((acc, p) => acc + (p.price * p.quantity), 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* Tabela de produtos */}
      <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
        {filteredEstoque.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500 text-lg">
              {searchTerm ? "Nenhum produto encontrado" : "Nenhum produto cadastrado"}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead className="text-right">Preço</TableHead>
                <TableHead className="text-center">Quantidade</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEstoque.map((produto) => (
                <TableRow key={produto._id}>
                  <TableCell className="font-medium">{produto.name}</TableCell>
                  <TableCell className="text-gray-600">
                    {produto.description || "Sem descrição"}
                  </TableCell>
                  <TableCell className="text-right">
                    {produto.isDiscountActive ? (
                      <div className="flex flex-col items-end">
                        <span className="line-through text-gray-400 text-sm">
                          R$ {produto.originalPrice.toFixed(2)}
                        </span>
                        <span className="text-green-600 font-semibold">
                          R$ {produto.price.toFixed(2)}
                        </span>
                      </div>
                    ) : (
                      <span>R$ {produto.price.toFixed(2)}</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${produto.quantity === 0
                        ? "bg-red-100 text-red-700"
                        : produto.quantity < 10
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                        }`}
                    >
                      {produto.quantity}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${produto.quantity === 0
                        ? "bg-red-100 text-red-700"
                        : produto.quantity < 10
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                        }`}
                    >
                      {produto.quantity === 0
                        ? "Esgotado"
                        : produto.quantity < 10
                          ? "Estoque Baixo"
                          : "Disponível"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      {
                        !produto.isDiscountActive ? (
                          <MyButtonTableComponent
                            className="hover:bg-green-50 text-green-600"
                            onClick={() => navigate(`/stock/discount/${produto._id}`)}
                          >
                            <Percent size={16} />
                          </MyButtonTableComponent>
                        ) : (
                          <MyButtonTableComponent
                            className="hover:bg-red-50 text-red-600"
                            onClick={() => handleRemoveDiscount(produto.storeId, produto._id)}
                          >
                            <Percent size={16} />
                          </MyButtonTableComponent>

                        )
                      }
                      <MyButtonTableComponent
                        className="hover:bg-blue-50"
                        onClick={() => navigate(`/stock/edit/${produto._id}`)}
                      >
                        <Pencil size={16} />
                      </MyButtonTableComponent>
                      <MyButtonTableComponent
                        className="hover:bg-red-50 text-red-600"
                        onClick={() => setProdutoParaDeletar(produto._id)}
                      >
                        <Trash2 size={16} />
                      </MyButtonTableComponent>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <MyAlertDialogComponent
        title="Tem certeza?"
        desc="Esta ação não pode ser desfeita. O produto será permanentemente removido do estoque."
        open={!!produtoParaDeletar}
        onOpenChange={() => setProdutoParaDeletar(null)}
        onClick={() => produtoParaDeletar && handleDelete(produtoParaDeletar)}
      />
    </div>
  );
}