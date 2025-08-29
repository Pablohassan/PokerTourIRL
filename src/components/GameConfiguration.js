import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../config';
import logo from '../assets/pokerlogobourly.jpeg';
import { Button } from './ui/button';
import { cn } from '../lib/utils';
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
const GameConfiguration = ({ championnat: initialChampionnat, players: initialPlayers, onStartGameConfiguration }) => {
    const [selectedTournamentId, setSelectedTournamentId] = useState(null);
    const [blindDuration, setBlindDuration] = useState(20);
    const [selectedPlayers, setSelectedPlayers] = useState([]);
    const [newTournamentYear, setNewTournamentYear] = useState('');
    const [localChampionnat, setLocalChampionnat] = useState(initialChampionnat);
    const [localPlayers, setLocalPlayers] = useState(initialPlayers);
    const [isLoadingTournaments, setIsLoadingTournaments] = useState(false);
    const [isLoadingPlayers, setIsLoadingPlayers] = useState(false);
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
    // Function to fetch players
    const fetchPlayers = async () => {
        setIsLoadingPlayers(true);
        try {
            const response = await api.get("/player");
            if (Array.isArray(response.data)) {
                setLocalPlayers(response.data);
            }
            else {
                console.warn("Players API did not return an array:", response.data);
                setLocalPlayers([]);
            }
        }
        catch (error) {
            console.error("Error fetching players:", error);
            setLocalPlayers([]);
        }
        finally {
            setIsLoadingPlayers(false);
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
    // Effect to fetch players when component mounts or when initialPlayers changes
    useEffect(() => {
        if (initialPlayers.length === 0) {
            fetchPlayers();
        }
        else {
            setLocalPlayers(initialPlayers);
        }
    }, [initialPlayers]); // eslint-disable-line react-hooks/exhaustive-deps
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
                    backgroundImage: `url(${logo})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    position: 'relative'
                }, children: _jsxs("form", { onSubmit: handleSubmit, style: {
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '16px',
                        backgroundColor: 'rgba(0, 0, 0, 0.75)', // Noir semi-transparent pour le poker
                        backdropFilter: 'blur(2px)', // Flou pour l'effet glassmorphism
                        borderRadius: '12px',
                        border: '1px solid rgba(212, 175, 55, 0.3)', // Bordure dorée subtile
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                    }, children: [_jsx("div", { style: { marginBottom: '16px' }, children: _jsx("h2", { style: {
                                    fontSize: '2rem',
                                    fontWeight: 'bold',
                                    color: '#D4AF37', // Doré poker
                                    marginBottom: '16px',
                                    textAlign: 'center',
                                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
                                    fontFamily: 'DS-DIGI'
                                }, children: "Game Configuration" }) }), _jsxs("div", { style: {
                                flex: 1,
                                display: 'flex',
                                gap: '28px',
                                overflow: 'hidden'
                            }, children: [_jsxs("div", { style: {
                                        flex: '0 0 300px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '12px'
                                    }, children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "tournament", style: {
                                                        display: 'block',
                                                        fontSize: '20px',
                                                        fontWeight: '500',
                                                        color: '#F4E4BC', // Beige doré clair
                                                        marginBottom: '6px',
                                                        textShadow: '1px 1px 2px rgba(0, 0, 0, 0.7)',
                                                        fontFamily: 'DS-DIGI'
                                                    }, children: "Select Tournament:" }), _jsxs("select", { id: "tournament", value: selectedTournamentId || '', onChange: handleTournamentChange, disabled: isLoadingTournaments, style: {
                                                        width: '100%',
                                                        padding: '8px',
                                                        fontSize: '20px',
                                                        backgroundColor: 'rgba(20, 20, 20, 0.9)', // Noir poker
                                                        color: '#F4E4BC', // Texte doré clair
                                                        borderRadius: '6px',
                                                        border: '1px solid rgba(212, 175, 55, 0.3)',
                                                        outline: 'none',
                                                        opacity: isLoadingTournaments ? 0.6 : 1
                                                    }, children: [_jsx("option", { value: "", disabled: true, children: isLoadingTournaments ? "Loading tournaments..." : "Select a tournament" }), localChampionnat.map(tournament => (_jsx("option", { value: tournament.id, children: tournament.year }, tournament.id)))] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "newTournamentYear", style: {
                                                        display: 'block',
                                                        fontSize: '20px',
                                                        fontWeight: '500',
                                                        color: '#F4E4BC', // Beige doré clair
                                                        marginBottom: '6px',
                                                        textShadow: '1px 1px 2px rgba(0, 0, 0, 0.7)',
                                                        fontFamily: 'DS-DIGI'
                                                    }, children: "Create New Tournament:" }), _jsxs("div", { style: { display: 'flex', gap: '6px' }, children: [_jsx("input", { type: "number", id: "newTournamentYear", value: newTournamentYear, onChange: (e) => setNewTournamentYear(e.target.value), placeholder: "Year", style: {
                                                                flex: 1,
                                                                padding: '8px',
                                                                fontSize: '20px',
                                                                backgroundColor: 'rgba(20, 20, 20, 0.9)', // Noir poker
                                                                color: '#F4E4BC', // Texte doré clair
                                                                borderRadius: '6px',
                                                                border: '1px solid rgba(212, 175, 55, 0.3)',
                                                                outline: 'none'
                                                            } }), _jsx(Button, { type: "button", onClick: handleCreateTournament, disabled: isLoadingTournaments || !newTournamentYear, size: "lg", className: cn("bg-[#D4AF37] text-black font-semibold", "border-[#D4AF37] hover:bg-[#B8941F]", "shadow-[0_2px_4px_rgba(0,0,0,0.3)]", "hover:shadow-[0_4px_8px_rgba(212,175,55,0.4)]", "disabled:opacity-60 disabled:hover:bg-[#D4AF37]"), children: isLoadingTournaments ? 'Creating...' : 'Create' })] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "blindDuration", style: {
                                                        display: 'block',
                                                        fontSize: '20px',
                                                        fontWeight: '500',
                                                        color: '#F4E4BC', // Beige doré clair
                                                        marginBottom: '6px',
                                                        textShadow: '1px 1px 2px rgba(0, 0, 0, 0.7)',
                                                        fontFamily: 'DS-DIGI'
                                                    }, children: "Blind Duration (minutes):" }), _jsx("input", { type: "number", id: "blindDuration", value: blindDuration, onChange: handleBlindDurationChange, min: "1", style: {
                                                        width: '100%',
                                                        padding: '8px',
                                                        fontSize: '20px',
                                                        backgroundColor: 'rgba(20, 20, 20, 0.9)', // Noir poker
                                                        color: '#F4E4BC', // Texte doré clair
                                                        borderRadius: '6px',
                                                        border: '1px solid rgba(212, 175, 55, 0.3)',
                                                        outline: 'none',
                                                        fontFamily: 'DS-DIGI'
                                                    } })] })] }), _jsxs("div", { style: {
                                        flex: 1,
                                        display: 'flex',
                                        flexDirection: 'column'
                                    }, children: [_jsx("label", { style: {
                                                display: 'block',
                                                fontSize: '0.875rem',
                                                fontWeight: '500',
                                                color: '#F4E4BC', // Beige doré clair
                                                marginBottom: '8px',
                                                textShadow: '1px 1px 2px rgba(0, 0, 0, 0.7)'
                                            }, children: "Select Players:" }), _jsx("div", { style: {
                                                flex: 1,
                                                backgroundColor: 'rgba(20, 20, 20, 0.85)', // Noir poker semi-transparent
                                                borderRadius: '6px',
                                                border: '1px solid rgba(212, 175, 55, 0.2)',
                                                padding: '12px',
                                                overflowY: 'auto',
                                                maxHeight: 'calc(100% - 40px)',
                                                opacity: isLoadingPlayers ? 0.6 : 1
                                            }, children: isLoadingPlayers ? (_jsx("div", { style: {
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    height: '100px',
                                                    color: '#F4E4BC', // Beige doré clair
                                                    fontSize: '0.875rem'
                                                }, children: "Loading players..." })) : (_jsx("div", { style: {
                                                    display: 'grid',
                                                    gridTemplateColumns: 'repeat(2, 1fr)',
                                                    gap: '10px'
                                                }, children: localPlayers.map(player => {
                                                    const isSelected = selectedPlayers.some(p => p.id === player.id);
                                                    return (_jsx(Button, { type: "button", variant: isSelected ? "default" : "outline", size: "sm", onClick: () => handlePlayerSelect(player), className: cn("h-10 px-3 py-2 text-sm font-medium transition-all duration-200", "border rounded-md shadow-sm", "focus-visible:outline-none focus-visible:ring-1", isSelected
                                                            ? [
                                                                // Selected state - doré poker
                                                                "bg-[#D4AF37] text-black font-semibold",
                                                                "border-[#D4AF37] shadow-[0_2px_8px_rgba(212,175,55,0.4)]",
                                                                "hover:bg-[#B8941F] hover:border-[#B8941F]",
                                                                "transform -translate-y-0.5",
                                                                "hover:shadow-[0_4px_12px_rgba(212,175,55,0.5)]"
                                                            ]
                                                            : [
                                                                // Unselected state - noir avec bordure dorée
                                                                "bg-black/70 text-[#F4E4BC] font-normal",
                                                                "border-[#D4AF37]/30",
                                                                "hover:bg-[#D4AF37]/20 hover:border-[#D4AF37]/50",
                                                                "hover:text-[#F4E4BC]",
                                                                "shadow-[0_1px_3px_rgba(0,0,0,0.3)]"
                                                            ]), children: player.name }, player.id));
                                                }) })) })] })] }), _jsxs("div", { style: {
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                paddingTop: '12px',
                                borderTop: '1px solid rgba(212, 175, 55, 0.3)',
                                marginTop: '12px'
                            }, children: [_jsxs("div", { style: {
                                        fontSize: '0.875rem',
                                        color: '#F4E4BC' // Beige doré clair
                                    }, children: [selectedPlayers.length, " player", selectedPlayers.length !== 1 ? 's' : '', " selected"] }), _jsxs("div", { style: {
                                        display: 'flex',
                                        gap: '12px'
                                    }, children: [_jsx(Button, { type: "button", onClick: () => navigate("/partypage"), variant: "outline", className: cn("bg-black/80 text-[#F4E4BC] font-semibold", "border-[#D4AF37]/30 hover:border-[#D4AF37]/50", "hover:bg-[#D4AF37]/10 hover:text-[#F4E4BC]", "shadow-[0_2px_4px_rgba(0,0,0,0.3)]"), children: "Back" }), _jsx(Button, { type: "submit", className: cn("bg-[#D4AF37] text-black font-semibold min-w-[120px]", "border-[#D4AF37] hover:bg-[#B8941F]", "shadow-[0_2px_4px_rgba(0,0,0,0.3)]", "hover:shadow-[0_4px_8px_rgba(212,175,55,0.4)]"), children: "Start Game" })] })] })] }) })] }));
};
export default GameConfiguration;
