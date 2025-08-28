import { useState, useEffect } from "react";
import api from "./api";
import { useRoutes } from "react-router-dom";
import { PlayerRanking } from "./components/PLayerRanking";
import PartyResults from "./components/PartyResults";
import StartGame from "./components/StartGame";
import PartyPage from "./components/PartyPage";
import PlayerPage from "./components/PlayerPage";
import bourlyimage from "./assets/bourlypoker3.webp"
import { Menu } from "./components/Menu";
import { cn } from "./lib/utils";
import { motion } from "framer-motion";

// import Ak from "./components/PokerLogo";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
  SignIn,
  SignUp,
} from "@clerk/clerk-react";
import {
  PlayerStats,
  Player,
  Parties, Tournaments
} from "./components/interfaces";
import AddPlayer from "./components/AddPlayer";

// Define the test results interface
interface TestResult {
  playerId: number;
  position: number;
  rebuys: number;
  gain: number;
}

interface TestResults {
  testParty: Array<{ playerId: number; position: number; rebuys: number }>;
  totalPot: number;
  totalRebuys: number;
  results: TestResult[];
}

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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [blindIndex, setBlindIndex] = useState(0);
  const [testResults, setTestResults] = useState<TestResults | null>(null);

  useEffect(() => {
    const fetchChampionnat = async () => {
      try {
        const response = await api.get("/tournaments");

        // Ensure response.data is an array before mapping
        if (Array.isArray(response.data)) {
          const formattedChampionnat = response.data.map((t: any) => ({
            id: t.id,
            year: t.year,
            createdAt: new Date(t.createdAt)
          }));
          setChampionnat(formattedChampionnat);
        } else {
          console.warn("Tournaments API did not return an array:", response.data);
          setChampionnat([]); // Set empty array as fallback
        }
      } catch (error) {
        console.error("Error fetching championnat: ", error);
        setChampionnat([]); // Set empty array on error
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
      // Ensure we have arrays before setting state
      setPlayers(Array.isArray(resPlayers.data) ? resPlayers.data : []);
      setParties(Array.isArray(resParties.data) ? resParties.data : []);
      setStats(Array.isArray(restStats.data) ? restStats.data : []);
    } catch (error) {
      console.log("error fetching players or parties:", error);
      // Set empty arrays on error to prevent crashes
      setPlayers([]);
      setParties([]);
      setStats([]);
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
        <div className={cn("relative w-full min-h-screen")}>
          <div className={cn("absolute inset-0")}>
            <img
              src={bourlyimage}
              alt="pokercouv"
              className={cn("w-full h-full object-cover")}
            />
            <div className={cn("absolute inset-0 bg-black/50")} /> {/* Dark overlay */}
          </div>
          <div className={cn("relative z-10 container mx-auto pt-8")}>
            <h1 className={cn(
              "text-red-200 text-4xl font-bold text-center mt-20 mb-6",
              "font-['DS-DIGI']" // Using your custom font
            )}>
              Welcome to the BoulyPokerTour
              <p className={cn("text-xl mt-2 text-gray-300")}>
                This app is in beta version, so be nice please
              </p>
            </h1>
            <motion.button
              onClick={() => setIsMenuOpen(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "mx-auto block px-6 py-2",
                "bg-green-900/40 text-green-100 rounded-md",
                "hover:bg-green-800/60 transition-colors",
                "border border-green-800/30",
                "text-2xl font-['DS-DIGI']"
              )}
            >
              Enter the Game
            </motion.button>
          </div>
        </div>
      ),
    },
    {
      path: "/partypage",
      element: (<PartyPage />)
    },
    {
      path: "/player/:playerId",
      element: (<PlayerPage />)
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
    return <div className={cn("flex items-center justify-center min-h-screen")}>Loading...</div>;
  }

  return (
    <div className={cn("min-h-screen bg-background")}>
      <ClerkProvider publishableKey={clerkPubKey}>
        {element}
        <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        <SignedIn />
        <SignedOut>
          <RedirectToSignIn />
          <SignIn />
          <SignUp />
        </SignedOut>
      </ClerkProvider>

      {/* Test Button
      <div className={cn("fixed bottom-4 right-4 z-50")}>
        <button
          onClick={runGainsCalculationTest}
          className={cn(
            "px-4 py-2",
            "bg-amber-600 text-white rounded shadow",
            "hover:bg-amber-500 transition-colors"
          )}
        >
          Test Gains Calculation
        </button>
      </div> */}

      {/* Test Results Modal */}
      {testResults && (
        <div
          className={cn("fixed inset-0 bg-black/70 flex items-center justify-center z-50")}
          onClick={() => setTestResults(null)}
        >
          <div
            className={cn(
              "bg-slate-900 p-6 rounded-lg",
              "max-w-2xl w-[90%] max-h-[90vh] overflow-auto"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className={cn("text-2xl font-semibold mb-4 text-amber-400")}>
              Gains Calculation Test Results
            </h2>
            <div className={cn("mb-4")}>
              <p className={cn("text-amber-300")}>Total players: {testResults.testParty.length}</p>
              <p className={cn("text-amber-300")}>Total rebuys: {testResults.totalRebuys}</p>
              <p className={cn("text-amber-300")}>Total pot: {testResults.totalPot}€</p>
            </div>
            <div className={cn("overflow-hidden rounded-[5px] border border-amber-400 bg-slate-900")}>
              <table className={cn("w-full")}>
                <thead>
                  <tr>
                    <th className={cn("px-3 py-2 text-left text-sm font-semibold bg-blue-900/90 text-amber-400 border-b border-amber-400")}>Player</th>
                    <th className={cn("px-3 py-2 text-left text-sm font-semibold bg-blue-900/90 text-amber-400 border-b border-amber-400")}>Position</th>
                    <th className={cn("px-3 py-2 text-left text-sm font-semibold bg-blue-900/90 text-amber-400 border-b border-amber-400")}>Rebuys</th>
                    <th className={cn("px-3 py-2 text-left text-sm font-semibold bg-blue-900/90 text-amber-400 border-b border-amber-400")}>Gains</th>
                  </tr>
                </thead>
                <tbody>
                  {testResults.results.map((result) => (
                    <tr key={result.playerId} className={cn("hover:bg-blue-900/50")}>
                      <td className={cn("px-3 py-2 text-sm text-amber-400 border-b border-amber-400/20")}>
                        Player {result.playerId}
                      </td>
                      <td className={cn("px-3 py-2 text-sm text-amber-400 border-b border-amber-400/20")}>
                        {result.position}
                      </td>
                      <td className={cn("px-3 py-2 text-sm text-amber-400 border-b border-amber-400/20")}>
                        {result.rebuys}
                      </td>
                      <td className={cn(
                        "px-3 py-2 text-sm font-semibold border-b border-amber-400/20",
                        result.gain >= 0 ? "text-green-400" : "text-red-400"
                      )}>
                        {result.gain >= 0 ? `+${result.gain.toFixed(2)}` : `${result.gain.toFixed(2)}`}€
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className={cn("mt-4 flex justify-end")}>
              <button
                onClick={() => setTestResults(null)}
                className={cn(
                  "px-4 py-2 bg-red-700 text-white rounded",
                  "hover:bg-red-600 transition-colors"
                )}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


