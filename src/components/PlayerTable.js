import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "../lib/utils";
const PlayerTable = ({ config, players, }) => {
    return (_jsx("div", { className: "w-full bg-slate-900", children: _jsxs("table", { className: "w-full border-collapse text-left", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b border-slate-700/50", children: [_jsx("th", { className: "py-2 px-3 text-lg font-semibold text-slate-400 bg-slate-800/50", children: "#" }), _jsx("th", { className: "py-2 px-3 text-lg font-semibold text-slate-400 bg-slate-800/50", children: "Nom" }), _jsx("th", { className: "py-2 px-3 text-lg font-semibold text-slate-400 bg-slate-800/50 text-right", children: config.title })] }) }), _jsx("tbody", { children: players
                        .filter((player) => {
                        return typeof config.filterFunction === "function"
                            ? player.stats && config.filterFunction(player.stats)
                            : true;
                    })
                        .sort((a, b) => {
                        return typeof config.rankFunction === "function"
                            ? (a.stats && b.stats
                                ? config.rankFunction(b.stats) - config.rankFunction(a.stats)
                                : 0)
                            : 0;
                    })
                        .map((player, rank) => (_jsxs("tr", { className: cn("border-b border-slate-700/50 transition-colors", "hover:bg-slate-800/50", rank === 0 && "bg-amber-900/20 hover:bg-amber-900/30", rank === 1 && "bg-slate-700/20 hover:bg-slate-700/30", rank === 2 && "bg-orange-900/10 hover:bg-orange-900/20"), children: [_jsx("td", { className: "py-1.5 px-3 text-md font-medium text-slate-400", children: rank + 1 }), _jsx("td", { className: "py-1.5 px-3 text-md font-medium text-slate-300", children: player.name }), _jsx("td", { className: "py-1.5 px-3 text-md font-semibold text-slate-200 text-right tabular-nums", children: config.rankFunction &&
                                    typeof config.rankFunction === "function" &&
                                    player.stats
                                    ? config.rankFunction(player.stats)
                                    : "-" })] }, player.id))) })] }) }));
};
export default PlayerTable;
