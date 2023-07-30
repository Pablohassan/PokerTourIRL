import React, { useState, useEffect } from "react";
import { Navbar, Button, Link, Text, useTheme } from "@nextui-org/react";
import api from "./api";
import { Layout } from "./components/layout";
import { useRoutes, Routes, Route } from "react-router-dom";
import { PlayerRanking } from "./components/PLayerRanking";
import PartyResults from "./components/PartyResults";
import StartGame from "./components/StartGame";
import { SelectedPlayers } from "./components/SelectedPlayers";
import Ak from "./components/PokerLogo";
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
  Party
} from "./components/interfaces";
import AddPlayer from "./components/AddPlayer";

console.log(import.meta.env.VITE_REACT_APP_CLERK_PUBLISHABLE_KEY);

if (!import.meta.env.VITE_REACT_APP_CLERK_PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}
const clerkPubKey = import.meta.env.VITE_REACT_APP_CLERK_PUBLISHABLE_KEY;

function App() {
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [parties, setParties] = useState<Party[]>([]);
  const [stats, setStats] = useState<PlayerStats[]>([]);

  useEffect(() => {
    fetchPlayersAndParties();
  }, []);

  const fetchPlayersAndParties = async () => {
    // Fetch players and parties from the server
    // and set the state with the received data
    try {
      const resPlayers = await api.get("/player");
      const resParties = await api.get("/party");
      const restStats = await api.get("/playerstats");
      setPlayers(resPlayers.data);
      setParties(resParties.data);
      setStats(restStats.data);
    } catch (error) {
      console.log("error fetching players or parties:", error);
    }
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
        />
      ),
    },
  ]);

  return (
    <div style={{ width: '100%'} }>
      <ClerkProvider publishableKey={clerkPubKey}>
        <SignedIn>
          <Layout>
            <Navbar shouldHideOnScroll variant="sticky">
              <Navbar.Brand>
                <Ak />
              </Navbar.Brand>
              <Navbar.Content variant="underline">
                <Navbar.Link  hideIn="xs" href="/ranking">Ranking</Navbar.Link>
                <Navbar.Link  hideIn="xs" href="/startGame">Start Partie</Navbar.Link>
                <Navbar.Link  href="/results">
                  Results
                </Navbar.Link>
                <Navbar.Link  href="/addplayer">Add player</Navbar.Link>
              </Navbar.Content>
              
               
                {/* <Navbar.Item>
                <SignedOut></SignedOut>
              </Navbar.Item> */}
               <SignOutButton />
             
             
            </Navbar>
          </Layout>
        </SignedIn>

        <SignedOut>
          <Layout>
            <Navbar shouldHideOnScroll variant="sticky">
              <Navbar.Brand>
                <Ak />
              </Navbar.Brand>
              <Navbar.Content hideIn="xs" variant="underline">
                <Navbar.Link href="/sign-up/*">Sign Up</Navbar.Link>
                <Navbar.Link href="/sign-in/*">Sign in</Navbar.Link>
              </Navbar.Content>
              <Navbar.Content>
                <Navbar.Link href="/ranking">Ranking</Navbar.Link>
                <Navbar.Item>
                  <SignedOut></SignedOut>
                </Navbar.Item>
              </Navbar.Content>
              <SignOutButton />
            </Navbar>
          </Layout>
          <Routes>
            <Route path="/sign-in/*" element={<SignIn />} />
            <Route path="/sign-up/*" element={<SignUp />} />
            <Route path="/*" element={<RedirectToSignIn />} />
          </Routes>
          ;
        </SignedOut>
      </ClerkProvider>
      <SelectedPlayers selectedPlayers={selectedPlayers} />
      {element}
    </div>
  );
}

export default App;
