import React, { useState } from 'react';
import { Tournaments, Player } from './interfaces';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../config';

// Add CSS styles
const styles = {
  button: {
    padding: '12px 24px',
    fontSize: '1rem',
    fontWeight: '600',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  },
  primaryButton: {
    backgroundColor: '#3B82F6'
  },
  dangerButton: {
    backgroundColor: '#EF4444'
  },
  checkbox: {
    width: '20px',
    height: '20px',
    accentColor: '#3B82F6',
    cursor: 'pointer'
  }
} as const;

// Add CSS classes for hover effects
const cssStyles = `
  .button-primary:hover {
    background-color: #2563EB !important;
  }
  .button-danger:hover {
    background-color: #DC2626 !important;
  }
`;

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
  const navigate = useNavigate();

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
          setSelectedTournamentId(response.data.id);
          alert('Nouveau tournoi créé avec succès!');
        }
      } catch (error) {
        console.error('Error creating tournament:', error);
        alert('Erreur lors de la création du tournoi.');
      }
    }
  };

  return (
    <>
      <style>{cssStyles}</style>
      <div style={{
        minHeight: '100vh',
        padding: '20px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(to bottom, #111827, #1F2937)'
      }}>
        <form onSubmit={handleSubmit} style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px',
          maxWidth: '56rem',
          margin: '0 auto',
          width: '100%',
          backgroundColor: '#1F2937',
          borderRadius: '8px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
        }}>
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '24px'
            }}>Game Configuration</h2>

            <div style={{ marginBottom: '16px' }}>
              <label htmlFor="tournament" style={{
                display: 'block',
                fontSize: '1.125rem',
                fontWeight: '500',
                color: '#E5E7EB',
                marginBottom: '8px'
              }}>
                Select Tournament:
              </label>
              <select
                id="tournament"
                value={selectedTournamentId || ''}
                onChange={handleTournamentChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#374151',
                  color: 'white',
                  borderRadius: '8px',
                  border: '2px solid transparent',
                  outline: 'none'
                }}
              >
                <option value="" disabled>Select a tournament</option>
                {championnat.map(tournament => (
                  <option key={tournament.id} value={tournament.id}>{tournament.year}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label htmlFor="newTournamentYear" style={{
                display: 'block',
                fontSize: '1.125rem',
                fontWeight: '500',
                color: '#E5E7EB',
                marginBottom: '8px'
              }}>
                Create New Tournament:
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="number"
                  id="newTournamentYear"
                  value={newTournamentYear}
                  onChange={(e) => setNewTournamentYear(e.target.value)}
                  placeholder="Tournament Year"
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: '#374151',
                    color: 'white',
                    borderRadius: '8px',
                    border: '2px solid transparent',
                    outline: 'none'
                  }}
                />
                <button
                  type="button"
                  onClick={handleCreateTournament}
                  className="button-primary"
                  style={{
                    ...styles.button,
                    ...styles.primaryButton
                  }}
                >
                  Create
                </button>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label htmlFor="blindDuration" style={{
                display: 'block',
                fontSize: '1.125rem',
                fontWeight: '500',
                color: '#E5E7EB',
                marginBottom: '8px'
              }}>
                Blind Duration (minutes):
              </label>
              <input
                type="number"
                id="blindDuration"
                value={blindDuration}
                onChange={handleBlindDurationChange}
                min="1"
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#374151',
                  color: 'white',
                  borderRadius: '8px',
                  border: '2px solid transparent',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontSize: '1.125rem',
                fontWeight: '500',
                color: '#E5E7EB',
                marginBottom: '8px'
              }}>
                Select Players:
              </label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '16px',
                padding: '16px',
                backgroundColor: '#374151',
                borderRadius: '8px',
                maxHeight: '400px',
                overflowY: 'auto'
              }}>
                {players.map(player => (
                  <div key={player.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '8px',
                    backgroundColor: '#4B5563',
                    borderRadius: '8px'
                  }}>
                    <input
                      type="checkbox"
                      id={`player-${player.id}`}
                      checked={selectedPlayers.some(p => p.id === player.id)}
                      onChange={() => handlePlayerSelect(player)}
                      style={styles.checkbox}
                    />
                    <label
                      htmlFor={`player-${player.id}`}
                      style={{
                        color: 'white',
                        cursor: 'pointer',
                        userSelect: 'none'
                      }}
                    >
                      {player.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '16px',
            paddingTop: '24px'
          }}>
            <button
              type="button"
              onClick={() => navigate("/partypage")}
              className="button-danger"
              style={{
                ...styles.button,
                ...styles.dangerButton
              }}
            >
              Back
            </button>
            <button
              type="submit"
              className="button-primary"
              style={{
                ...styles.button,
                ...styles.primaryButton
              }}
            >
              Start Game
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default GameConfiguration;