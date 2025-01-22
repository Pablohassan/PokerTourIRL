import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import api from "./api";
import { useRoutes } from "react-router-dom";
import { PlayerRanking } from "./components/PLayerRanking";
import PartyResults from "./components/PartyResults";
import StartGame from "./components/StartGame";
import PartyPage from "./components/PartyPage";
import bourlyimage from "./assets/bourlypoker3.webp";
import { Menu } from "./components/Menu";
import { cn } from "./lib/utils";
import { motion } from "framer-motion";
// import Ak from "./components/PokerLogo";
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn, SignIn, SignUp, } from "@clerk/clerk-react";
import AddPlayer from "./components/AddPlayer";
if (!import.meta.env.VITE_REACT_APP_CLERK_PUBLISHABLE_KEY) {
    throw new Error("Missing Publishable Key");
}
const clerkPubKey = import.meta.env.VITE_REACT_APP_CLERK_PUBLISHABLE_KEY;
export default function App() {
    const [selectedPlayers, setSelectedPlayers] = useState([]);
    const [players, setPlayers] = useState([]);
    const [parties, setParties] = useState([]);
    const [stats, setStats] = useState([]);
    const [championnat, setChampionnat] = useState([]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [blindIndex, setBlindIndex] = useState(0);
    useEffect(() => {
        const fetchChampionnat = async () => {
            try {
                const response = await api.get("/tournaments");
                // Si vous souhaitez stocker tous les tournois dans le tableau:
                const formattedChampionnat = response.data.map((t) => ({
                    id: t.id,
                    year: t.year,
                    createdAt: new Date(t.createdAt)
                }));
                setChampionnat(formattedChampionnat);
            }
            catch (error) {
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
        }
        catch (error) {
            console.log("error fetching players or parties:", error);
        }
        finally {
            // S'assurer que l'état de chargement est mis à jour quelle que soit l'issue des requêtes
            setIsLoading(false);
        }
    };
    useEffect(() => {
        fetchPlayersAndParties();
    }, []);
    const handlePlayerSelect = (playerId) => {
        const player = players.find((player) => player.id === playerId);
        if (player) {
            if (selectedPlayers.some((selectedPlayer) => selectedPlayer.id === playerId)) {
                setSelectedPlayers(selectedPlayers.filter((selectedPlayer) => selectedPlayer.id !== playerId));
            }
            else {
                setSelectedPlayers([...selectedPlayers, player]);
            }
        }
    };
    let element = useRoutes([
        {
            path: "/",
            element: (_jsxs("div", { className: cn("relative w-full min-h-screen"), children: [_jsxs("div", { className: cn("absolute inset-0"), children: [_jsx("img", { src: bourlyimage, alt: "pokercouv", className: cn("w-full h-full object-cover") }), _jsx("div", { className: cn("absolute inset-0 bg-black/50") }), " "] }), _jsxs("div", { className: cn("relative z-10 container mx-auto pt-8"), children: [_jsxs("h1", { className: cn("text-red-200 text-4xl font-bold text-center mt-20 mb-6", "font-['DS-DIGI']" // Using your custom font
                                ), children: ["Welcome to the BoulyPokerTour", _jsx("p", { className: cn("text-xl mt-2 text-gray-300"), children: "This app is in beta version, so be nice please" })] }), _jsx(motion.button, { onClick: () => setIsMenuOpen(true), whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, className: cn("mx-auto mt-8 block px-6 py-3", "bg-green-900/40 text-green-100 rounded-md", "hover:bg-green-800/60 transition-colors", "border border-green-800/30", "text-2xl font-['DS-DIGI']"), children: "Enter the Game" })] })] })),
        },
        {
            path: "/partypage",
            element: (_jsx(PartyPage, {}))
        },
        {
            path: "/ranking",
            element: (_jsx(PlayerRanking, { players: players, playerScores: stats, selectedPlayers: selectedPlayers, handlePlayerSelect: handlePlayerSelect })),
        },
        {
            path: "/results",
            element: (_jsx(PartyResults, { players: players, playerStats: stats, parties: parties })),
        },
        {
            path: "/addplayer",
            element: _jsx(AddPlayer, {}),
        },
        {
            path: "/startGame",
            element: (_jsx(StartGame, { selectedPlayers: selectedPlayers, players: players, setParties: setParties, updateAfterGameEnd: fetchPlayersAndParties, handlePlayerSelect: handlePlayerSelect, championnat: championnat, setSelectedPLayers: setSelectedPlayers, blindIndex: blindIndex, setBlindIndex: setBlindIndex })),
        },
    ]);
    if (isLoading) {
        return _jsx("div", { className: cn("flex items-center justify-center min-h-screen"), children: "Loading..." });
    }
    return (_jsx("div", { className: cn("min-h-screen bg-background"), children: _jsxs(ClerkProvider, { publishableKey: clerkPubKey, children: [element, _jsx(Menu, { isOpen: isMenuOpen, onClose: () => setIsMenuOpen(false) }), _jsx(SignedIn, {}), _jsxs(SignedOut, { children: [_jsx(RedirectToSignIn, {}), _jsx(SignIn, {}), _jsx(SignUp, {})] })] }) }));
}
