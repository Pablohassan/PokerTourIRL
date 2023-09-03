import React from 'react';
import { Player } from './interfaces';
import { Button, Table, TableBody, TableColumn, TableHeader, TableRow, TableCell } from '@nextui-org/react';
import bgReview from '../assets/bgpokerreview.png'
import { useNavigate } from 'react-router-dom';

interface ReviewSelectedPlayersProps {
  selectedPlayers: Player[];
  onConfirm: () => void;
}

const blindLevels = [
  { small: 10, big: 20, duration: '20m' },
  { small: 25, big: 50, duration: '20m' },
  { small: 50, big: 100, duration: '20m' },
  { small: 100, big: 200, duration: '20m' },
  { small: 150, big: 300, duration: '20m' },
  { small: 200, big: 400, duration: '20m' },
  { small: 300, big: 600, duration: '20m' },
  { small: 400, big: 800, duration: '20m' },
  { small: 500, big: 1000, duration: '20m' },
  { small: 600, big: 1200, duration: '20m' },
  { small: 700, big: 1400, duration: '20m' },
  { small: 800, big: 1600, duration: '20m' },
  { small: 900, big: 1800, duration: '20m' },
  { small: 1000, big: 2000, duration: '20m' },
  { small: 1500, big: 3000, duration: '20m' },
  { small: 2000, big: 4000, duration: '20m' },
]

const ReviewSelectedPlayers: React.FC<ReviewSelectedPlayersProps> = ({ selectedPlayers,onConfirm}) => {
  const navigate = useNavigate();
  return (
    <div>
      <div className="bg-cover bg-center h-screen w-full flex justify-center items-center" style={{ backgroundImage: `url(${bgReview})` }}>
      <div className="h-full flex justify-center items-center p-10  blur-md invert drop-shadow-xl">
          <div className="flex-1 flex flex-col items-center justify-center border-2 border-white  bg-auto bg-black">
            <h3 className="text-xl text-white mb-4 ">Joueurs inscrits</h3>
            <ul className="mb-8 pb-24">
              {selectedPlayers.map(player => (
                <li className=" text-lg text-white shadow-xl " key={player.id}>
              {player.name}</li>
              ))}
            </ul>
            <div className="space-y-4 p-2 m-2">
              <Button style={{padding:"2px", margin:"10px",fontWeight:"bold"}}  color="success" onClick={onConfirm}>Confirm and Start Game</Button>
              <Button color="danger" onClick={() => navigate("/partypage")}>Back</Button>
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="text-xl text-white mb-4">Blinds Structure</div>
            <table className="text-white border-collapse border-2 border-white w-full">
              <thead>
                <tr>
                  <th className="border-1 border-white p-2 ">Level</th>
                  <th className="border-1 border-white p-2">Small Blind</th>
                  <th className="border-1 border-white p-2">Big Blind</th>
                  <th className="border-1 border-white p-2">Duration</th>
                </tr>
              </thead>
              <tbody>
                {blindLevels.map((level, index) => (
                  <tr key={index}>
                    <td className="border-2 border-white rounded-md p-2">{index + 1}</td>
                    <td className="border-2 border-white p-2">{level.small}</td>
                    <td className="border-2 border-white p-2">{level.big}</td>
                    <td className="border-2 border-white p-2">{level.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReviewSelectedPlayers;