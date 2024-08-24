import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, Button, ButtonGroup } from "@nextui-org/react";
import {Player,  PlayerStats } from "./interfaces";

interface KillerSelectionProps{
games:PlayerStats[]
killer: boolean;
currentlyPlayingPlayers: (Player | undefined)[];
rebuyPlayerId: number | null;
  playerOutGame: number | null;
handlePlayerKillSelection: (playerId: number) => void;

}
const KillerSelectionModal :React.FC<KillerSelectionProps> = ({ killer, games, currentlyPlayingPlayers, rebuyPlayerId, playerOutGame, handlePlayerKillSelection }) => {
  return (
    <Modal isOpen={killer}>
      <ModalContent>
        <ModalHeader>Select a Killer</ModalHeader>
        <ModalBody>
          <div>
            {games &&
              games.map((game) => {
                const player = currentlyPlayingPlayers.find((p) => p?.id === game.playerId);
                if (player && !game.outAt && player.id !== rebuyPlayerId && player.id !== playerOutGame) {
                  return (
                    <ButtonGroup style={{ padding: "2px" }} key={player.id}>
                      <Button
                        variant="bordered"
                        color="warning"
                        onClick={() => handlePlayerKillSelection(player.id)}
                      >
                        {player.name}
                      </Button>
                    </ButtonGroup>
                  );
                }
                return null;
              })}
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default KillerSelectionModal;
