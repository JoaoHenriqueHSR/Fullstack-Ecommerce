import { Button } from "../ui/button";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MyButtonTableProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    className: string;
}

export default function MyButtonTableComponent({ className, children, ...props }: MyButtonTableProps) {
    return (
        <Button
            variant="outline"
            size="sm"
            className={cn("cursor-pointer", className)}
            {...props}
        >
            {children}
        </Button>
    )
}
