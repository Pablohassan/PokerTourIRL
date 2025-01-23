import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from "../../lib/utils";
export function GameGrid({ className, columns = 3, gap = 'md', children, ...props }) {
    return (_jsx("div", { className: cn(
        // Base styles
        "grid w-full", 
        // Column variations
        columns === 1 && "grid-cols-1", columns === 2 && "grid-cols-1 min-[900px]:grid-cols-2", columns === 3 && "grid-cols-1 min-[900px]:grid-cols-3", columns === 4 && "grid-cols-1 sm:grid-cols-2 min-[900px]:grid-cols-4", 
        // Gap variations
        gap === 'sm' && "gap-2", gap === 'md' && "gap-3", gap === 'lg' && "gap-4", 
        // First child span on mobile
        "[&>*:first-child]:col-span-1 [&>*:first-child]:min-[900px]:col-span-1", className), ...props, children: children }));
}
export function GameGridItem({ className, children, ...props }) {
    return (_jsx("div", { className: cn("min-h-[150px] sm:min-h-[200px]", className), ...props, children: children }));
}
