import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../config';
// Add CSS styles for hover effects
// Add CSS classes for hover effects
const cssStyles = `
  .button-primary:hover {
    background-color: #2563EB !important;
  }
  .button-danger:hover {
    background-color: #DC2626 !important;
  }
`;
const GameConfiguration = ({ championnat: initialChampionnat, players, onStartGameConfiguration }) => {
    const [selectedTournamentId, setSelectedTournamentId] = useState(null);
    const [blindDuration, setBlindDuration] = useState(20);
    const [selectedPlayers, setSelectedPlayers] = useState([]);
    const [newTournamentYear, setNewTournamentYear] = useState('');
    const [localChampionnat, setLocalChampionnat] = useState(initialChampionnat);
    const [isLoadingTournaments, setIsLoadingTournaments] = useState(false);
    const navigate = useNavigate();
    // Function to get current year
    const getCurrentYear = () => {
        return new Date().getFullYear();
    };
    // Function to auto-select tournament based on current year
    const autoSelectCurrentYearTournament = (tournaments) => {
        const currentYear = getCurrentYear();
        const currentYearTournament = tournaments.find(t => t.year === currentYear);
        // Only auto-select if no tournament is currently selected
        if (currentYearTournament && !selectedTournamentId) {
            setSelectedTournamentId(currentYearTournament.id);
            console.log(`Auto-selected tournament for year ${currentYear}:`, currentYearTournament);
        }
    };
    // Function to fetch tournaments
    const fetchTournaments = async () => {
        setIsLoadingTournaments(true);
        try {
            const response = await api.get("/tournaments");
            if (Array.isArray(response.data)) {
                const formattedChampionnat = response.data.map((t) => ({
                    id: t.id,
                    year: t.year,
                    createdAt: new Date(t.createdAt)
                }));
                setLocalChampionnat(formattedChampionnat);
                // Auto-select tournament for current year
                autoSelectCurrentYearTournament(formattedChampionnat);
            }
            else {
                console.warn("Tournaments API did not return an array:", response.data);
                setLocalChampionnat([]);
            }
        }
        catch (error) {
            console.error("Error fetching tournaments:", error);
            setLocalChampionnat([]);
        }
        finally {
            setIsLoadingTournaments(false);
        }
    };
    // Effect to fetch tournaments when component mounts or when initialChampionnat changes
    useEffect(() => {
        if (initialChampionnat.length === 0) {
            fetchTournaments();
        }
        else {
            setLocalChampionnat(initialChampionnat);
            // Auto-select tournament for current year if data is already available
            autoSelectCurrentYearTournament(initialChampionnat);
        }
    }, [initialChampionnat]); // eslint-disable-line react-hooks/exhaustive-deps
    const handleTournamentChange = (e) => {
        setSelectedTournamentId(Number(e.target.value));
    };
    const handleBlindDurationChange = (e) => {
        setBlindDuration(Number(e.target.value));
    };
    const handlePlayerSelect = (player) => {
        setSelectedPlayers(prev => prev.find(p => p.id === player.id)
            ? prev.filter(p => p.id !== player.id)
            : [...prev, player]);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        const selectedTournament = localChampionnat.find(t => t.id === selectedTournamentId) || null;
        if (!selectedTournament) {
            alert("Veuillez sélectionner un tournoi valide.");
            return;
        }
        if (selectedPlayers.length < 4) {
            alert("Vous devez selectionner au moins 4 joueurs pour lancer une partie ");
            return;
        }
        onStartGameConfiguration(selectedTournament, blindDuration, selectedPlayers);
    };
    const handleCreateTournament = async () => {
        if (newTournamentYear) {
            try {
                const response = await api.post(API_ENDPOINTS.TOURNAMENTS, {
                    year: parseInt(newTournamentYear)
                });
                if (response.data) {
                    // Re-fetch tournaments to get the updated list
                    await fetchTournaments();
                    // Always select the newly created tournament
                    setSelectedTournamentId(response.data.id);
                    setNewTournamentYear(''); // Clear the input field
                    alert('Nouveau tournoi créé avec succès!');
                }
            }
            catch (error) {
                console.error('Error creating tournament:', error);
                alert('Erreur lors de la création du tournoi.');
            }
        }
    };
    return (_jsxs(_Fragment, { children: [_jsx("style", { children: cssStyles }), _jsx("div", { style: {
                    height: '550px', // Fixed height for tablet
                    width: '970px', // Fixed width for tablet
                    margin: '0 auto',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    background: 'linear-gradient(to bottom, #111827, #1F2937)',
                    position: 'relative'
                }, children: _jsxs("form", { onSubmit: handleSubmit, style: {
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '16px',
                        backgroundColor: '#1F2937',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                    }, children: [_jsx("div", { style: { marginBottom: '16px' }, children: _jsx("h2", { style: {
                                    fontSize: '1.25rem',
                                    fontWeight: 'bold',
                                    color: 'white',
                                    marginBottom: '16px',
                                    textAlign: 'center'
                                }, children: "Game Configuration" }) }), _jsxs("div", { style: {
                                flex: 1,
                                display: 'flex',
                                gap: '20px',
                                overflow: 'hidden'
                            }, children: [_jsxs("div", { style: {
                                        flex: '0 0 300px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '12px'
                                    }, children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "tournament", style: {
                                                        display: 'block',
                                                        fontSize: '0.875rem',
                                                        fontWeight: '500',
                                                        color: '#E5E7EB',
                                                        marginBottom: '6px'
                                                    }, children: "Select Tournament:" }), _jsxs("select", { id: "tournament", value: selectedTournamentId || '', onChange: handleTournamentChange, disabled: isLoadingTournaments, style: {
                                                        width: '100%',
                                                        padding: '8px',
                                                        fontSize: '0.875rem',
                                                        backgroundColor: '#374151',
                                                        color: 'white',
                                                        borderRadius: '6px',
                                                        border: '2px solid transparent',
                                                        outline: 'none',
                                                        opacity: isLoadingTournaments ? 0.6 : 1
                                                    }, children: [_jsx("option", { value: "", disabled: true, children: isLoadingTournaments ? "Loading tournaments..." : "Select a tournament" }), localChampionnat.map(tournament => (_jsx("option", { value: tournament.id, children: tournament.year }, tournament.id)))] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "newTournamentYear", style: {
                                                        display: 'block',
                                                        fontSize: '0.875rem',
                                                        fontWeight: '500',
                                                        color: '#E5E7EB',
                                                        marginBottom: '6px'
                                                    }, children: "Create New Tournament:" }), _jsxs("div", { style: { display: 'flex', gap: '6px' }, children: [_jsx("input", { type: "number", id: "newTournamentYear", value: newTournamentYear, onChange: (e) => setNewTournamentYear(e.target.value), placeholder: "Year", style: {
                                                                flex: 1,
                                                                padding: '8px',
                                                                fontSize: '0.875rem',
                                                                backgroundColor: '#374151',
                                                                color: 'white',
                                                                borderRadius: '6px',
                                                                border: '2px solid transparent',
                                                                outline: 'none'
                                                            } }), _jsx("button", { type: "button", onClick: handleCreateTournament, disabled: isLoadingTournaments || !newTournamentYear, className: "button-primary", style: {
                                                                padding: '8px 12px',
                                                                fontSize: '0.875rem',
                                                                fontWeight: '600',
                                                                color: 'white',
                                                                border: 'none',
                                                                borderRadius: '6px',
                                                                cursor: 'pointer',
                                                                transition: 'background-color 0.2s',
                                                                backgroundColor: '#3B82F6',
                                                                opacity: isLoadingTournaments || !newTournamentYear ? 0.6 : 1
                                                            }, children: isLoadingTournaments ? 'Creating...' : 'Create' })] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "blindDuration", style: {
                                                        display: 'block',
                                                        fontSize: '0.875rem',
                                                        fontWeight: '500',
                                                        color: '#E5E7EB',
                                                        marginBottom: '6px'
                                                    }, children: "Blind Duration (minutes):" }), _jsx("input", { type: "number", id: "blindDuration", value: blindDuration, onChange: handleBlindDurationChange, min: "1", style: {
                                                        width: '100%',
                                                        padding: '8px',
                                                        fontSize: '0.875rem',
                                                        backgroundColor: '#374151',
                                                        color: 'white',
                                                        borderRadius: '6px',
                                                        border: '2px solid transparent',
                                                        outline: 'none'
                                                    } })] })] }), _jsxs("div", { style: {
                                        flex: 1,
                                        display: 'flex',
                                        flexDirection: 'column'
                                    }, children: [_jsx("label", { style: {
                                                display: 'block',
                                                fontSize: '0.875rem',
                                                fontWeight: '500',
                                                color: '#E5E7EB',
                                                marginBottom: '8px'
                                            }, children: "Select Players:" }), _jsx("div", { style: {
                                                flex: 1,
                                                backgroundColor: '#374151',
                                                borderRadius: '6px',
                                                padding: '12px',
                                                overflowY: 'auto',
                                                maxHeight: 'calc(100% - 40px)'
                                            }, children: _jsx("div", { style: {
                                                    display: 'grid',
                                                    gridTemplateColumns: 'repeat(2, 1fr)',
                                                    gap: '8px'
                                                }, children: players.map(player => (_jsxs("div", { style: {
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '8px',
                                                        padding: '6px 8px',
                                                        backgroundColor: '#4B5563',
                                                        borderRadius: '4px',
                                                        fontSize: '0.875rem'
                                                    }, children: [_jsx("input", { type: "checkbox", id: `player-${player.id}`, checked: selectedPlayers.some(p => p.id === player.id), onChange: () => handlePlayerSelect(player), style: {
                                                                width: '16px',
                                                                height: '16px',
                                                                accentColor: '#3B82F6',
                                                                cursor: 'pointer'
                                                            } }), _jsx("label", { htmlFor: `player-${player.id}`, style: {
                                                                color: 'white',
                                                                cursor: 'pointer',
                                                                userSelect: 'none',
                                                                fontSize: '0.875rem'
                                                            }, children: player.name })] }, player.id))) }) })] })] }), _jsxs("div", { style: {
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                paddingTop: '12px',
                                borderTop: '1px solid #374151',
                                marginTop: '12px'
                            }, children: [_jsxs("div", { style: {
                                        fontSize: '0.875rem',
                                        color: '#9CA3AF'
                                    }, children: [selectedPlayers.length, " player", selectedPlayers.length !== 1 ? 's' : '', " selected"] }), _jsxs("div", { style: {
                                        display: 'flex',
                                        gap: '12px'
                                    }, children: [_jsx("button", { type: "button", onClick: () => navigate("/partypage"), className: "button-danger", style: {
                                                padding: '10px 20px',
                                                fontSize: '0.875rem',
                                                fontWeight: '600',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                transition: 'background-color 0.2s',
                                                backgroundColor: '#EF4444'
                                            }, children: "Back" }), _jsx("button", { type: "submit", className: "button-primary", style: {
                                                padding: '10px 24px',
                                                fontSize: '0.875rem',
                                                fontWeight: '600',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                transition: 'background-color 0.2s',
                                                backgroundColor: '#3B82F6',
                                                minWidth: '120px'
                                            }, children: "Start Game" })] })] })] }) })] }));
};
export default GameConfiguration;
