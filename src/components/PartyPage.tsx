import { useEffect, useState, useCallback} from 'react';
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Button } from '@nextui-org/react';
import api from '../api'; // replace with your actual API import
import { PlayerStats } from './interfaces';
import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

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
  // @ts-ignore
  const [page, setPage] = useState(1); // Page actuelle
  // @ts-ignore
  const [hasMore, setHasMore] = useState(true); // Indique s'il y a plus de données à charger
  // const observer = useRef<IntersectionObserver | null>(null);
  const limit = 15; // Limite d'éléments par page
  

  useEffect(() => {
    const fetchParties = async () => {
      try {
        const response = await api.get(`/parties?page=${page}&limit=${limit}`);
        const fetchedParties = response.data;

        const partiesWithStats = await Promise.all(fetchedParties.map(async (party: Party) => {
          const statsResponse = await api.get(`/parties/${party.id}/stats`);
          return {
            ...party,
            playerStats: statsResponse.data,
          };
        }));

        setParties(prevParties => [...prevParties, ...partiesWithStats]);
        setHasMore(fetchedParties.length === limit);
      } catch (error) {
        console.error('Erreur lors du chargement des parties:', error);
      }
    };

    fetchParties();
  }, [page]);
  // const lastPartyElementRef = useCallback((node: HTMLDivElement) => {
  //   if (observer.current) observer.current.disconnect();
  //   observer.current = new IntersectionObserver(entries => {
  //     if (entries[0].isIntersecting && hasMore) {
  //       setPage(prevPage => prevPage + 1);
  //     }
  //   });
  //   if (node) observer.current.observe(node);
  // }, [hasMore]);

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
    console.log("Sending date to update:", selectedParty.date);
    try {
      console.log("Sending date to update:", selectedParty.date);
      // Make the API call to update the party date
      await api.put(`/parties/${selectedParty.id}`, {
        date: new Date(selectedParty.date).toISOString(),
      });

      // Optionally, refetch parties list to reflect the updated date
      // fetchParties(); // Uncomment or implement this if you've set it up

      // Close the modal after update
      closeModal();
    } catch (error: unknown) {
      // First, we check if this is an AxiosError, which has a response property
      if (axios.isAxiosError(error)) {
        // Now TypeScript knows this is an Axios error, so `error.response` is accessible
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
        // This is a generic error object
        console.log('Error', error.message);
      } else {
        // This is for any other types of errors (unlikely, but safe fallback)
        console.log('An unexpected error occurred');
      }
    }
  };

  const updateAllPlayerStats = async () => {
    if (!selectedParty) return;

    try {
      // Prepare the data for the API call
      const updates = selectedParty.playerStats.map((stat) => ({
        id: stat.id, // Assuming each playerStat has an 'id' field
        data: {
          position: stat.position,
          points: stat.points,
          rebuys: stat.rebuys,
          // Add any other fields you want to update
        },
      }));

      // Make the API call to update all player stats for this party
      await api.put("/updateMultipleGamesResults", updates);

      // Close the modal and maybe refetch the party data
      closeModal();
    } catch (error) {
      console.error("An error occurred while updating the player stats:", error);
      // Handle the error accordingly
    }
  };

  const handleSaveChanges = async () => {
    await updateAllPlayerStats(); // Update player stats
    await updatePartyDate(); // Update party date
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
    if (window.confirm(`Supprimer la partie ${partyId}?`))
      try {
        // Send a DELETE request to the API
        await api.delete(`/parties/${partyId}`);

        // Remove the deleted party from local state
        const updatedParties = parties.filter((party) => party.id !== partyId);
        setParties(updatedParties);
      } catch (error) {
        console.error("Error deleting the party:", error);
        // Handle error accordingly
      }
  };

  return (
    <div>
      {parties.map((party, i) => (
        <div key={i} className="mb-20">
          <div className="p-2 ml-10">
            {new Date(party.date).toLocaleDateString()}
            <Button
              style={{ marginLeft: "10px" }}
              size="sm"
              color="danger"
              onClick={() => deleteParty(party.id)}
            >
              Delete
            </Button>
          </div>
          <Table aria-label="tableau general" style={{ padding: 10, width: '100%' }}>
            <TableHeader>
              <TableColumn>Player</TableColumn>
              <TableColumn>Position</TableColumn>
              <TableColumn>Points</TableColumn>
              <TableColumn>Rebuys</TableColumn>
              <TableColumn>Sortie</TableColumn>
              <TableColumn>Gains</TableColumn>
            </TableHeader>
            <TableBody>
              {party.playerStats.map((stat, i) => (
                <TableRow key={i}>
                  <TableCell>{stat.player.name}</TableCell>
                  <TableCell>{stat.position}</TableCell>
                  <TableCell>{stat.points}</TableCell>
                  <TableCell>{stat.rebuys}</TableCell>
                  <TableCell>{stat.outAt
                    ? `${new Date(stat.outAt).getHours().toString().padStart(2, '0')}:${new Date(stat.outAt).getMinutes().toString().padStart(2, '0')}:${new Date(stat.outAt).getSeconds().toString().padStart(2, '0')}`
                    : 'N/A'}</TableCell>
                  <TableCell>{stat.gains}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button size="sm" color="primary" onClick={() => openModal(party)}>
            Edit
          </Button>
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
            alignItems: 'center', 
            justifyContent: 'center', 
            zIndex: 1000 
          }}
        >
          <div 
            style={{ 
              backgroundColor: '#f0f0f0', 
              borderRadius: '10px', 
              maxWidth: '600px', 
              width: '100%', 
              padding: '20px',
              overflowY: 'auto',  
              maxHeight: '90vh'
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', marginBottom: '20px' }}>
                <h2>Edit Party Stats</h2>
                <div>{selectedParty.date}</div>
              </div>
              <div style={{ gridColumn: '1 / -1', marginBottom: '20px' }}>
                <label style={{ fontWeight: 'bold' }}>Date of Party:</label>
                <input
                  type="date"
                  value={selectedParty ? selectedParty.date.substring(0, 10) : ''}
                  onChange={(e) => {
                    if (selectedParty) {
                      setSelectedParty({
                        ...selectedParty,
                        date: e.target.value,
                      });
                    }
                  }}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', marginLeft: '10px' }}
                />
              </div>

              {selectedParty && selectedParty.playerStats.map((stat, i) => (
                <React.Fragment key={i}>
                  <div style={{ gridColumn: '1 / -1', fontWeight: 'bold', marginBottom: '10px' }}>{stat.player.name}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ marginBottom: '5px' }}>Position</div>
                    <input
                      type="number"
                      value={stat.position}
                      onChange={(e) => editStat(i, 'position', Number(e.target.value))}
                      style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', marginBottom: '20px' }}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ marginBottom: '5px' }}>Points</div>
                    <input
                      type="number"
                      value={stat.points}
                      onChange={(e) => editStat(i, 'points', Number(e.target.value))}
                      style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', marginBottom: '20px' }}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ marginBottom: '5px' }}>Rebuys</div>
                    <input
                      type="number"
                      value={stat.rebuys}
                      onChange={(e) => editStat(i, 'rebuys', Number(e.target.value))}
                      style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', marginBottom: '20px' }}
                    />
                  </div>
                </React.Fragment>
              ))}
              <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'space-around', marginTop: '20px' }}>
                <Button onClick={handleSaveChanges} style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Save</Button>
                <Button onClick={closeModal} style={{ padding: '10px 20px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Cancel</Button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default PartyPage;
