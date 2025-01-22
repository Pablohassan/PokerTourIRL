import { jsxs as _jsxs, Fragment as _Fragment, jsx as _jsx } from "react/jsx-runtime";
export const Content = ({ selectedTournament }) => {
    return (_jsxs("div", { style: { fontSize: "20px", marginTop: "8px", fontFamily: "DS-DIGI" }, children: [_jsxs("div", { children: ["Bourly Poker Tour:", selectedTournament ? (_jsxs(_Fragment, { children: [_jsxs("div", { children: ["Saison ", selectedTournament.id] }), selectedTournament.year && _jsxs("div", { children: [" Ann\u00E9e en cours: ", selectedTournament.year] })] })) : (_jsx("div", { children: "Chargement des donn\u00E9es..." }))] }), _jsx("div", { style: { height: '1rem' } }), " "] }));
};
export default Content;
