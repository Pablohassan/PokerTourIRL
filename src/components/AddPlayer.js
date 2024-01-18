import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UIContext } from '../components/UiProvider';
import { Button, Card, Table, Spacer, Input, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
function AddPlayer() {
    const [name, setName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState(""); // Add this lin
    const [players, setPlayers] = useState([]);
    const uiContext = useContext(UIContext);
    if (!uiContext) {
        throw new Error('UIContext is undefined, please ensure the component is wrapped with a <UIProvider>');
    }
    const { notify } = uiContext;
    // Add this useEffect hook to fetch the players when the component mounts
    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                const response = await axios.get("https://api.bourlypokertour.fr/player");
                setPlayers(response.data);
            }
            catch (error) {
                console.error(error);
            }
        };
        fetchPlayers();
    }, []);
    const handleSubmit = async (event) => {
        event.preventDefault();
        // If the name is too short, show a warning toast and abort
        if (name.length < 3) {
            notify('warning', 'Player name must be at least 3 characters long');
            return;
        }
        if (phoneNumber.length < 9 || phoneNumber.length > 9) {
            notify("Attention", "il manque un chiffre", "le format exigé pour le numero ", "662123454");
            return;
        }
        try {
            // Fetch all players
            const response = await axios.get("https://api.bourlypokertour.fr/player");
            const players = response.data;
            // Check if a player with the given name already exists
            const playerExists = players.some((player) => player.name.toLowerCase() === name.toLowerCase());
            // If the player already exists, show a warning toast and abort
            if (playerExists) {
                notify('warning', `Player ${name} already exists`);
                return;
            }
            // If the player doesn't exist, proceed to create a new player
            const postResponse = await axios.post("https:/api.bourlypokertour.fr/players", { name, phoneNumber });
            // If the player is successfully created, show a success toast
            if (postResponse.data) {
                notify('success', `Player ${name} has been added successfully`);
            }
        }
        catch (error) {
            const axiosError = error; // Use type assertion to assert the error as an AxiosError
            console.error(axiosError);
            // If any other error occurs, show an error toast
            notify('error', 'An error occurred while creating the player');
        }
    };
    return (_jsxs("div", { style: { width: "380px", display: "flex", flexDirection: "column" }, children: [_jsxs("div", { style: { maxHeight: '500px', overflowY: 'auto' }, children: [_jsxs("form", { onSubmit: handleSubmit, children: [_jsxs(Card, { style: { width: "350px" }, children: [_jsx("div", { children: "  Enter the player name :" }), _jsx(Input, { width: "350px", height: 100, type: "text", value: name, onChange: (e) => setName(e.target.value), required: true, placeholder: "Your Name" }), _jsx(Input, { width: "350px", height: 100, type: "text", value: phoneNumber, onChange: (e) => setPhoneNumber(e.target.value), required: true, placeholder: "Your Phone" })] }), _jsx(Button, { type: "submit", children: "Create New Player" })] }), _jsxs(Table, { children: [_jsxs(TableHeader, { children: [_jsx(TableColumn, { children: "Id" }), _jsx(TableColumn, { children: "Joueurs dans le tournois " }), _jsx(TableColumn, { children: "Phone" })] }), _jsx(TableBody, { children: players.map((player, index) => (_jsxs(TableRow, { children: [_jsx(TableCell, { children: index + 1 }), _jsx(TableCell, { children: player.name }), _jsx(TableCell, { children: player.phoneNumber })] }, player.id))) })] })] }), _jsx(Spacer, { y: 1 })] }));
}
export default AddPlayer;
//# sourceMappingURL=AddPlayer.js.map