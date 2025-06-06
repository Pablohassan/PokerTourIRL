import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "./dialog";
import { Button } from "./button";
import { cn } from "../../lib/utils";

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'default' | 'destructive' | 'warning';
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = 'default'
}) => {
    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    const getVariantStyles = () => {
        switch (variant) {
            case 'destructive':
                return {
                    bg: "bg-zinc-900",
                    border: "border-red-500",
                    confirmBtn: "bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold shadow-[0_0_15px_rgba(239,68,68,0.3)] hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:scale-110",
                    cancelBtn: "border-red-500 text-red-50 hover:bg-red-100/50",

                    descriptionColor: "text-red-200/90"
                };
            case 'warning':
                return {
                    bg: "bg-zinc-900",
                    border: "border-amber-500",
                    confirmBtn: "bg-gradient-to-br from-slate-800 to-slate-600 hover:from-amber-600 hover:to-slate-700 text-white font-semibold shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:scale-110",
                    cancelBtn: "border-amber-500 text-amber-50 hover:bg-red-100/50",
                    textColor: "text-amber-50",
                    descriptionColor: "text-amber-100/90"
                };
            default:
                return {
                    bg: "bg-zinc-900",
                    border: "border-blue-500",
                    confirmBtn: "bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:scale-110",
                    cancelBtn: "border-blue-500 text-blue-50 hover:bg-blue-950/50",
                    textColor: "text-blue-50",
                    descriptionColor: "text-blue-200/90"
                };
        }
    };

    const styles = getVariantStyles();

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className={cn(
                styles.bg,
                styles.border,
                "border-2",
                "backdrop-blur-md",
                "shadow-lg shadow-black/25",
                "max-w-[90vw] sm:max-w-[600px]",
                "p-6"
            )}>
                <DialogHeader className="space-y-3">
                    <DialogTitle className={cn(
                        "font-['DS-DIGI']",
                        "text-3xl sm:text-4xl",
                        "text-center",
                        styles.textColor,
                        "tracking-wider",
                        "font-bold"
                    )}>
                        {title}
                    </DialogTitle>
                    {description && (
                        <DialogDescription className={cn(
                            "text-center",
                            styles.descriptionColor,
                            "font-['DS-DIGI']",
                            "text-xl",
                            "leading-relaxed"
                        )}>
                            {description}
                        </DialogDescription>
                    )}
                </DialogHeader>

                <DialogFooter className="flex gap-4 justify-end mt-8">
                    <Button
                        variant="default"
                        onClick={onClose}
                        className={cn(
                            "border-2",
                            styles.cancelBtn,
                            "font-['DS-DIGI']",
                            "text-white",
                            "text-lg",
                            "px-6 py-2",
                            "transition-all duration-200",
                            "hover:scale-105",
                            "active:scale-95"
                        )}
                    >
                        {cancelText}
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        className={cn(
                            styles.confirmBtn,
                            "font-['DS-DIGI']",
                            "border border-black",
                            "text-lg",
                            "px-6 py-2",
                            "transition-all duration-200",
                            "hover:scale-105",
                            "active:scale-95",
                            "border-0"
                        )}
                    >
                        {confirmText}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ConfirmDialog; 