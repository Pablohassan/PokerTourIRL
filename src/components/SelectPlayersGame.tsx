import { useEffect, useState } from 'react';
import { Modal, Button, ModalHeader, useDisclosure, ModalContent, ModalBody, ModalFooter,  Switch, Table, TableHeader, TableBody, TableCell, TableColumn, TableRow } from '@nextui-org/react';
import { Player, Tournaments } from './interfaces';
import toast from 'react-hot-toast';

interface CurrentGame {
  players: number[]; // Liste des ID des joueurs sélectionnés
  tournamentId: number | null; // ID du tournoi sélectionné
}

interface SelectPlayersProps {
  players: Player[];
  selectedPlayers: Player[];
  handlePlayerSelect: (playerId: number) => void;
  onStartGame: () => void;
  championnat: Tournaments[]
  selectedTournamentId: number | null;
  setSelectedTournamentId: (value: number) => void;
}

const SelectPlayersGame: React.FC<SelectPlayersProps> = ({ players, selectedPlayers, handlePlayerSelect, onStartGame }) => {
  const { isOpen, onClose, onOpenChange } = useDisclosure(); // The modal is open by default
  const [currentGame, setCurrentGame] = useState<CurrentGame>({
    players: selectedPlayers.map(p => p.id),
    tournamentId: null,
  });

  useEffect(() => {
    onOpenChange();
  }, []);

  const handleStartGame = () => {
    if (selectedPlayers.length < 4) {
      toast("séllectionne plus de 4 joueurs");
      return;
    }
    onStartGame();
    onClose();  // <-- Close the modal here
  };

  const onSelectPlayer = (playerId: number) => {
    setCurrentGame((prevGame) => {
      const isAlreadySelected = prevGame.players.includes(playerId);

      return {
        ...prevGame,
        players: isAlreadySelected
          ? prevGame.players.filter(id => id !== playerId)
          : [...prevGame.players, playerId]
      };
    });
  };

  const handlePlayerChange = (playerId: number) => {

    onSelectPlayer(playerId);
    handlePlayerSelect(playerId);
  };


  return (

    <Modal style={{ height: "750px" }} isOpen={isOpen} isDismissable={true} closeButton={true}>
      <ModalContent >
        <ModalHeader > Nouvelle Partie:</ModalHeader>
        <ModalBody style={{ overflowY: "auto" }}  >
          <ModalHeader>Selection des Joueurs</ModalHeader>
          <Table>
            <TableHeader style={{ overflowY: "auto" }}>
              <TableColumn >
                Nom
              </TableColumn>
              <TableColumn>Joueur</TableColumn>
            </TableHeader>
            <TableBody style={{ overflowY: "auto" }}>
              {players.map((player) => (
                <TableRow key={player.id}>

                  <TableCell>

                    <Switch size="sm"

                      onChange={() => handlePlayerChange(player.id)}
                    />
                  </TableCell>
                  <TableCell> <div className='text-lg'>{player.name}</div> </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className='bg-[length:200px_100px]  bg-black'>
            <Button style={{ margin: "2px", fontWeight: "bolder", }} variant='bordered' color='warning' onClick={() => onClose()}>Cancel</Button>
            <Button color='success' style={{ margin: "2px", fontWeight: "bolder" }} onClick={handleStartGame}>Start Game</Button>
          </div>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
};
export default SelectPlayersGame