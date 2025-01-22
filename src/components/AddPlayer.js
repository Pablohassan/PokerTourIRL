import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useContext, useEffect, useState } from "react";
import api from '../api';
import { UIContext } from '../components/UiProvider';
// Add CSS styles
const styles = {
    container: {
        width: '380px',
        display: 'flex',
        flexDirection: 'column'
    },
    scrollContainer: {
        maxHeight: '500px',
        overflowY: 'auto'
    },
    card: {
        width: '350px',
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        marginBottom: '16px'
    },
    input: {
        width: '100%',
        height: '40px',
        padding: '8px 12px',
        marginBottom: '16px',
        border: '1px solid #E5E7EB',
        borderRadius: '6px',
        fontSize: '1rem',
        outline: 'none',
        transition: 'border-color 0.2s'
    },
    button: {
        padding: '10px 20px',
        fontSize: '1rem',
        fontWeight: '600',
        color: 'white',
        backgroundColor: '#3B82F6',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
        marginBottom: '16px'
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        backgroundColor: 'white',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
    },
    th: {
        backgroundColor: '#F3F4F6',
        color: '#374151',
        fontWeight: '600',
        padding: '12px',
        textAlign: 'left',
        fontSize: '0.875rem',
        borderBottom: '1px solid #E5E7EB'
    },
    td: {
        padding: '12px',
        color: '#1F2937',
        fontSize: '0.875rem',
        borderBottom: '1px solid #E5E7EB'
    }
};
// Add CSS classes for hover effects
const cssStyles = `
  .input:focus {
    border-color: #3B82F6;
  }
  .button:hover {
    background-color: #2563EB;
  }
  .table-row:hover {
    background-color: #F9FAFB;
  }
`;
function AddPlayer() {
    const [name, setName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [players, setPlayers] = useState([]);
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
            }
        };
        fetchPlayers();
    }, []);
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
    return (_jsxs("div", { style: styles.container, children: [_jsx("style", { children: cssStyles }), _jsxs("div", { style: styles.scrollContainer, children: [_jsxs("form", { onSubmit: handleSubmit, children: [_jsxs("div", { style: styles.card, children: [_jsx("div", { style: { marginBottom: '12px', fontSize: '1rem', fontWeight: '500' }, children: "Enter the player name:" }), _jsx("input", { type: "text", value: name, onChange: (e) => setName(e.target.value), required: true, placeholder: "Your Name", className: "input", style: styles.input }), _jsx("input", { type: "text", value: phoneNumber, onChange: (e) => setPhoneNumber(e.target.value), required: true, placeholder: "Your Phone", className: "input", style: styles.input })] }), _jsx("button", { type: "submit", className: "button", style: styles.button, children: "Create New Player" })] }), _jsxs("table", { style: styles.table, children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { style: styles.th, children: "Id" }), _jsx("th", { style: styles.th, children: "Joueurs dans le tournois" }), _jsx("th", { style: styles.th, children: "Phone" })] }) }), _jsx("tbody", { children: players.map((player, index) => (_jsxs("tr", { className: "table-row", children: [_jsx("td", { style: styles.td, children: index + 1 }), _jsx("td", { style: styles.td, children: player.name }), _jsx("td", { style: styles.td, children: player.phoneNumber })] }, player.id))) })] })] }), _jsx("div", { style: { height: '16px' } }), " "] }));
}
export default AddPlayer;
