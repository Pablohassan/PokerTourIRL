import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react';
import api from '../api'; // replace with your actual API import
export const PartyPage = () => {
    const [parties, setParties] = useState([]);
    useEffect(() => {
        const fetchParties = async () => {
            const response = await api.get("/party");
            setParties(response.data);
        };
        fetchParties();
    }, []);
    return (_jsx("div", { children: parties.map((party, i) => (_jsxs("div", { style: { marginBottom: '20px' }, children: [_jsx("div", { style: { marginLeft: 10, fontWeight: 'bold' }, children: new Date(party.date).toLocaleDateString() }), _jsxs(Table, { style: { padding: 10, width: '100%' }, children: [_jsxs(TableHeader, { children: [_jsx(TableColumn, { children: "Player" }), _jsx(TableColumn, { children: "Position" }), _jsx(TableColumn, { children: "Points" }), _jsx(TableColumn, { children: "Rebuys" })] }), _jsx(TableBody, { children: party.playerStats.map((stat, i) => (_jsxs(TableRow, { children: [_jsx(TableCell, { children: stat.player.name }), _jsx(TableCell, { children: stat.position }), _jsx(TableCell, { children: stat.points }), _jsx(TableCell, { children: stat.rebuys })] }, i))) })] })] }, i))) }));
};
export default PartyPage;
//# sourceMappingURL=PartyPage.js.map