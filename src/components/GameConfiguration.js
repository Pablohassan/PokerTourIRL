import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import api from '../api';
import { Button, Checkbox } from '@nextui-org/react';
const GameConfiguration = ({ championnat, players, onStartGameConfiguration }) => {
    const [selectedTournamentId, setSelectedTournamentId] = useState(null);
    const [blindDuration, setBlindDuration] = useState(20);
    const [selectedPlayers, setSelectedPlayers] = useState([]);
    const [newTournamentYear, setNewTournamentYear] = useState('');
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
        const selectedTournament = championnat.find(t => t.id === selectedTournamentId) || null;
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
                const response = await api.post('/tournaments', { year: parseInt(newTournamentYear) });
                if (response.data) {
                    setSelectedTournamentId(response.data.id); // Sélectionne automatiquement le tournoi créé
                    alert('Nouveau tournoi créé avec succès!');
                }
            }
            catch (error) {
                console.error('Error creating tournament:', error);
                alert('Erreur lors de la création du tournoi.');
            }
        }
    };
    return (_jsxs("form", { onSubmit: handleSubmit, className: "form-modern", children: [_jsxs("div", { className: "form-modern-group", children: [_jsx("label", { htmlFor: "tournament", className: "form-modern-label", children: "Selectionner un tournoi :" }), _jsxs("select", { id: "tournament", value: selectedTournamentId || '', onChange: handleTournamentChange, className: "form-modern-select", children: [_jsx("option", { value: "", disabled: true, children: "Selectionner un tournoi" }), championnat.map(tournament => (_jsx("option", { value: tournament.id, children: tournament.year }, tournament.id)))] }), _jsxs("div", { className: "form-modern-checkbox-group", children: [_jsx("label", { htmlFor: "newTournamentYear", className: "form-modern-label", children: "Creer un nouveau tournoi :" }), _jsx("input", { type: "number", id: "newTournamentYear", value: newTournamentYear, onChange: (e) => setNewTournamentYear(e.target.value), placeholder: "Ann\u00E9e du tournoi", className: "form-modern-input" }), _jsx(Button, { type: "button", onClick: handleCreateTournament, className: "form-modern-button-secondary", children: "Cr\u00E9er" })] })] }), _jsxs("div", { className: "form-modern-group", children: [_jsx("label", { htmlFor: "blindDuration", className: "form-modern-label", children: "Duree des blindes (minutes) :" }), _jsx("input", { type: "number", id: "blindDuration", value: blindDuration, onChange: handleBlindDurationChange, min: "1", className: "form-modern-input" })] }), _jsxs("div", { className: "form-modern-group", children: [_jsx("label", { className: "form-modern-label", children: "Selection des Joueurs :" }), players.map(player => (_jsxs("div", { className: "form-modern-checkbox-group", children: [_jsx(Checkbox, { type: "checkbox", id: `player-${player.id}`, onChange: () => handlePlayerSelect(player), className: "form-modern-checkbox" }), _jsx("label", { htmlFor: `player-${player.id}`, className: "form-modern-label", children: player.name })] }, player.id)))] }), _jsx("button", { type: "submit", className: "form-modern-button", children: "Valider La sellection" })] }));
};
export default GameConfiguration;
