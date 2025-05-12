import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from '../api';
import { UIContext } from '../components/UiProvider';
function AddPlayer() {
    const [name, setName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [players, setPlayers] = useState([]);
    const navigate = useNavigate();
    const uiContext = useContext(UIContext);
    if (!uiContext) {
        throw new Error('UIContext is undefined, please ensure the component is wrapped with a <UIProvider>');
    }
    const { notify } = uiContext;
    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                const response = await api.get('/player');
                setPlayers(response.data);
            }
            catch (error) {
                console.error(error);
                notify('error', 'Failed to load players');
            }
        };
        fetchPlayers();
    }, [notify]);
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (name.length < 3) {
            notify('warning', 'Player name must be at least 3 characters long');
            return;
        }
        if (phoneNumber.length < 9 || phoneNumber.length > 9) {
            notify("Attention", "il manque un chiffre", "le format exigé pour le numero ", "662123454");
            return;
        }
        try {
            const response = await api.get('/player');
            const players = response.data;
            const playerExists = players.some((player) => player.name.toLowerCase() === name.toLowerCase());
            if (playerExists) {
                notify('warning', `Player ${name} already exists`);
                return;
            }
            const postResponse = await api.post('/players', { name, phoneNumber });
            if (postResponse.data) {
                notify('success', `Player ${name} has been added successfully`);
                setName('');
                setPhoneNumber('');
                // Refresh players list
                const refreshResponse = await api.get('/player');
                setPlayers(refreshResponse.data);
            }
        }
        catch (error) {
            const axiosError = error;
            console.error(axiosError);
            notify('error', 'An error occurred while creating the player');
        }
    };
    const navigateToPlayerPage = (playerId) => {
        navigate(`/player/${playerId}`);
    };
    return (_jsx("div", { className: "min-h-screen bg-slate-900 p-5", children: _jsxs("div", { className: "container mx-auto", children: [_jsx("h1", { className: "text-3xl font-bold text-amber-400 mb-6", children: "Player Management" }), _jsxs("div", { className: "bg-slate-800 border border-amber-400/30 shadow-[0_0_15px_rgba(251,191,36,0.1)] rounded-lg p-5 mb-8", children: [_jsx("h2", { className: "text-xl font-semibold text-amber-400 mb-4", children: "Add New Player" }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-amber-400 mb-2", children: "Player Name" }), _jsx("input", { type: "text", value: name, onChange: (e) => setName(e.target.value), required: true, placeholder: "Enter player name", className: "w-full px-3 py-2 bg-slate-900 border border-amber-400 rounded text-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/30" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-amber-400 mb-2", children: "Phone Number" }), _jsx("input", { type: "text", value: phoneNumber, onChange: (e) => setPhoneNumber(e.target.value), required: true, placeholder: "Enter 9-digit phone number", className: "w-full px-3 py-2 bg-slate-900 border border-amber-400 rounded text-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/30" })] }), _jsx("button", { type: "submit", className: "px-4 py-2 text-sm font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-lg border border-amber-400 transition-all duration-200 hover:shadow-[0_0_10px_rgba(251,191,36,0.3)]", children: "Create New Player" })] })] }), _jsx("div", { className: "overflow-hidden rounded-[5px] border border-amber-400 bg-slate-900 shadow-[0_0_20px_rgba(251,191,36,0.1)]", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { className: "px-3 py-3 text-left text-sm font-semibold bg-blue-900/90 text-amber-400 border-b border-amber-400", children: "#" }), _jsx("th", { className: "px-3 py-3 text-left text-sm font-semibold bg-blue-900/90 text-amber-400 border-b border-amber-400", children: "Player Name" }), _jsx("th", { className: "px-3 py-3 text-left text-sm font-semibold bg-blue-900/90 text-amber-400 border-b border-amber-400", children: "Phone Number" })] }) }), _jsx("tbody", { children: players.map((player, index) => (_jsxs("tr", { className: "hover:bg-blue-900/80 transition-colors cursor-pointer", onClick: () => navigateToPlayerPage(player.id), children: [_jsx("td", { className: "px-3 py-3 text-sm text-amber-400 border-b border-amber-400/20", children: index + 1 }), _jsx("td", { className: "px-3 py-3 text-sm text-amber-400 border-b border-amber-400/20 hover:text-amber-300", children: player.name }), _jsx("td", { className: "px-3 py-3 text-sm text-amber-400 border-b border-amber-400/20", children: player.phoneNumber })] }, player.id))) })] }) })] }) }));
}
export default AddPlayer;
