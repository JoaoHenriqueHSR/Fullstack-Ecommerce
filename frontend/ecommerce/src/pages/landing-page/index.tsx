import { useNavigate } from 'react-router-dom';
import MyButtonComponent from '@/components/MyButton';

export default function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
            <nav className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
                <div className="text-2xl font-bold tracking-tight text-blue-600">
                    MinhaLoja
                </div>
                <div className="space-x-4 flex">
                    <MyButtonComponent
                        onClick={() => navigate("/login")}
                        className="hover:text-blue-600 transition-colors bg-white hover:bg-slate-200 text-black border"
                    >
                        Entrar
                    </MyButtonComponent>
                    <MyButtonComponent
                        onClick={() => navigate("/create")}
                    >
                        Começar Agora
                    </MyButtonComponent>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-8 pt-20 pb-32 flex flex-col items-center text-center">
                <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
                    Crie sua loja virtual <br />
                    <span className="bg-linear-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
                        em poucos minutos.
                    </span>
                </h1>

                <p className="text-lg text-slate-600 max-w-2xl mb-10 leading-relaxed">
                    A plataforma completa para você gerenciar suas vendas, capturar leads via e-mail e escalar seu negócio digital com simplicidade e elegância.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                    <MyButtonComponent
                        onClick={() => navigate("/create")}
                        className="bg-slate-900 text-white px-8 py-4 rounded-xl font-semibold hover:bg-slate-800 transition-all transform hover:scale-105 shadow-xl"
                    >
                        Criar minha conta gratuita
                    </MyButtonComponent>
                </div>
            </main>
        </div>
    );
}