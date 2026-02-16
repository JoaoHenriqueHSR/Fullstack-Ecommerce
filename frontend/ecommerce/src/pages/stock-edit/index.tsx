import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { stockService } from "@/services/stock/stockService";
import { authStorage } from "@/services/auth/authStorage";
import MyInputComponent from "@/components/MyInput";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import MyReturnButtonComponent from "@/components/MyReturnButton";
import MyButtonComponent from "@/components/MyButton";

import { MyAlertDialogComponent } from "@/components/MyAlertDialog";

export default function EditarEstoquePage() {
  const navigate = useNavigate();
  const { estoqueId } = useParams<{ estoqueId: string }>();
  const lojaId = authStorage.getStoreId()!;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const [form, setForm] = useState({
    name: "",
    price: "",
    quantity: "",
    description: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Buscar dados do produto
  const fetchProduto = async () => {
    if (!estoqueId) {
      navigate("/estoque");
      return;
    }

    try {
      setLoading(true);
      const produto = await stockService.readStockById(lojaId, estoqueId);

      setForm({
        name: produto.name,
        price: produto.price.toString(),
        quantity: produto.quantity.toString(),
        description: produto.description || "",
      });
    } catch (error) {
      console.error("Erro ao buscar produto:", error);
      alert("Erro ao carregar produto");
      navigate("/estoque");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduto();
  }, [estoqueId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));

    // Limpa erro do campo ao digitar
    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.name.trim()) {
      newErrors.name = "Nome é obrigatório";
    }

    if (!form.price || parseFloat(form.price) <= 0) {
      newErrors.price = "Preço deve ser maior que zero";
    }

    if (!form.quantity || parseInt(form.quantity) < 0) {
      newErrors.quantidade = "Quantidade deve ser maior ou igual a zero";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !estoqueId) {
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        name: form.name,
        price: parseFloat(form.price),
        quantity: parseInt(form.quantity),
        description: form.description || undefined,
      };

      await stockService.updateStock(lojaId, estoqueId, payload);

      alert("Produto atualizado com sucesso!");
      navigate("/stock");
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
      alert("Erro ao atualizar produto. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!estoqueId) return;

    try {
      await stockService.deleteStock(lojaId, estoqueId);
      alert("Produto deletado com sucesso!");
      navigate("/stock");
    } catch (error) {
      console.error("Erro ao deletar produto:", error);
      alert("Erro ao deletar produto. Tente novamente.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl">Carregando produto...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <MyReturnButtonComponent />

        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Editar Produto
            </h1>
            <p className="text-gray-600">
              Atualize as informações do produto
            </p>
          </div>
          <MyButtonComponent
            onClick={() => setShowDeleteDialog(true)}
            className="bg-red-600 flex items-center gap-2"
          >
            <Trash2 size={18} />
            Deletar Produto
          </MyButtonComponent>
        </div>
      </div>

      {/* Formulário */}
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Informações do Produto</CardTitle>
          <CardDescription>
            Todos os campos marcados com * são obrigatórios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Nome */}
              <div className="space-y-2">
                <Label htmlFor="name">
                  Nome do Produto <span className="text-red-500">*</span>
                </Label>
                <MyInputComponent
                  id="name"
                  type="text"
                  placeholder="Ex: Notebook Dell Inspiron"
                  value={form.name}
                  onChange={handleChange}
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              {/* Descrição */}
              <div className="space-y-2">
                <Label htmlFor="description">Descrição (Opcional)</Label>
                <Textarea
                  id="description"
                  placeholder="Descrição detalhada do produto..."
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                />
              </div>

              {/* Preço e Quantidade */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Preço */}
                <div className="space-y-2">
                  <Label htmlFor="price">
                    Preço (R$) <span className="text-red-500">*</span>
                  </Label>
                  <MyInputComponent
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={form.price}
                    onChange={handleChange}
                    className={errors.price ? "border-red-500" : ""}
                  />
                  {errors.price && (
                    <p className="text-sm text-red-500">{errors.preco}</p>
                  )}
                </div>

                {/* Quantidade */}
                <div className="space-y-2">
                  <Label htmlFor="quantity">
                    Quantidade <span className="text-red-500">*</span>
                  </Label>
                  <MyInputComponent
                    id="quantity"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={form.quantity}
                    onChange={handleChange}
                    className={errors.quantidade ? "border-red-500" : ""}
                  />
                  {errors.quantity && (
                    <p className="text-sm text-red-500">{errors.quantidade}</p>
                  )}
                </div>
              </div>

              {/* Preview do valor total */}
              {form.price && form.quantity && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-600 font-medium">
                    Valor total em estoque:
                  </p>
                  <p className="text-2xl font-bold text-blue-700">
                    R${" "}
                    {(
                      parseFloat(form.price || "0") *
                      parseInt(form.quantity || "0")
                    ).toFixed(2)}
                  </p>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <MyButtonComponent
                  type="submit"
                  className="w-full"
                  disabled={submitting}
                >
                  {submitting ? "Salvando..." : "Salvar Alterações"}
                </MyButtonComponent>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      <MyAlertDialogComponent
        title="Tem certeza?"
        desc={`Esta ação não pode ser desfeita. O produto ${form.name} será permanentemente removido do estoque.`}
        onClick={handleDelete}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
      />
    </div >
  );
}