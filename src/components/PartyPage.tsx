import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react';
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


function calculateGains(playerStats: PlayerStats[]): number {
  return playerStats.reduce((sum, game) => {
    let gain = 0;
    if (game.position === 1) gain = game.totalCost * 0.6;
    else if (game.position === 2) gain = game.totalCost * 0.3;
    else if (game.position === 3) gain = game.totalCost * 0.1;
    return sum + Math.round(gain);
  }, 0);
}

export const PartyPage = () => {
  const [parties, setParties] = useState<Party[]>([]);

  useEffect(() => {
    const fetchParties = async () => {
      const response = await api.get("/parties");
      const allParties = response.data;

      // Fetch detailed stats for each party
      const partiesWithStats = await Promise.all(allParties.map(async (party: Party) => {
        const statsResponse = await api.get(`/parties/${party.id}/stats`);
        return {
          ...party,
          playerStats: statsResponse.data,
        };
      }));

      setParties(partiesWithStats);
    };

    fetchParties();
  }, []);
console.log("parties",parties)
  return (
    <div>
    {parties.map((party, i) => (
      <div key={i} style={{ marginBottom: '20px' }}>
        <div style={{marginLeft:10, fontWeight:'bold'}}  >{new Date(party.date).toLocaleDateString()}</div>
        <Table  style={{ padding:10, width: '100%' }}>
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
      </div>
    ))}
  </div>
  );
};

export default PartyPage;
