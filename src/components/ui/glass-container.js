import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from "../../lib/utils";
export function GlassContainer({ className, variant = 'default', children, ...props }) {
    return (_jsx("div", { className: cn(
        // Base styles
        "rounded-xl border overflow-hidden backdrop-blur-md", 
        // Variant styles
        variant === 'default' && [
            "bg-gradient-to-b from-slate-700/80 via-slate-100/95 to-slate-900/90",
            "border-amber-400/20",
            "shadow-[0_0_25px_-5px_rgba(245,158,11,0.2)]",
        ], variant === 'dark' && [
            "bg-slate-950/95",
            "border-slate-200/20",
            "shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]",
        ], className), ...props, children: children }));
}
export function GlassContent({ className, children, ...props }) {
    return (_jsx("div", { className: cn("p-4", className), ...props, children: children }));
}
