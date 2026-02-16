import { BrowserRouter, Routes, Route } from "react-router";

import Layout from "./components/Layout";

import ProtectedRoute from "./components/ProtectedRoute";

import LandingPage from "./pages/landing-page";
import CriarLojaPage from './pages/store-create';
import LoginLojaPage from './pages/store-login';
import HomeLojaPage from './pages/store-home';
import ListarEstoquePage from "./pages/stock";
import CriarProdutoPage from "./pages/stock-create";
import RegistrarVendaPage from "./pages/stock-sale";
import HistoricoVendasPage from "./pages/stock-sale-history";
import EditarEstoquePage from "./pages/stock-edit";
import AplicarDescontoPage from "./pages/stock-discount";

export default function App() {
    return (
        <BrowserRouter>
        
            <Routes>

                <Route path='/' element={<LandingPage />} />
                <Route path='/login' element={<LoginLojaPage />} />
                <Route path='/create' element={<CriarLojaPage />} />


                <Route element={
                    <ProtectedRoute>
                        <Layout />
                    </ProtectedRoute>
                }>
                    <Route path="/home" element={<HomeLojaPage />} />

                    <Route path="/stock" element={<ListarEstoquePage />} />
                    <Route path="/stock/create" element={<CriarProdutoPage />} />
                    <Route path="/stock/edit/:estoqueId" element={<EditarEstoquePage />} />
                    <Route path="/stock/discount/:estoqueId" element={<AplicarDescontoPage />} />

                    <Route path="/sale" element={<RegistrarVendaPage />} />
                    <Route path="/sale/history" element={<HistoricoVendasPage />} />
                </Route>

            </Routes>
        </BrowserRouter>
    )
}
