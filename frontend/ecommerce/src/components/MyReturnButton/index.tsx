import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function MyReturnButtonComponent() {
    const navigate = useNavigate();
    return (

        <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4 cursor-pointer"
        >
            <ArrowLeft size={20} className="mr-2" />
            Voltar
        </Button>
    )
}
