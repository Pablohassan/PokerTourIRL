import React, { FormEvent, useContext, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";


import {UIContext} from '../components/UiProvider'
import { Button, Card,  Table, Spacer, Input, TableHeader, TableColumn, TableBody, TableRow, TableCell} from "@nextui-org/react";

interface Player {
  id: number;
  name: string;
  phoneNumber: string;
}


interface UIContextProps {
  notify: (type: string, content: string, options?: {}, promiseOptions?: {}) => void;
}

function AddPlayer() {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");  // Add this lin
  const [players, setPlayers] = useState<Player[]>([]); 
  const  uiContext = useContext(UIContext);

  if (!uiContext) {
    throw new Error('UIContext is undefined, please ensure the component is wrapped with a <UIProvider>');
  }

  const { notify } = uiContext;

  

  // Add this useEffect hook to fetch the players when the component mounts
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await axios.get("https://api.bourlypokertour.fr/player");
        setPlayers(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPlayers();
  }, []);

  
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    
    // If the name is too short, show a warning toast and abort
    if (name.length < 3) {
      notify('warning', 'Player name must be at least 3 characters long');
      return;
    } 
    if (phoneNumber.length <9 || phoneNumber.length > 9) { 
      notify("Attention", "il manque un chiffre", "le format exigé pour le numero ","662123454")
      return
    
    }
      
  
    try {
      // Fetch all players
      const response = await axios.get("https://api.bourlypokertour.fr/player");
      const players = response.data;
  
      // Check if a player with the given name already exists
      const playerExists = players.some((player: { name: string }) => player.name.toLowerCase() === name.toLowerCase());
      
  
      // If the player already exists, show a warning toast and abort
      if (playerExists) {
        notify('warning', `Player ${name} already exists`);
        return;
      }
  
      // If the player doesn't exist, proceed to create a new player
      const postResponse = await axios.post("https://api.bourlypokertour.fr/players", { name, phoneNumber });
      
      // If the player is successfully created, show a success toast
      if (postResponse.data) {
        notify('success', `Player ${name} has been added successfully`);
      }
    } catch (error) {
      const axiosError = error as AxiosError; // Use type assertion to assert the error as an AxiosError
      console.error(axiosError);
  
      // If any other error occurs, show an error toast
      notify('error', 'An error occurred while creating the player');
    }
  };
  
  return (


    <div style={{ width:"380px", display:"flex", flexDirection:"column"}}>
    <div style={{ maxHeight: '500px', overflowY: 'auto' }}>

    <form  onSubmit={handleSubmit}>
      <Card style={{ width:"350px"}}>
        <div 
        
        // style={{
        //   textGradient: "45deg, $purple600 -20%, $pink600 10e0%",
        // }}
       >  Enter the player name :</div>
      
        <Input
        width="350px"
        height={100}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Your Name"
        />
         <Input
        width="350px"
        height={100}
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
          placeholder="Your Phone"
        />
      </Card>
      <Button type="submit">
        Create New Player
      </Button>
    </form>
      <Table >
        <TableHeader>
          <TableColumn>Id</TableColumn>
          <TableColumn>Joueurs dans le tournois </TableColumn>
          <TableColumn>Phone</TableColumn>
        </TableHeader>
        <TableBody>
          {players.map((player, index) => (
            <TableRow key={player.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{player.name}</TableCell>
              <TableCell>{player.phoneNumber}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
    <Spacer y={1} />
   
  </div>
  );
}

export default AddPlayer;
