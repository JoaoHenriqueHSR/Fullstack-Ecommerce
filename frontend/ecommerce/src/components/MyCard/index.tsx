import type { ReactNode } from "react";

interface MyCardProps {
    children: ReactNode;
    title: string;
    desc: any;
}

export default function MyCardComponent({ children, title, desc }: MyCardProps) {
    return (
        <div className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
                {children}
            </div>
            <div>
                <p className="text-gray-600 text-sm mb-1">{title}</p>
                <p className="text-3xl font-bold text-gray-800">
                    {desc}
                </p>
            </div>
        </div>
    )
}
