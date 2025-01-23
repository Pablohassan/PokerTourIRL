import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "../../lib/utils";
export function DisplayValue({ label, value, size = 'md', variant = 'primary', className }) {
    return (_jsxs("div", { className: cn("flex flex-col items-center justify-center", "bg-slate-950/95 rounded-xl p-3", "border border-slate-200/60", "shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]", className), children: [label && (_jsx("span", { className: cn("font-['DS-DIGI']", "text-amber-400/90", size === 'sm' && "text-base", size === 'md' && "text-xl", size === 'lg' && "text-2xl", size === 'xl' && "text-3xl", "mb-1"), children: label })), _jsx("span", { className: cn("font-['DS-DIGI']", "tabular-nums tracking-wider", variant === 'primary' && "text-amber-400", variant === 'secondary' && "text-amber-400/80", size === 'sm' && "text-xl", size === 'md' && "text-2xl", size === 'lg' && "text-4xl", size === 'xl' && "text-6xl"), children: value })] }));
}
