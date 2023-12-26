import React, { useState, useEffect } from "react";
import { Navbar, Link, NavbarBrand, NavbarContent, NavbarItem } from "@nextui-org/react";
import api from "./api";
import { useRoutes, Routes, Route,useNavigate } from "react-router-dom";
import { PlayerRanking } from "./components/PLayerRanking";
import PartyResults from "./components/PartyResults";
import StartGame from "./components/StartGame";
import PartyPage from "./components/PartyPage";
import PokerLogo from"./components/PokerLogo";

// import Ak from "./components/PokerLogo";
import {
  useUser,
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignOutButton,
  RedirectToSignIn,
  SignIn,
  SignUp,
} from "@clerk/clerk-react";
import {
  PlayerStats,
  Player,
  Parties,Tournaments
} from "./components/interfaces";
import AddPlayer from "./components/AddPlayer";
import axios from "axios";



console.log(import.meta.env.VITE_REACT_APP_CLERK_PUBLISHABLE_KEY);

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
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
    const fetchChampionnat = async () => {
  try {
    const response = await axios.get("http://api.bourlypokertour.fr/tournaments");
    // Si vous souhaitez stocker tous les tournois dans le tableau:
    setChampionnat(response.data.map((t: { id: any; year: any; createdAt: string | number | Date; }) => ({
      id: t.id,
      year: t.year,
      createdAt: new Date(t.createdAt)
    })));
  } catch (error) {
    console.error("Error fetching championnat: ", error);
  }
};

    fetchChampionnat();
    
  }, []);

  useEffect(() => {
    console.log("champi", championnat);
  }, [championnat]);

  useEffect(() => {
    fetchPlayersAndParties();
  }, []);

  const fetchPlayersAndParties = async () => {
    // Fetch players and parties from the server
    // and set the state with the received data
    try {
      const resPlayers = await api.get("/player");
      const resParties = await api.get("/parties");
      const restStats = await api.get("/playerstats");
      setPlayers(resPlayers.data);
      setParties(resParties.data);
      setStats(restStats.data);
      
    } catch (error) {
      console.log("error fetching players or parties:", error);
    }
    setIsLoading(false);
  };

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
        <h1 className="bg-blue-500 text-white p-4">Welcome to the App</h1>

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
          championnat={championnat} setSelectedPLayers={setSelectedPlayers}        />
      ),
    },
  ]);

  return (

    
    <div >
      <ClerkProvider publishableKey={clerkPubKey}>
        <SignedIn>
        {isLoading ? (
      <div>Loading...</div>
    ) : (
          
            <Navbar position="static" className="" >
              <NavbarBrand>
          <PokerLogo/>
              </NavbarBrand>
              <NavbarContent className="sm:flex gap-4" justify="center">
              <NavbarItem>
                
                <Link color="foreground" href="/ranking">Ranking</Link>
                </NavbarItem>
                <NavbarItem>
                <Link color="foreground"   href="/startGame">Start Partie</Link>
                </NavbarItem>
                <Link  href="/results">
                  Results
                </Link>
                <Link  href="/addplayer">Add player</Link>
                <Link  href="/partypage">All Parties</Link>
              </NavbarContent>
              
               
                {/* <Navbar.Item>
                <SignedOut></SignedOut>
              </Navbar.Item> */}
               <SignOutButton />
             
             
            </Navbar>
        
          )}
        </SignedIn>

        <SignedOut>
         
            <Navbar shouldHideOnScroll>
              <NavbarBrand>
              
              </NavbarBrand>
              <NavbarContent >
              <NavbarItem>
                <Link href="/sign-up/*">Sign Up</Link>
                </NavbarItem>
                <Link href="/sign-in/*">Sign in</Link>
              </NavbarContent>
              <NavbarContent>
                <Link href="/ranking">Ranking</Link>
                <NavbarItem>
                  <SignedOut></SignedOut>
                </NavbarItem>
              </NavbarContent>
              <SignOutButton />
            </Navbar>
         
          <Routes>
            <Route path="/sign-in/*" element={<SignIn />} />
            <Route path="/sign-up/*" element={<SignUp />} />
            <Route path="/*" element={<RedirectToSignIn />} />
          </Routes>
          ;
        </SignedOut>
      </ClerkProvider>
      {element}
    </div>
  );
}


