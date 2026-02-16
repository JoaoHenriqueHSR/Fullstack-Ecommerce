import { authStorage } from "@/services/auth/authStorage";
import { Outlet } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Layout() {

    const navigate = useNavigate();
    const handleLogout = () => {
        authStorage.removeToken();
        navigate("/");
    };
    return (
        <div className="min-h-screen flex flex-col">
            <nav className="bg-slate-100 sticky top-0 z-50 border-b border-slate-200">
                <div className="p-4 flex justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-blue-600">
                            <Link to={"/home"}>
                                MinhaLoja
                            </Link>
                        </h1>
                    </div>
                    <Popover>
                        <PopoverTrigger className="cursor-pointer border-2 border-gray-300 rounded-full hover:border-blue-400">
                            <Avatar>
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                        </PopoverTrigger>
                        <PopoverContent>
                            <div className="font-bold flex justify-center gap-2 text-[#1C935B] p-4 mb-4">
                                <Avatar>
                                    <AvatarImage src="https://github.com/shadcn.png" />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                            </div>
                            <hr />
                            <div className="hover:bg-gray-200 rounded-lg cursor-pointer text-red-500 flex justify-center p-2" onClick={handleLogout}>
                                <LogOut />
                                Sair
                            </div>
                        </PopoverContent>
                    </Popover>

                </div>
            </nav >

            <main className="flex-1">
                <Outlet />
            </main>

            <footer>
                <p>FOOTER</p>
            </footer>
        </div>
    );
}