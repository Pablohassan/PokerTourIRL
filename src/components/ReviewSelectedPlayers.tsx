import React from 'react';
import { Player,Tournaments  } from './interfaces';
import { Button, Table, TableBody, TableColumn, TableHeader, TableRow, TableCell, Card, Spacer, getKeyValue } from '@nextui-org/react';
import bgReview from '../assets/reviewpoker.png'
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
]

const columns = [
  {
    key: "level",
    label: "Level",
  },
  {
    key: "small",
    label: "Small Blind",
  },
  {
    key: "big",
    label: "Big Blind",
  },
  {
    key: "duration",
    label: "Duration",
  },
];

const ReviewSelectedPlayers: React.FC<ReviewSelectedPlayersProps> = ({ selectedPlayers,selectedTournament,  onConfirm }) => {
  const navigate = useNavigate();

  const cardStyle = {
    maxWidth: '1400px',
    margin: '0 5px',
     fontFamily:'DS-Digital'

  };

  const sectionStyle = {
    padding: '10px',
     fontFamily:'DS-Digital'
  };

  const headerStyle = {
    fontSize: '24px',
    marginBottom: '16px',
    fontFamily:'DS-Digital'

  };


  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '110vh',
      width:"110%",
      marginTop:"30px",
      backgroundImage: `url(${bgReview})`,
      backgroundSize: 'cover'
    }}>
     
      <Card style={cardStyle}>
        <div style={{ display: 'flex' }}>
          <div style={sectionStyle}>
          {selectedTournament && (
              <div style={{ marginTop: '20px', color: 'black', fontSize: '2em', fontFamily:'DS-Digital' }}>
                Validation Tournoi : {selectedTournament.year}
              </div>
            )}
            <h3 style={headerStyle}>Validation Joueurs  </h3>
            <Spacer y={1} />
          
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              {selectedPlayers.map((player, index) => (
                <li
                  key={player.id}
                  style={{
                    backgroundColor: index % 2 === 0 ? 'black' : 'gray',
                    borderRadius: '5px',
                    color: 'white',
                    fontSize: '2em',
                    padding: '8px',
                    fontFamily:'DS-Digital'
                  }}
                >
                  {player.name}
                </li>
              ))}
            </ul>
           
            <Spacer y={1} />
            <div style={{ display: 'flex', justifyContent: 'flex-end', margin: "5px" }}>
              <Button size="lg" color="primary" onClick={onConfirm}>Confirm and Start Game</Button>
              <Spacer x={2} />
              <Button size="lg" color="danger" onFocus={focus} onClick={() => navigate("/partypage")}>Back</Button>
            </div>
          </div>
          <div style={sectionStyle}>
            <h3 style={headerStyle}>Blinds Structure</h3>
            <Spacer y={1} />
            <Table aria-label="Blinds Structure">
              <TableHeader columns={columns}>
                {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
              </TableHeader>
              <TableBody items={blindLevels}>
                {(item) => (
                  <TableRow  key={item.small}>
                    {(columnKey) => <TableCell style={{fontSize:"1em"}}>{getKeyValue(item, columnKey)}</TableCell>}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ReviewSelectedPlayers;
