import { jsxs as _jsxs, Fragment as _Fragment, jsx as _jsx } from "react/jsx-runtime";
import { Spacer } from "@nextui-org/react";
export const Content = ({ championnat }) => {
    return (_jsxs("div", { style: { fontSize: "12px", marginTop: "8px" }, children: [_jsx("div", { children: _jsxs("div", { children: ["Pitch Poker Tour:", championnat && championnat.length > 0 ? (_jsxs(_Fragment, { children: ["Saison ", championnat[0].id, championnat[0].year && _jsxs("div", { children: ["Ann\u00E9e en cours: ", championnat[0].year] })] })) : (_jsx("div", { children: "Chargement des donn\u00E9es..." }))] }) }), _jsx(Spacer, { y: 1 })] }));
};
//# sourceMappingURL=Content.js.map