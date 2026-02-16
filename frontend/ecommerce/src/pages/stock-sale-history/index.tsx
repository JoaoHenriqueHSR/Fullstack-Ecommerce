import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Calendar, DollarSign, Package, TrendingUp } from "lucide-react";
import { saleService } from "@/services/stock/saleService";
import { stockService } from "@/services/stock/stockService";
import { authStorage } from "@/services/auth/authStorage";
import type { Sale } from "@/types/sale.type";
import MyButtonComponent from "@/components/MyButton";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import MyReturnButtonComponent from "@/components/MyReturnButton";

export default function HistoricoVendasPage() {
    const navigate = useNavigate();
    const storeId = authStorage.getStoreId()!;

    const [sales, setSales] = useState<Sale[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [vendasData] = await Promise.all([
                saleService.readSales(storeId),
                stockService.readStocks(storeId),
            ]);
            setSales(vendasData);
        } catch (error) {
            console.error("Erro ao buscar dados:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Calcular estatísticas
    const totalVendas = sales.length;
    const faturamentoTotal = sales.reduce((acc, venda) => acc + venda.totalPrice, 0);
    const quantidadeTotal = sales.reduce((acc, venda) => acc + venda.quantity, 0);

    // Vendas de hoje
    const vendasHoje = sales.filter(
        (venda) =>
            new Date(venda.createdAt).toDateString() === new Date().toDateString()
    );
    const faturamentoHoje = vendasHoje.reduce(
        (acc, venda) => acc + venda.totalPrice, 0
    );

    // Formatar data
    const formatarData = (data: string): string => {
        return new Date(data).toLocaleString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-xl">Carregando histórico...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <MyReturnButtonComponent />

            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Histórico de Vendas
                    </h1>
                    <p className="text-gray-600">
                        Visualize todas as vendas realizadas
                    </p>
                </div>
                <MyButtonComponent
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => navigate("/sale")}
                >
                    <Plus size={20} className="mr-2" />
                    Nova Venda
                </MyButtonComponent>
            </div>

            {/* Cards de Estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Total de Vendas */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-4">
                            <div className="bg-blue-100 p-3 rounded-lg">
                                <Package className="text-blue-600" size={24} />
                            </div>
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm mb-1">Total de Vendas</p>
                            <p className="text-3xl font-bold text-gray-800">{totalVendas}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Faturamento Total */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-4">
                            <div className="bg-green-100 p-3 rounded-lg">
                                <DollarSign className="text-green-600" size={24} />
                            </div>
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm mb-1">Faturamento Total</p>
                            <p className="text-3xl font-bold text-gray-800">
                                R$ {faturamentoTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Vendas Hoje */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-4">
                            <div className="bg-purple-100 p-3 rounded-lg">
                                <Calendar className="text-purple-600" size={24} />
                            </div>
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm mb-1">Vendas Hoje</p>
                            <p className="text-3xl font-bold text-gray-800">
                                {vendasHoje.length}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Faturamento Hoje */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-4">
                            <div className="bg-orange-100 p-3 rounded-lg">
                                <TrendingUp className="text-orange-600" size={24} />
                            </div>
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm mb-1">Faturamento Hoje</p>
                            <p className="text-3xl font-bold text-gray-800">
                                R$ {faturamentoHoje.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Todas as Vendas</CardTitle>
                    <CardDescription>
                        {totalVendas} {totalVendas === 1 ? "venda registrada" : "vendas registradas"}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {sales.length === 0 ? (
                        <div className="text-center py-12">
                            <Package className="mx-auto text-gray-400 mb-4" size={48} />
                            <p className="text-gray-500 text-lg mb-4">
                                Nenhuma venda registrada ainda
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Data/Hora</TableHead>
                                        <TableHead>Produto</TableHead>
                                        <TableHead className="text-center">Quantidade</TableHead>
                                        <TableHead className="text-right">Valor Unitário</TableHead>
                                        <TableHead className="text-right">Valor Total</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {sales
                                        .sort(
                                            (a, b) =>
                                                new Date(b.createdAt).getTime() -
                                                new Date(a.createdAt).getTime()
                                        )
                                        .map((venda) => (
                                            <TableRow key={venda._id}>
                                                <TableCell className="font-medium">
                                                    {formatarData(venda.createdAt)}
                                                </TableCell>
                                                <TableCell>{venda.name}</TableCell>
                                                <TableCell className="text-center">
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
                                                        {venda.quantity}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    R$ {venda.unitPrice.toFixed(2)}
                                                </TableCell>
                                                <TableCell className="text-right font-semibold text-green-600">
                                                    R$ {venda.totalPrice.toFixed(2)}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}