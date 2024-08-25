import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { Button, Table, TableBody, TableColumn, TableHeader, TableRow, TableCell, Card, Spacer, getKeyValue } from '@nextui-org/react';
import bgReview from '../assets/reviewpoker.png';
import { useNavigate } from 'react-router-dom';
const blindLevels = [
    { level: 1, small: 10, big: 20, duration: '20m' },
    { level: 2, small: 25, big: 50, duration: '20m' },
    { level: 3, small: 50, big: 100, duration: '20m' },
    { level: 4, small: 100, big: 200, duration: '20m' },
    { level: 5, small: 150, big: 300, duration: '20m' },
    { level: 6, small: 200, big: 400, duration: '20m' },
    { level: 7, small: 300, big: 600, duration: '20m' },
    { level: 8, small: 400, big: 800, duration: '20m' },
    { level: 9, small: 500, big: 1000, duration: '20m' },
    { level: 10, small: 600, big: 1200, duration: '20m' },
    { level: 11, small: 700, big: 1400, duration: '20m' },
    { level: 12, small: 800, big: 1600, duration: '20m' },
    { level: 13, small: 900, big: 1800, duration: '20m' },
    { level: 14, small: 1000, big: 2000, duration: '20m' },
    { level: 15, small: 1500, big: 3000, duration: '20m' },
    { level: 16, small: 2000, big: 4000, duration: '20m' },
];
const columns = [
    {
        key: "level",
        label: "Level",
    },
    {
        key: "small",
        label: "Small Blind",
    },
    {
        key: "big",
        label: "Big Blind",
    },
    {
        key: "duration",
        label: "Duration",
    },
];
const ReviewSelectedPlayers = ({ selectedPlayers, selectedTournament, onConfirm }) => {
    const navigate = useNavigate();
    const cardStyle = {
        maxWidth: '1400px',
        margin: '0 5px',
        fontFamily: 'DS-Digital'
    };
    const sectionStyle = {
        padding: '10px',
        fontFamily: 'DS-Digital'
    };
    const headerStyle = {
        fontSize: '24px',
        marginBottom: '16px',
        fontFamily: 'DS-Digital'
    };
    return (_jsx("div", { style: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '110vh',
            width: "110%",
            marginTop: "30px",
            backgroundImage: `url(${bgReview})`,
            backgroundSize: 'cover'
        }, children: _jsx(Card, { style: cardStyle, children: _jsxs("div", { style: { display: 'flex' }, children: [_jsxs("div", { style: sectionStyle, children: [selectedTournament && (_jsxs("div", { style: { marginTop: '20px', color: 'black', fontSize: '2em', fontFamily: 'DS-Digital' }, children: ["Validation Tournoi : ", selectedTournament.year] })), _jsx("h3", { style: headerStyle, children: "Validation Joueurs  " }), _jsx(Spacer, { y: 1 }), _jsx("ul", { style: { listStyleType: 'none', padding: 0 }, children: selectedPlayers.map((player, index) => (_jsx("li", { style: {
                                        backgroundColor: index % 2 === 0 ? 'black' : 'gray',
                                        borderRadius: '5px',
                                        color: 'white',
                                        fontSize: '2em',
                                        padding: '8px',
                                        fontFamily: 'DS-Digital'
                                    }, children: player.name }, player.id))) }), _jsx(Spacer, { y: 1 }), _jsxs("div", { style: { display: 'flex', justifyContent: 'flex-end', margin: "5px" }, children: [_jsx(Button, { size: "lg", color: "primary", onClick: onConfirm, children: "Confirm and Start Game" }), _jsx(Spacer, { x: 2 }), _jsx(Button, { size: "lg", color: "danger", onFocus: focus, onClick: () => navigate("/partypage"), children: "Back" })] })] }), _jsxs("div", { style: sectionStyle, children: [_jsx("h3", { style: headerStyle, children: "Blinds Structure" }), _jsx(Spacer, { y: 1 }), _jsxs(Table, { "aria-label": "Blinds Structure", children: [_jsx(TableHeader, { columns: columns, children: (column) => _jsx(TableColumn, { children: column.label }, column.key) }), _jsx(TableBody, { items: blindLevels, children: (item) => (_jsx(TableRow, { children: (columnKey) => _jsx(TableCell, { style: { fontSize: "1em" }, children: getKeyValue(item, columnKey) }) }, item.small)) })] })] })] }) }) }));
};
export default ReviewSelectedPlayers;
