import React, { FormEvent, useContext, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";


import {UIContext} from '../components/UiProvider'
import { Button, Card, Grid, Input, Table, Spacer,Text} from "@nextui-org/react";

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
  const { notify } = useContext<UIContextProps>(UIContext);

  // Add this useEffect hook to fetch the players when the component mounts
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await axios.get("http://localhost:3000/player");
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
    if (phoneNumber.length <9){ 
      notify("Attention", "il manque un chiffre", "le format exigé pour le numero ","662123454")}
  
    try {
      // Fetch all players
      const response = await axios.get("http://localhost:3000/player");
      const players = response.data;
  
      // Check if a player with the given name already exists
      const playerExists = players.some((player: { name: string }) => player.name.toLowerCase() === name.toLowerCase());
      
  
      // If the player already exists, show a warning toast and abort
      if (playerExists) {
        notify('warning', `Player ${name} already exists`);
        return;
      }
  
      // If the player doesn't exist, proceed to create a new player
      const postResponse = await axios.post("http://localhost:3000/player", { name, phoneNumber });
      
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


    <Grid.Container css={{ w:"380px"}} direction="column">
    <div style={{ maxHeight: '500px', overflowY: 'auto' }}>

    <form  onSubmit={handleSubmit}>
      <Card css={{ w:"350px"}}>
        <Text h1
        size={20}
        css={{
          textGradient: "45deg, $purple600 -20%, $pink600 100%",
        }}
        weight="bold">  Enter the player name :</Text>
      
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
      <Button type="submit" color="primary" auto ghost>
        Create New Player
      </Button>
    </form>
      <Table striped hoverable>
        <Table.Header>
          <Table.Column>Rank</Table.Column>
          <Table.Column>Joueurs dans le tournois </Table.Column>
          <Table.Column>Phone</Table.Column>
        </Table.Header>
        <Table.Body>
          {players.map((player, index) => (
            <Table.Row key={player.id}>
              <Table.Cell>{index + 1}</Table.Cell>
              <Table.Cell>{player.name}</Table.Cell>
              <Table.Cell>{player.phoneNumber}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
    <Spacer y={1} />
   
  </Grid.Container>
  );
}

export default AddPlayer;
