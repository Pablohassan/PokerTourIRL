import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "../../lib/utils";
const WinnerModal = ({ isOpen, onClose, winner }) => {
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
    if (!isOpen)
        return null;
    return createPortal(_jsxs("div", { className: "fixed inset-0 z-[9999] flex items-center justify-center", children: [_jsx("div", { className: "fixed inset-0 bg-black/80", onClick: onClose }), _jsxs("div", { className: cn("bg-gradient-to-br from-amber-900 to-yellow-800", "border-4 border-amber-400", "backdrop-blur-md", "shadow-2xl shadow-amber-400/25", "max-w-[90vw] sm:max-w-[600px]", "p-8", "relative", "overflow-hidden", "rounded-lg", "z-[10000]"), children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-amber-400/10 to-yellow-600/10" }), _jsx("div", { className: "absolute top-4 left-4 w-16 h-16 bg-amber-400/20 rounded-full blur-xl" }), _jsx("div", { className: "absolute bottom-4 right-4 w-20 h-20 bg-yellow-400/20 rounded-full blur-xl" }), _jsxs("div", { className: "space-y-6 relative z-10", children: [_jsx("div", { className: "flex justify-center", children: _jsx("div", { className: "text-6xl", children: "\uD83C\uDFC6" }) }), _jsx("h1", { className: cn("font-['DS-DIGI']", "text-4xl sm:text-5xl", "text-center", "text-amber-100", "tracking-wider", "font-bold", "drop-shadow-lg", "animate-pulse"), children: "F\u00C9LICITATIONS !" }), winner && (_jsxs("p", { className: cn("text-center", "text-amber-200", "font-['DS-DIGI']", "text-2xl sm:text-3xl", "leading-relaxed", "font-semibold", "drop-shadow-md"), children: [winner.name, " remporte la victoire ! \uD83C\uDF89"] })), _jsx("p", { className: cn("text-center", "text-amber-300/90", "font-['DS-DIGI']", "text-lg", "leading-relaxed", "mt-4"), children: _jsxs("span", { className: "text-amber-200 font-bold text-xl mt-2 block", children: ["Redirection automatique dans ", countdown, " secondes..."] }) })] }), _jsx("div", { className: "flex justify-center mt-8 relative z-10", children: _jsxs("div", { className: "relative", children: [_jsx("div", { className: "w-24 h-24 rounded-full border-4 border-amber-400/30 flex items-center justify-center", children: _jsx("span", { className: "text-3xl font-['DS-DIGI'] text-amber-200 font-bold", children: countdown }) }), _jsx("div", { className: "absolute inset-0 rounded-full border-4 border-amber-400 transition-all duration-1000 ease-linear", style: {
                                        clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos(2 * Math.PI * (30 - countdown) / 30 - Math.PI / 2)}% ${50 + 50 * Math.sin(2 * Math.PI * (30 - countdown) / 30 - Math.PI / 2)}%, 50% 50%)`
                                    } })] }) })] })] }), document.body);
};
export default WinnerModal;
