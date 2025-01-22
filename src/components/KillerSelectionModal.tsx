import React from 'react';
import { Player, PlayerStats } from './interfaces';

interface KillerSelectionModalProps {
  killer: boolean;
  games: PlayerStats[];
  currentlyPlayingPlayers: Player[];
  rebuyPlayerId: number | null;
  playerOutGame: number | null;
  handlePlayerKillSelection: (killerPlayerId: number) => void;
}

const KillerSelectionModal: React.FC<KillerSelectionModalProps> = ({
  killer,
  games,
  currentlyPlayingPlayers,
  rebuyPlayerId,
  playerOutGame,
  handlePlayerKillSelection,
}) => {
  if (!killer) return null;

  console.log('KillerSelectionModal render:', {
    killer,
    playersCount: currentlyPlayingPlayers.length,
    rebuyPlayerId,
    playerOutGame
  });

  // Get the player being acted upon (either rebuy or elimination)
  const affectedPlayer = games.find(game =>
    game.playerId === (rebuyPlayerId || playerOutGame)
  );

  // Filter out the affected player from the killer selection list
  const availableKillers = currentlyPlayingPlayers.filter(player =>
    player.id !== (rebuyPlayerId || playerOutGame)
  );

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        maxWidth: '500px',
        width: '90%',
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        <div style={{
          borderBottom: '1px solid #e5e7eb',
          padding: '16px',
          marginBottom: '16px'
        }}>
          <div style={{
            fontSize: '1.25rem',
            fontWeight: 'bold'
          }}>
            Select the Killer
          </div>
        </div>

        <div style={{
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <div style={{
            marginBottom: '16px',
            fontSize: '1rem',
            color: '#4b5563'
          }}>
            {affectedPlayer && (
              <div>
                Who eliminated <span style={{ fontWeight: 'bold' }}>{
                  currentlyPlayingPlayers.find(p => p.id === affectedPlayer.playerId)?.name
                }</span>?
              </div>
            )}
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
            gap: '8px'
          }}>
            {availableKillers.map((player) => {
              const playerGame = games.find((game) => game.playerId === player.id);
              if (!playerGame) return null;

              return (
                <button
                  key={player.id}
                  onClick={() => handlePlayerKillSelection(player.id)}
                  style={{
                    padding: '12px',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    width: '100%'
                  }}
                >
                  <div style={{ fontWeight: 'bold' }}>{player.name}</div>
                  <div style={{ fontSize: '0.875rem' }}>Kills: {playerGame.kills}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KillerSelectionModal;
