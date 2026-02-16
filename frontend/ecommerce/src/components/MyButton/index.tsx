import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface MyButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: "primary" | "secondary";
}

export default function MyButtonComponent({
    children,
    className,
    variant = "primary",
    ...props
}: MyButtonProps) {

    return (
        <Button className={cn(
            "flex items-center justify-center gap-2 px-6 py-3 rounded-xl transition-all font-bold cursor-pointer",
            variant === "primary" ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-slate-200 text-slate-800",
            className
        )}
            {...props}
        >
            {children}
        </Button>
    );
}