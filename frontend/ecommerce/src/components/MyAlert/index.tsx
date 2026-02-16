import {
    Alert,
    AlertDescription,
    AlertTitle
} from "@/components/ui/alert"
import { CheckCircle2Icon } from "lucide-react";

interface MyAlertProps {
    title: string;
    desc: string;
}

export function MyAlertComponent({ title, desc }: MyAlertProps) {
    return (
        <Alert className="max-w-md">
            <CheckCircle2Icon />
            <AlertTitle>{title}</AlertTitle>
            <AlertDescription>
                {desc}
            </AlertDescription>
        </Alert>
    )
}
