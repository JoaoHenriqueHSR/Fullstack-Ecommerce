import type { InputHTMLAttributes, ReactNode } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface MyInputProps extends InputHTMLAttributes<HTMLInputElement> {
    children?: ReactNode;
}

export default function MyInputComponent({ children, ...props }: MyInputProps) {
    const [show, setShow] = useState(false);

    const isPassword = props.type === "password";

    if (!isPassword) {
        return (
            <div className="flex gap-2 border rounded-lg p-2">
                {children}
                <input {...props} className={cn("border-none outline-none w-full")} />
            </div>
        )
    }

    return (
        <div className="flex gap-2 border rounded-lg p-2" >
            <input
                {...props}
                type={show ? "text" : "password"}
                className={cn("border-none outline-none w-full")}
            />

            {show ? (
                <Eye
                    className="cursor-pointer"
                    onClick={() => setShow(false)}
                />
            ) : (
                <EyeOff
                    className="cursor-pointer"
                    onClick={() => setShow(true)}
                />
            )}
        </div>
    );
}
