import { useState, useEffect } from "react";
import api from "./api";
import { useRoutes } from "react-router-dom";
import { PlayerRanking } from "./components/PLayerRanking";
import PartyResults from "./components/PartyResults";
import StartGame from "./components/StartGame";
import PartyPage from "./components/PartyPage";
import bourlyimage from"./assets/bourlypoker3.webp"

// import Ak from "./components/PokerLogo";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,

  RedirectToSignIn,
  SignIn,
  SignUp,
  SignInButton,
} from "@clerk/clerk-react";
import {
  PlayerStats,
  Player,
  Parties,Tournaments
} from "./components/interfaces";
import AddPlayer from "./components/AddPlayer";
import axios from "axios";



if (!import.meta.env.VITE_REACT_APP_CLERK_PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}
const clerkPubKey = import.meta.env.VITE_REACT_APP_CLERK_PUBLISHABLE_KEY;

export default function App() {
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [parties, setParties] = useState<Parties[]>([]);
  const [stats, setStats] = useState<PlayerStats[]>([]);
  const [championnat, setChampionnat] = useState<Tournaments[]>([]);
  // const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [blindIndex, setBlindIndex] = useState(0);

   useEffect(() => {
    const fetchChampionnat = async () => {
  try {
    const response = await axios.get("https://api.bourlypokertour.fr/tournaments");
    
    // Si vous souhaitez stocker tous les tournois dans le tableau:
    const formattedChampionnat = response.data.map((t: any) => ({
      id: t.id,
      year: t.year,
      createdAt: new Date(t.createdAt)
    }));
    setChampionnat(formattedChampionnat);
  } catch (error) {
    console.error("Error fetching championnat: ", error);
    // Optionally, handle the error in the UI
  }
};

fetchChampionnat();
}, []); // Runs only on the first render





const fetchPlayersAndParties = async () => {
  try {
    // Exécuter les appels API en parallèle
    const [resPlayers, resParties, restStats] = await Promise.all([
      api.get("/player"),
      api.get("/parties"),
      api.get("/playerstats"),
    ]);

    // Une fois toutes les requêtes terminées, mettre à jour l'état avec les données
    setPlayers(resPlayers.data);
    setParties(resParties.data);
    setStats(restStats.data);
  } catch (error) {
    console.log("error fetching players or parties:", error);
  } finally {
    // S'assurer que l'état de chargement est mis à jour quelle que soit l'issue des requêtes
    setIsLoading(false);
  }
};

useEffect(() => {
  fetchPlayersAndParties();
}, []);


  const handlePlayerSelect = (playerId: number) => {
    const player = players.find((player) => player.id === playerId);
    if (player) {
      if (
        selectedPlayers.some((selectedPlayer) => selectedPlayer.id === playerId)
      ) {
        setSelectedPlayers(
          selectedPlayers.filter(
            (selectedPlayer) => selectedPlayer.id !== playerId
          )
        );
      } else {
        setSelectedPlayers([...selectedPlayers, player]);
      }
    }
  };

  let element = useRoutes([
    {
      path: "/",
      element: (
        <div >

<div  className=" text-red-200 ">Welcome to the BoulyPokerTour, this app in alpha version so be nice please </div>
<SignInButton>
  Deconnexion
</SignInButton>
<img src={bourlyimage} alt="pokercouv" className="w-1/2" style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto' }} />

</div>

      ),
    },
    {
path:"/partypage",
element:( <PartyPage

/>)


    },
    {
      path: "/ranking",
      element: (
        <PlayerRanking
          players={players}
          playerScores={stats}
          selectedPlayers={selectedPlayers}
          handlePlayerSelect={handlePlayerSelect}
        />
      ),
    },
    {
      path: "/results",
      element: (
        <PartyResults players={players} playerStats={stats} parties={parties} />
      ),
    },
    {
      path: "/addplayer",
      element: <AddPlayer />,
    },
    {
      path: "/startGame",
      element: (
        <StartGame 
          selectedPlayers={selectedPlayers}
          players={players}
          setParties={setParties}
          updateAfterGameEnd={fetchPlayersAndParties}
          handlePlayerSelect={handlePlayerSelect}
          championnat={championnat} 
          setSelectedPLayers={setSelectedPlayers}    
          blindIndex={blindIndex}  
          setBlindIndex={setBlindIndex}
          

           />
      ),
    },
  ]);

  if (isLoading) {
    return <div>Loading...</div>; // Or any other loading indicator
  }

  return (
    <div>
      <ClerkProvider publishableKey={clerkPubKey} >
        {element}
      <SignedIn>
       
    
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
        <SignIn />
        <SignUp />
      </SignedOut>
      </ClerkProvider>
    </div>
  );
}


