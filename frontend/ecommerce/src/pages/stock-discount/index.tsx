import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Percent} from "lucide-react";
import { stockService } from "@/services/stock/stockService";
import { authStorage } from "@/services/auth/authStorage";
import type { Stock } from "@/types/stock.type";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import MyReturnButtonComponent from "@/components/MyReturnButton";
import MyButtonComponent from "@/components/MyButton";

export default function AplicarDescontoPage() {
    const navigate = useNavigate();
    const { estoqueId } = useParams<{ estoqueId: string }>();
    const lojaId = authStorage.getStoreId()!;

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showRemoveDialog, setShowRemoveDialog] = useState(false);

    const [produto, setProduto] = useState<Stock | null>(null);
    const [desconto, setDesconto] = useState("");
    const [error, setError] = useState("");

    // Buscar dados do produto
    const fetchProduto = async () => {
        if (!estoqueId) {
            navigate("/stock");
            return;
        }

        try {
            setLoading(true);
            const produtoData = await stockService.readStockById(lojaId, estoqueId);
            setProduto(produtoData);

            // Se já tiver desconto, pré-preenche (calculando % do desconto atual)
            if (produtoData.isDiscountActive) {
                const descontoAtual = ((produtoData.price) / produtoData.price) * 100;
                setDesconto(descontoAtual.toFixed(0));
            }
        } catch (error) {
            console.error("Erro ao buscar produto:", error);
            alert("Erro ao carregar produto");
            navigate("/stock");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProduto();
    }, [estoqueId]);

    const handleDescontoChange = (value: string) => {
        setDesconto(value);
        setError("");

        const descontoNum = parseFloat(value);
        if (descontoNum < 0 || descontoNum > 100) {
            setError("O desconto deve estar entre 0% e 100%");
        }
    };

    const calcularPrecoComDesconto = (): number => {
        if (!produto || !desconto) return 0;
        const descontoNum = parseFloat(desconto);
        return produto.price * (1 - descontoNum / 100);
    };

    const calcularValorDesconto = (): number => {
        if (!produto || !desconto) return 0;
        return produto.price - calcularPrecoComDesconto();
    };

    const handleAplicarDesconto = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!estoqueId || !produto) return;

        const descontoNum = parseFloat(desconto);
        if (!desconto || descontoNum < 0 || descontoNum > 100) {
            setError("Informe um desconto válido entre 0% e 100%");
            return;
        }

        try {
            setSubmitting(true);

            await stockService.applyDiscountStock(lojaId, estoqueId, descontoNum);

            alert("Desconto aplicado com sucesso!");
            navigate("/stock");
        } catch (error) {
            console.error("Erro ao aplicar desconto:", error);
            alert("Erro ao aplicar desconto. Tente novamente.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleRemoverDesconto = async () => {
        if (!estoqueId) return;

        try {
            await stockService.removeDiscountStock(lojaId, estoqueId);
            alert("Desconto removido com sucesso!");
            navigate("/stock");
        } catch (error) {
            console.error("Erro ao remover desconto:", error);
            alert("Erro ao remover desconto. Tente novamente.");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-xl">Carregando produto...</p>
            </div>
        );
    }

    if (!produto) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-xl">Produto não encontrado</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="mb-6">
                <MyReturnButtonComponent />

                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">
                            Aplicar Desconto
                        </h1>
                        <p className="text-gray-600">
                            Defina o desconto para {produto.name}
                        </p>
                    </div>
                    {/* {produto.descontoAtivo && (
                        <Button
                            variant="destructive"
                            onClick={() => setShowRemoveDialog(true)}
                            className="flex items-center gap-2"
                        >
                            <X size={18} />
                            Remover Desconto
                        </Button>
                    )} */}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Formulário */}
                <Card>
                    <CardHeader>
                        <CardTitle>Configurar Desconto</CardTitle>
                        <CardDescription>
                            Informe a porcentagem de desconto para o produto
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleAplicarDesconto}>
                            <div className="space-y-6">
                                {/* Informações do Produto */}
                                <div className="bg-gray-50 border rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-800 mb-2">
                                        {produto.name}
                                    </h3>
                                    {produto.description && (
                                        <p className="text-sm text-gray-600 mb-3">
                                            {produto.description}
                                        </p>
                                    )}
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Preço original:</span>
                                        <span className="text-lg font-bold text-gray-800">
                                            R$ {produto.price.toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center mt-2">
                                        <span className="text-sm text-gray-600">Estoque:</span>
                                        <span className="text-sm font-medium text-gray-800">
                                            {produto.quantity} unidades
                                        </span>
                                    </div>
                                </div>

                                {/* Status do Desconto Atual */}
                                {/* {produto.descontoAtivo && (
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Percent className="text-green-600" size={20} />
                                            <p className="text-sm text-green-700 font-medium">
                                                Desconto ativo
                                            </p>
                                        </div>
                                        <p className="text-sm text-green-600">
                                            Preço com desconto atual: R$ {produto.preco.toFixed(2)}
                                        </p>
                                    </div>
                                )} */}

                                {/* Campo de Desconto */}
                                <div className="space-y-2">
                                    <Label htmlFor="desconto">
                                        Desconto (%) <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="desconto"
                                            type="number"
                                            min="0"
                                            max="100"
                                            step="0.01"
                                            placeholder="0"
                                            value={desconto}
                                            onChange={(e) => handleDescontoChange(e.target.value)}
                                            className={`pr-12 ${error ? "border-red-500" : ""}`}
                                        />
                                        <Percent
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                            size={20}
                                        />
                                    </div>
                                    {error && <p className="text-sm text-red-500">{error}</p>}
                                    <p className="text-xs text-gray-500">
                                        Informe a porcentagem de desconto (0 a 100)
                                    </p>
                                </div>

                                {/* Botões */}
                                <div className="flex gap-4 pt-4">
                                    <MyButtonComponent
                                        type="submit"
                                        className="w-full bg-green-600 hover:bg-green-700"
                                        disabled={submitting || !!error || !desconto}
                                    >
                                        {submitting ? "Aplicando..." : "Aplicar Desconto"}
                                    </MyButtonComponent>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Preview do Desconto */}
                <Card className="h-fit sticky top-6">
                    <CardHeader>
                        <CardTitle>Preview do Desconto</CardTitle>
                        <CardDescription>
                            Veja como ficará o preço com desconto
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {/* Preço Original */}
                            <div className="flex justify-between items-center pb-4 border-b">
                                <span className="text-gray-600">Preço Original:</span>
                                <span className="text-xl font-semibold text-gray-800">
                                    R$ {produto.price.toFixed(2)}
                                </span>
                            </div>

                            {/* Desconto */}
                            {desconto && !error && (
                                <>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Desconto ({desconto}%):</span>
                                        <span className="text-lg font-medium text-red-600">
                                            - R$ {calcularValorDesconto().toFixed(2)}
                                        </span>
                                    </div>

                                    {/* Preço Final */}
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-green-700 font-medium">
                                                Preço com Desconto:
                                            </span>
                                            <span className="text-3xl font-bold text-green-700">
                                                R$ {calcularPrecoComDesconto().toFixed(2)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Economia */}
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <p className="text-sm text-blue-600 mb-1">
                                            Cliente economiza:
                                        </p>
                                        <p className="text-2xl font-bold text-blue-700">
                                            R$ {calcularValorDesconto().toFixed(2)}
                                        </p>
                                        <p className="text-xs text-blue-600 mt-1">
                                            {desconto}% de desconto
                                        </p>
                                    </div>

                                    <div className="pt-4 border-t">
                                        <p className="text-sm text-gray-600 mb-2">
                                            Valor total do estoque com desconto:
                                        </p>
                                        <p className="text-xl font-semibold text-gray-800">
                                            R$ {(calcularPrecoComDesconto() * produto.quantity).toFixed(2)}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {produto.quantity} unidades x R$ {calcularPrecoComDesconto().toFixed(2)}
                                        </p>
                                    </div>
                                </>
                            )}

                            {!desconto && (
                                <div className="text-center py-8">
                                    <Percent className="mx-auto text-gray-400 mb-3" size={48} />
                                    <p className="text-gray-500">
                                        Informe o desconto para ver o preview
                                    </p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Dialog de confirmação para remover desconto */}
            <AlertDialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Remover Desconto?</AlertDialogTitle>
                        <AlertDialogDescription>
                            O desconto aplicado em "{produto.name}" será removido e o produto
                            voltará ao preço original de R$ {produto.price.toFixed(2)}.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleRemoverDesconto}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Remover Desconto
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}