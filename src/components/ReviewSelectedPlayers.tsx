import React from 'react';
import { Player, Tournaments } from './interfaces';
import bgReview from '../assets/reviewpoker.png';
import { useNavigate } from 'react-router-dom';

interface ReviewSelectedPlayersProps {
  selectedPlayers: Player[];
  selectedTournament: Tournaments | null;
  onConfirm: () => void;
}

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
  { key: "level", label: "Level" },
  { key: "small", label: "Small Blind" },
  { key: "big", label: "Big Blind" },
  { key: "duration", label: "Duration" },
];

const ReviewSelectedPlayers: React.FC<ReviewSelectedPlayersProps> = ({
  selectedPlayers,
  selectedTournament,
  onConfirm
}) => {
  const navigate = useNavigate();

  return (
    <div style={{
      height: '550px',
      width: '970px',
      margin: '0 auto',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundImage: `url(${bgReview})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'relative'
    }}>
      <div style={{
        width: '100%',
        height: '100%',
        padding: '16px',
        backgroundColor: 'rgba(2, 6, 23, 0.90)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(245, 158, 11, 0.2)',
        borderRadius: '12px',
        boxShadow: '0 0 35px -5px rgba(245, 158, 11, 0.15)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        {selectedTournament && (
          <div style={{ marginBottom: '16px' }}>
            <h1 style={{
              fontFamily: 'DS-DIGI',
              fontSize: '1.5rem',
              color: 'rgba(245, 158, 11, 0.9)',
              letterSpacing: '0.1em',
              textAlign: 'center',
              margin: 0
            }}>
              Tournament: {selectedTournament.year}
            </h1>
          </div>
        )}

        {/* Main Content Area */}
        <div style={{
          flex: 1,
          display: 'flex',
          gap: '20px',
          overflow: 'hidden'
        }}>
          {/* Left Column - Players */}
          <div style={{
            flex: '0 0 300px',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <h3 style={{
              fontFamily: 'DS-DIGI',
              fontSize: '1rem',
              color: 'rgba(245, 158, 11, 0.8)',
              letterSpacing: '0.05em',
              marginBottom: '12px',
              margin: 0
            }}>
              Selected Players ({selectedPlayers.length})
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '8px',
              overflowY: 'auto',
              maxHeight: 'calc(100% - 40px)',
              paddingRight: '4px'
            }}>
              {selectedPlayers.map((player) => (
                <div
                  key={player.id}
                  style={{
                    padding: '8px',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(2, 6, 23, 0.9)',
                    border: '1px solid rgba(245, 158, 11, 0.2)',
                    boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.3)',
                    fontFamily: 'DS-DIGI',
                    fontSize: '0.875rem',
                    color: 'rgba(245, 158, 11, 0.9)',
                    letterSpacing: '0.05em',
                    textAlign: 'center'
                  }}
                >
                  {player.name}
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Blinds Structure */}
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column'
          }}>
            <h3 style={{
              fontFamily: 'DS-DIGI',
              fontSize: '1rem',
              color: 'rgba(245, 158, 11, 0.8)',
              letterSpacing: '0.05em',
              marginBottom: '12px',
              margin: 0
            }}>
              Blinds Structure
            </h3>
            <div style={{
              flex: 1,
              borderRadius: '6px',
              overflow: 'hidden',
              border: '1px solid rgba(245, 158, 11, 0.2)',
              boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.3)',
              backgroundColor: 'rgba(2, 6, 23, 0.2)'
            }}>
              <div style={{
                height: '100%',
                overflowY: 'auto'
              }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse'
                }}>
                  <thead style={{
                    position: 'sticky',
                    top: 0,
                    backgroundColor: 'rgba(2, 6, 23, 0.95)',
                    zIndex: 1
                  }}>
                    <tr>
                      {columns.map((column) => (
                        <th
                          key={column.key}
                          style={{
                            padding: '8px 12px',
                            textAlign: 'left',
                            fontFamily: 'DS-DIGI',
                            fontSize: '0.875rem',
                            color: 'rgba(245, 158, 11, 0.8)',
                            letterSpacing: '0.05em',
                            borderBottom: '1px solid rgba(245, 158, 11, 0.2)'
                          }}
                        >
                          {column.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {blindLevels.map((item, index) => (
                      <tr
                        key={item.level}
                        style={{
                          borderBottom: index < blindLevels.length - 1 ? '1px solid rgba(245, 158, 11, 0.1)' : 'none'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(2, 6, 23, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        {columns.map((column) => (
                          <td
                            key={column.key}
                            style={{
                              padding: '6px 12px',
                              fontFamily: 'DS-DIGI',
                              fontSize: '0.875rem',
                              color: 'rgba(245, 158, 11, 0.9)',
                              letterSpacing: '0.05em'
                            }}
                          >
                            {item[column.key as keyof typeof item]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Bottom Buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '12px',
          borderTop: '1px solid rgba(245, 158, 11, 0.2)',
          marginTop: '12px'
        }}>
          <div style={{
            fontSize: '0.875rem',
            color: 'rgba(156, 163, 175, 1)',
            fontFamily: 'DS-DIGI',
            letterSpacing: '0.05em'
          }}>
            Ready to start with {selectedPlayers.length} players
          </div>
          <div style={{
            display: 'flex',
            gap: '12px'
          }}>
            <button
              onClick={() => navigate("/partypage")}
              style={{
                padding: '10px 20px',
                fontSize: '0.875rem',
                fontWeight: '600',
                fontFamily: 'DS-DIGI',
                color: 'rgba(245, 158, 11, 1)',
                backgroundColor: 'rgba(30, 41, 59, 0.8)',
                border: '1px solid rgba(245, 158, 11, 0.2)',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                letterSpacing: '0.05em'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(30, 41, 59, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(30, 41, 59, 0.8)';
              }}
            >
              Back
            </button>
            <button
              onClick={onConfirm}
              style={{
                padding: '10px 24px',
                fontSize: '0.875rem',
                fontWeight: '600',
                fontFamily: 'DS-DIGI',
                color: 'rgba(15, 23, 42, 1)',
                backgroundColor: 'rgba(245, 158, 11, 0.8)',
                border: '1px solid rgba(245, 158, 11, 0.2)',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                minWidth: '180px',
                letterSpacing: '0.05em'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(245, 158, 11, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(245, 158, 11, 0.8)';
              }}
            >
              Confirm and Start Game
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewSelectedPlayers;
