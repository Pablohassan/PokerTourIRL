import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react';
import api from '../api'; // replace with your actual API import

interface Player {
    id: number;
    name: string;
  }

interface PlayerStat {
    player: Player;
    position: number;
    points: number;
    rebuys: number;
}

interface Party {
  id: number;
  date: string;
  playerStats: PlayerStat[];
}

export const PartyPage = () => {
  const [parties, setParties] = useState<Party[]>([]);

  useEffect(() => {
    const fetchParties = async () => {
      const response = await api.get("/party");
      setParties(response.data);
    };

    fetchParties();
  }, []);

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
          </TableHeader>
          <TableBody>
            {party.playerStats.map((stat, i) => (
              <TableRow key={i}>
                <TableCell>{stat.player.name}</TableCell>
                <TableCell>{stat.position}</TableCell>
                <TableCell>{stat.points}</TableCell>
                <TableCell>{stat.rebuys}</TableCell>
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
