import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
const PlayerTable = ({ config, players, }) => {
    console.log("players in PlayerTable:", players);
    return (_jsx("div", { style: { width: "100%", minWidth: "300px", maxWidth: "340px", margin: "5px", fontWeight: "bold" }, children: _jsxs(Table, { style: { width: "100%" }, children: [_jsxs(TableHeader, { children: [_jsx(TableColumn, { style: { fontWeight: "bold", fontSize: "0.9rem", color: "$blue900" }, children: "Position" }), _jsx(TableColumn, { style: { fontWeight: "bold", fontSize: "0.9rem", color: "$blue900" }, children: "Joueur" }), _jsx(TableColumn, { style: { fontWeight: "bold", fontSize: "0.9rem", color: "$blue900" }, children: config.title })] }), _jsx(TableBody, { children: players
                        .filter((player) => {
                        const result = typeof config.filterFunction === "function"
                            ? player.stats && config.filterFunction(player.stats)
                            : true;
                        return result;
                    })
                        .sort((a, b) => {
                        const result = typeof config.rankFunction === "function"
                            ? a.stats &&
                                b.stats &&
                                config.rankFunction(b.stats) - config.rankFunction(a.stats)
                            : 0;
                        return result;
                    })
                        .map((player, rank) => (_jsxs(TableRow, { children: [_jsx(TableCell, { children: rank + 1 }), _jsx(TableCell, { children: player.name }), _jsx(TableCell, { children: config.rankFunction &&
                                    typeof config.rankFunction === "function" &&
                                    player.stats
                                    ? config.rankFunction(player.stats)
                                    : "-" })] }, player.id))) })] }) }));
};
export default PlayerTable;
