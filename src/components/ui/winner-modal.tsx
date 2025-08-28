import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "../../lib/utils";
import { Player } from "../interfaces";

interface WinnerModalProps {
    isOpen: boolean;
    onClose: () => void;
    winner: Player | null;
}

const WinnerModal: React.FC<WinnerModalProps> = ({
    isOpen,
    onClose,
    winner
}) => {
    const [countdown, setCountdown] = useState(30);

    useEffect(() => {
        if (isOpen) {
            setCountdown(30);
            const interval = setInterval(() => {
                setCountdown(prev => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
            {/* Overlay */}
            <div className="fixed inset-0 bg-black/80" onClick={onClose} />

            {/* Modal content */}
            <div className={cn(
                "bg-gradient-to-br from-amber-900 to-yellow-800",
                "border-4 border-amber-400",
                "backdrop-blur-md",
                "shadow-2xl shadow-amber-400/25",
                "max-w-[90vw] sm:max-w-[600px]",
                "p-8",
                "relative",
                "overflow-hidden",
                "rounded-lg",
                "z-[10000]"
            )}>
                {/* Background decoration */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400/10 to-yellow-600/10" />
                <div className="absolute top-4 left-4 w-16 h-16 bg-amber-400/20 rounded-full blur-xl" />
                <div className="absolute bottom-4 right-4 w-20 h-20 bg-yellow-400/20 rounded-full blur-xl" />

                <div className="space-y-6 relative z-10">
                    {/* Trophy icon */}
                    <div className="flex justify-center">
                        <div className="text-6xl">🏆</div>
                    </div>

                    <h1 className={cn(
                        "font-['DS-DIGI']",
                        "text-4xl sm:text-5xl",
                        "text-center",
                        "text-amber-100",
                        "tracking-wider",
                        "font-bold",
                        "drop-shadow-lg",
                        "animate-pulse"
                    )}>
                        FÉLICITATIONS !
                    </h1>

                    {winner && (
                        <p className={cn(
                            "text-center",
                            "text-amber-200",
                            "font-['DS-DIGI']",
                            "text-2xl sm:text-3xl",
                            "leading-relaxed",
                            "font-semibold",
                            "drop-shadow-md"
                        )}>
                            {winner.name} remporte la victoire ! 🎉
                        </p>
                    )}

                    <p className={cn(
                        "text-center",
                        "text-amber-300/90",
                        "font-['DS-DIGI']",
                        "text-lg",
                        "leading-relaxed",
                        "mt-4"
                    )}>

                        <span className="text-amber-200 font-bold text-xl mt-2 block">
                            Redirection automatique dans {countdown} secondes...
                        </span>
                    </p>
                </div>

                {/* Countdown circle visualization */}
                <div className="flex justify-center mt-8 relative z-10">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full border-4 border-amber-400/30 flex items-center justify-center">
                            <span className="text-3xl font-['DS-DIGI'] text-amber-200 font-bold">
                                {countdown}
                            </span>
                        </div>
                        <div
                            className="absolute inset-0 rounded-full border-4 border-amber-400 transition-all duration-1000 ease-linear"
                            style={{
                                clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos(2 * Math.PI * (30 - countdown) / 30 - Math.PI / 2)}% ${50 + 50 * Math.sin(2 * Math.PI * (30 - countdown) / 30 - Math.PI / 2)}%, 50% 50%)`
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default WinnerModal;
