import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Table } from "@nextui-org/react";
const PlayerTable = ({ config, players, style, }) => {
    console.log("players in PlayerTable:", players);
    return (_jsx("div", { style: { width: "100%", margin: "5px", fontWeight: "bold" }, children: _jsxs(Table, { bordered: true, style: { width: "100%" }, children: [_jsxs(Table.Header, { children: [_jsx(Table.Column, { css: { fontWeight: "bold", fontSize: "1rem", color: "$blue900" }, children: "Classement" }), _jsx(Table.Column, { css: { fontWeight: "bold", fontSize: "1rem", color: "$blue900" }, children: "Nom du Joueur" }), _jsx(Table.Column, { css: { fontWeight: "bold", fontSize: "1rem", color: "$blue900" }, children: config.title })] }), _jsx(Table.Body, { children: players
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
                        .map((player, rank) => (_jsxs(Table.Row, { children: [_jsx(Table.Cell, { children: rank + 1 }), _jsx(Table.Cell, { children: player.name }), _jsx(Table.Cell, { children: config.rankFunction &&
                                    typeof config.rankFunction === "function" &&
                                    player.stats
                                    ? config.rankFunction(player.stats)
                                    : "-" })] }, player.id))) })] }) }));
};
export default PlayerTable;
//# sourceMappingURL=PlayerTable.js.map