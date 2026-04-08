import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

interface BackButtonProps {
    to?: string;
    label?: string;
    onClick?: () => void;
}

export function BackButton({ to = "/", label = "Back", onClick }: BackButtonProps) {
    const [, setLocation] = useLocation();

    const handleClick = () => {
        if (onClick) {
            onClick();
        } else if (to) {
            setLocation(to);
        }
    };

    return (
        <Button
            variant="ghost"
            onClick={handleClick}
            className="mb-4 gap-2 hover:bg-primary/10"
        >
            <ArrowLeft className="w-4 h-4" />
            {label}
        </Button>
    );
}
