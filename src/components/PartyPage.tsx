import { useEffect, useState, useCallback, useRef } from 'react';
import api from '../api'; // replace with your actual API import
import { PlayerStats } from './interfaces';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

// Add CSS styles
const styles = {
  button: {
    padding: '8px 16px',
    fontSize: '0.875rem',
    fontWeight: '600',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  },
  primaryButton: {
    backgroundColor: '#3B82F6'
  },
  dangerButton: {
    backgroundColor: '#EF4444'
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
} as const;

// Add CSS classes for hover effects
const cssStyles = `
  .button-primary:hover {
    background-color: #2563EB !important;
  }
  .button-danger:hover {
    background-color: #DC2626 !important;
  }
  .table-row:hover {
    background-color: #F9FAFB;
  }
`;

// interface Player {
//   id: number;
//   name: string;
// }

interface Party {
  id: number;
  date: string;
  playerStats: PlayerStats[];
}

export const PartyPage = () => {
  const [parties, setParties] = useState<Party[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedParty, setSelectedParty] = useState<Party | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);
  const limit = 15;

  useEffect(() => {
    const fetchParties = async () => {
      if (isLoading) return;

      try {
        setIsLoading(true);
        console.log(`Fetching parties for page ${page}`);

        const response = await api.get(`/parties?page=${page}&limit=${limit}`);
        const fetchedParties = response.data;

        const partiesWithStats = await Promise.all(fetchedParties.map(async (party: Party) => {
          const statsResponse = await api.get(`/parties/${party.id}/stats`);
          return {
            ...party,
            playerStats: statsResponse.data,
          };
        }));

        setParties(prevParties => {
          // Create a map of existing parties by ID
          const existingPartiesMap = new Map(prevParties.map(p => [p.id, p]));

          // Add new parties, avoiding duplicates
          partiesWithStats.forEach(party => {
            if (!existingPartiesMap.has(party.id)) {
              existingPartiesMap.set(party.id, party);
            }
          });

          // Convert map back to array and sort by date (most recent first)
          return Array.from(existingPartiesMap.values())
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        });

        setHasMore(fetchedParties.length === limit);
        console.log(`Fetched ${partiesWithStats.length} parties`);
      } catch (error) {
        console.error('Error loading parties:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchParties();
  }, [page]);

  const lastPartyElementRef = useCallback((node: HTMLDivElement) => {
    if (observer.current) observer.current.disconnect();
    if (isLoading) return;

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        console.log('Loading more parties...');
        setPage(prevPage => prevPage + 1);
      }
    });

    if (node) observer.current.observe(node);
  }, [hasMore, isLoading]);

  const openModal = useCallback((party: Party) => {
    setSelectedParty(party);
    setModalOpen(true);

  }, []);

  const closeModal = () => {
    setModalOpen(false);
    setSelectedParty(null);
  };

  const updatePartyDate = async () => {
    if (!selectedParty) return;
    try {
      await api.put(`/parties/${selectedParty.id}`, {
        date: new Date(selectedParty.date).toISOString(),
      });
      closeModal();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log('Error', error.message);
        }
      } else if (error instanceof Error) {
        console.log('Error', error.message);
      } else {
        console.log('An unexpected error occurred');
      }
    }
  };

  const updateAllPlayerStats = async () => {
    if (!selectedParty) return;

    try {
      const updates = selectedParty.playerStats.map((stat) => ({
        id: stat.id,
        data: {
          position: stat.position,
          points: stat.points,
          rebuys: stat.rebuys,
        },
      }));

      await api.put("/updateMultipleGamesResults", updates);

      closeModal();
    } catch (error) {
      console.error("An error occurred while updating the player stats:", error);
    }
  };

  const handleSaveChanges = async () => {
    await updateAllPlayerStats();
    await updatePartyDate();
  };

  const editStat = (playerIndex: number, field: keyof PlayerStats, value: any) => {
    if (!selectedParty) return;
    const updatedStats: PlayerStats[] = [...selectedParty.playerStats];
    (updatedStats[playerIndex] as any)[field] = value;
    setSelectedParty({
      ...selectedParty,
      playerStats: updatedStats,
    });
  };

  const deleteParty = async (partyId: number) => {
    if (window.confirm(`Delete party ${partyId}?`)) {
      try {
        await api.delete(`/parties/${partyId}`);
        setParties(prevParties => prevParties.filter(party => party.id !== partyId));
        toast.success('Party deleted successfully');
      } catch (error) {
        console.error("Error deleting party:", error);
        toast.error('Failed to delete party');
      }
    }
  };

  return (
    <>
      <style>{cssStyles}</style>
      <div style={{ padding: '20px' }}>
        {isLoading && parties.length === 0 && (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            Loading parties...
          </div>
        )}

        {parties.map((party, i) => (
          <div
            key={party.id}
            ref={parties.length === i + 1 ? lastPartyElementRef : undefined}
            style={{ marginBottom: '20px' }}
          >
            <div style={{ padding: '8px', marginLeft: '40px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span>{new Date(party.date).toLocaleDateString()}</span>
              <button
                onClick={() => deleteParty(party.id)}
                className="button-danger"
                style={{
                  ...styles.button,
                  ...styles.dangerButton
                }}
              >
                Delete
              </button>
            </div>

            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Player</th>
                  <th style={styles.th}>Position</th>
                  <th style={styles.th}>Points</th>
                  <th style={styles.th}>Rebuys</th>
                  <th style={styles.th}>Out Time</th>
                  <th style={styles.th}>Gains</th>
                </tr>
              </thead>
              <tbody>
                {party.playerStats.map((stat, statIndex) => (
                  <tr
                    key={`${party.id}-${stat.player.id}-${statIndex}`}
                    className="table-row"
                  >
                    <td style={styles.td}>{stat.player.name}</td>
                    <td style={styles.td}>{stat.position}</td>
                    <td style={styles.td}>{stat.points}</td>
                    <td style={styles.td}>{stat.rebuys}</td>
                    <td style={styles.td}>
                      {stat.outAt
                        ? `${new Date(stat.outAt).getHours().toString().padStart(2, '0')}:${new Date(stat.outAt).getMinutes().toString().padStart(2, '0')}:${new Date(stat.outAt).getSeconds().toString().padStart(2, '0')}`
                        : 'N/A'}
                    </td>
                    <td style={styles.td}>{stat.gains}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button
              onClick={() => openModal(party)}
              className="button-primary"
              style={{
                ...styles.button,
                ...styles.primaryButton,
                marginTop: '10px'
              }}
            >
              Edit
            </button>
          </div>
        ))}

        {isModalOpen && selectedParty && ReactDOM.createPortal(
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000
            }}
          >
            <div
              style={{
                backgroundColor: 'white',
                padding: '24px',
                borderRadius: '8px',
                maxWidth: '600px',
                width: '90%',
                maxHeight: '90vh',
                overflow: 'auto'
              }}
            >
              <h2 style={{ marginBottom: '16px' }}>Edit Party</h2>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px' }}>Date:</label>
                <input
                  type="datetime-local"
                  value={selectedParty.date.slice(0, 16)}
                  onChange={(e) => setSelectedParty({
                    ...selectedParty,
                    date: new Date(e.target.value).toISOString()
                  })}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #E5E7EB',
                    borderRadius: '4px'
                  }}
                />
              </div>

              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Player</th>
                    <th style={styles.th}>Position</th>
                    <th style={styles.th}>Points</th>
                    <th style={styles.th}>Rebuys</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedParty.playerStats.map((stat, index) => (
                    <tr key={stat.id} className="table-row">
                      <td style={styles.td}>{stat.player.name}</td>
                      <td style={styles.td}>
                        <input
                          type="number"
                          value={stat.position}
                          onChange={(e) => editStat(index, 'position', parseInt(e.target.value))}
                          style={{
                            width: '60px',
                            padding: '4px',
                            border: '1px solid #E5E7EB',
                            borderRadius: '4px'
                          }}
                        />
                      </td>
                      <td style={styles.td}>
                        <input
                          type="number"
                          value={stat.points}
                          onChange={(e) => editStat(index, 'points', parseInt(e.target.value))}
                          style={{
                            width: '60px',
                            padding: '4px',
                            border: '1px solid #E5E7EB',
                            borderRadius: '4px'
                          }}
                        />
                      </td>
                      <td style={styles.td}>
                        <input
                          type="number"
                          value={stat.rebuys}
                          onChange={(e) => editStat(index, 'rebuys', parseInt(e.target.value))}
                          style={{
                            width: '60px',
                            padding: '4px',
                            border: '1px solid #E5E7EB',
                            borderRadius: '4px'
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{ marginTop: '24px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  onClick={closeModal}
                  className="button-danger"
                  style={{
                    ...styles.button,
                    ...styles.dangerButton
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveChanges}
                  className="button-primary"
                  style={{
                    ...styles.button,
                    ...styles.primaryButton
                  }}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
      </div>
    </>
  );
};

export default PartyPage;

