import { useEffect, useState , useCallback} from 'react';
import pLimit from 'p-limit';
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Button, Modal } from '@nextui-org/react';
import api from '../api'; // replace with your actual API import
import { PlayerStats } from './interfaces';

interface Player {
  id: number;
  name: string;
}

interface Party {
  id: number;
  date: string;
  playerStats: PlayerStats[];
}

export const PartyPage = () => {
  const [parties, setParties] = useState<Party[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedParty, setSelectedParty] = useState<Party | null>(null);

  useEffect(() => {
    const fetchParties = async () => {
      try {
        const response = await api.get("/parties");
        const allParties = response.data;
        const limit = pLimit(5);
  
        // Fetch detailed stats for each party
        const partiesWithStats = await Promise.all(allParties.map((party: Party) => limit(async () => {
          try {
            const statsResponse = await api.get(`/parties/${party.id}/stats`);
            return {
              ...party,
              playerStats: statsResponse.data,
            };
          } catch (error) {
            console.error(`Failed to fetch stats for party ${party.id}:`, error);
            // Return the party without stats
            return party;
          }
        })));
  
        setParties(partiesWithStats);
      } catch (error) {
        console.error('Failed to fetch parties:', error);
      }
    };
  
    fetchParties();
  }, []);
  
  const openModal = useCallback((party: Party) => {
    setSelectedParty(party);
    setModalOpen(true);
  }, []);

  const closeModal = () => {
    setModalOpen(false);
    setSelectedParty(null);
  };


  const updateAllPlayerStats = async () => {
    if (!selectedParty) return;
  
    try {
      // Prepare the data for the API call
      const updates = selectedParty.playerStats.map((stat) => ({
        id: stat.id,  // Assuming each playerStat has an 'id' field
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


  const editStat = (playerIndex: number, field: keyof PlayerStats, value: any) => {
    if (!selectedParty) return;
    const updatedStats: PlayerStats[] = [...selectedParty.playerStats];
    (updatedStats[playerIndex] as any )[field] = value;
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
      const updatedParties = parties.filter(party => party.id !== partyId);
      setParties(updatedParties);
    } catch (error) {
      console.error("Error deleting the party:", error);
      // Handle error accordingly
    }
  };

  return (
    <div>
      {parties.map((party, i) => (
        <div key={i} style={{ marginBottom: '20px' }}>
          <div className='p-2 ml-10'  >
            {new Date(party.date).toLocaleDateString()}
            <Button style={{marginLeft:"10px"}}
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
          <Button
            size="sm"
            color="primary"
            onClick={() => openModal(party)}
          >
            Edit
          </Button>
        </div>
      ))}



    {isModalOpen && selectedParty && (
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <h2>Edit Party</h2>
          {selectedParty.playerStats.map((stat, i) => (
            <div key={i}>
              <input
                type="number"
                value={stat.position}
                onChange={(e) => editStat(i, 'position', Number(e.target.value))}
              />
              <input
                type="number"
                value={stat.points}
                onChange={(e) => editStat(i, 'points', Number(e.target.value))}
              />
              <input
                type="number"
                value={stat.rebuys}
                onChange={(e) => editStat(i, 'rebuys', Number(e.target.value))}
              />
            </div>
          ))}
          <Button onClick={updateAllPlayerStats}>Save</Button>
          <Button onClick={closeModal}>Cancel</Button>
        </Modal>
      )}
    </div>
  );
};

export default PartyPage;
