import React, { useState } from 'react';
import { Tournaments, Player } from './interfaces';
import api from '../api';
import { Button, Checkbox } from '@nextui-org/react';


interface GameConfigurationProps {
  championnat: Tournaments[];
  players: Player[];
  onStartGameConfiguration: (selectedTournament: Tournaments | null, blindDuration: number, selectedPlayers: Player[]) => void;
}

const GameConfiguration: React.FC<GameConfigurationProps> = ({ championnat, players, onStartGameConfiguration }) => {
  const [selectedTournamentId, setSelectedTournamentId] = useState<number | null>(null);
  const [blindDuration, setBlindDuration] = useState<number>(20);
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);
  const [newTournamentYear, setNewTournamentYear] = useState<string>('');

  
  const handleTournamentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTournamentId(Number(e.target.value));
  };

  const handleBlindDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBlindDuration(Number(e.target.value));
  };

  const handlePlayerSelect = (player: Player) => {
   
    setSelectedPlayers(prev =>
      prev.find(p => p.id === player.id)
        ? prev.filter(p => p.id !== player.id)
        : [...prev, player]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedTournament = championnat.find(t => t.id === selectedTournamentId) || null;
    if (!selectedTournament)  {
      alert("Veuillez sélectionner un tournoi valide.");
      return;
    }
    if(selectedPlayers.length < 4){
      alert("Vous devez selectionner au moins 4 joueurs pour lancer une partie ");
      return
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
      } catch (error) {
        console.error('Error creating tournament:', error);
        alert('Erreur lors de la création du tournoi.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-modern">
    <div className="form-modern-group">
        <label htmlFor="tournament" className="form-modern-label">Selectionner un tournoi :</label>
        <select id="tournament" value={selectedTournamentId || ''} onChange={handleTournamentChange} className="form-modern-select">
            <option value="" disabled>Selectionner un tournoi</option>
            {championnat.map(tournament => (
                <option key={tournament.id} value={tournament.id}>{tournament.year}</option>
            ))}
        </select>
        <div className="form-modern-checkbox-group">
            <label htmlFor="newTournamentYear" className="form-modern-label">Creer un nouveau tournoi :</label>
            <input
                type="number"
                id="newTournamentYear"
                value={newTournamentYear}
                onChange={(e) => setNewTournamentYear(e.target.value)}
                placeholder="Année du tournoi"
                className="form-modern-input"
            />
            <Button type="button" onClick={handleCreateTournament} className="form-modern-button-secondary">Créer</Button>
        </div>
    </div>
    <div className="form-modern-group">
        <label htmlFor="blindDuration" className="form-modern-label">Duree des blindes (minutes) :</label>
        <input type="number" id="blindDuration" value={blindDuration} onChange={handleBlindDurationChange} min="1" className="form-modern-input" />
    </div>
    <div className="form-modern-group">
        <label className="form-modern-label">Selection des Joueurs :</label>
        {players.map(player => (
            <div key={player.id} className="form-modern-checkbox-group">
                <Checkbox type="checkbox" id={`player-${player.id}`} onChange={() => handlePlayerSelect(player)} className="form-modern-checkbox" />
                <label htmlFor={`player-${player.id}`} className="form-modern-label">{player.name}</label>
            </div>
        ))}
    </div>
    <button type="submit" className="form-modern-button">Valider La sellection</button>
</form>
  );
};

export default GameConfiguration;
