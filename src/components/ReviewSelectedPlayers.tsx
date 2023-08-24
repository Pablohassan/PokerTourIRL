import React from 'react';
import { Player } from './interfaces';
import { Button } from '@nextui-org/react';
import bgReview from '../assets/bgpokerreview.png'
import { useNavigate } from 'react-router-dom';

interface ReviewSelectedPlayersProps {
  selectedPlayers: Player[];
  onConfirm: () => void;
}



const ReviewSelectedPlayers: React.FC<ReviewSelectedPlayersProps> = ({ selectedPlayers,onConfirm}) => {
  const navigate = useNavigate();
  return (
    <div>
   <div className="bg-cover bg-center h-screen w-full flex flex-col justify-center items-center border-x-4 border-white" style={{ backgroundImage: `url(${bgReview})`}}>  
      <h3 className='text-xl text-white'>Validez la sellection </h3>
      <div className='gap-x-10'>
      <ul>
        {selectedPlayers.map(player => (
          <li className="text-lg  text-white  " key={player.id}>{player.name}</li>
        ))}
      </ul>
      </div>
      <div space-y-100  className='p-2 m-2 text-color-black' >
      <Button color='success' onClick={onConfirm}>Confirm and Start Game</Button>
      </div>
      <div className='p-2 m-2 text-color-white'>
      <Button  color='danger' onClick={()=> navigate("/partypage")}>Back </Button>
      </div>
    </div>
    </div>
  );
}

export default ReviewSelectedPlayers;