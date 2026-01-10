import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import api from "./api";
import { useRoutes } from "react-router-dom";
import { PlayerRanking } from "./components/PLayerRanking";
import PartyResults from "./components/PartyResults";
import StartGame from "./components/StartGame";
import PartyPage from "./components/PartyPage";
import PlayerPage from "./components/PlayerPage";
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
    const [testResults, setTestResults] = useState(null);
    useEffect(() => {
        const fetchChampionnat = async () => {
            try {
                const response = await api.get("/tournaments");
                // Ensure response.data is an array before mapping
                if (Array.isArray(response.data)) {
                    const formattedChampionnat = response.data.map((t) => ({
                        id: t.id,
                        year: t.year,
                        createdAt: new Date(t.createdAt)
                    }));
                    setChampionnat(formattedChampionnat);
                }
                else {
                    console.warn("Tournaments API did not return an array:", response.data);
                    setChampionnat([]); // Set empty array as fallback
                }
            }
            catch (error) {
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
        }
        catch (error) {
            console.log("error fetching players or parties:", error);
            // Set empty arrays on error to prevent crashes
            setPlayers([]);
            setParties([]);
            setStats([]);
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
                                ), children: ["Welcome to the BoulyPokerTour", _jsx("p", { className: cn("text-xl mt-2 text-gray-300"), children: "This app is in beta version, so be nice please" })] }), _jsx(motion.button, { onClick: () => setIsMenuOpen(true), whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, className: cn("mx-auto block px-6 py-2", "bg-green-900/40 text-green-100 rounded-md", "hover:bg-green-800/60 transition-colors", "border border-green-800/30", "text-2xl font-['DS-DIGI']"), children: "Enter the Game" })] })] })),
        },
        {
            path: "/partypage",
            element: (_jsx(PartyPage, {}))
        },
        {
            path: "/player/:playerId",
            element: (_jsx(PlayerPage, {}))
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
            element: (_jsx(StartGame, { selectedPlayers: selectedPlayers, players: players, setParties: setParties, updateAfterGameEnd: fetchPlayersAndParties, handlePlayerSelect: handlePlayerSelect, championnat: championnat, setSelectedPLayers: setSelectedPlayers, blindIndex: blindIndex, setBlindIndex: setBlindIndex, isLoading: isLoading })),
        },
    ]);
    return (_jsxs("div", { className: cn("min-h-screen bg-background"), children: [_jsxs(ClerkProvider, { publishableKey: clerkPubKey, children: [element, _jsx(Menu, { isOpen: isMenuOpen, onClose: () => setIsMenuOpen(false) }), _jsx(SignedIn, {}), _jsxs(SignedOut, { children: [_jsx(RedirectToSignIn, {}), _jsx(SignIn, {}), _jsx(SignUp, {})] })] }), testResults && (_jsx("div", { className: cn("fixed inset-0 bg-black/70 flex items-center justify-center z-50"), onClick: () => setTestResults(null), children: _jsxs("div", { className: cn("bg-slate-900 p-6 rounded-lg", "max-w-2xl w-[90%] max-h-[90vh] overflow-auto"), onClick: (e) => e.stopPropagation(), children: [_jsx("h2", { className: cn("text-2xl font-semibold mb-4 text-amber-400"), children: "Gains Calculation Test Results" }), _jsxs("div", { className: cn("mb-4"), children: [_jsxs("p", { className: cn("text-amber-300"), children: ["Total players: ", testResults.testParty.length] }), _jsxs("p", { className: cn("text-amber-300"), children: ["Total rebuys: ", testResults.totalRebuys] }), _jsxs("p", { className: cn("text-amber-300"), children: ["Total pot: ", testResults.totalPot, "\u20AC"] })] }), _jsx("div", { className: cn("overflow-hidden rounded-[5px] border border-amber-400 bg-slate-900"), children: _jsxs("table", { className: cn("w-full"), children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { className: cn("px-3 py-2 text-left text-sm font-semibold bg-blue-900/90 text-amber-400 border-b border-amber-400"), children: "Player" }), _jsx("th", { className: cn("px-3 py-2 text-left text-sm font-semibold bg-blue-900/90 text-amber-400 border-b border-amber-400"), children: "Position" }), _jsx("th", { className: cn("px-3 py-2 text-left text-sm font-semibold bg-blue-900/90 text-amber-400 border-b border-amber-400"), children: "Rebuys" }), _jsx("th", { className: cn("px-3 py-2 text-left text-sm font-semibold bg-blue-900/90 text-amber-400 border-b border-amber-400"), children: "Gains" })] }) }), _jsx("tbody", { children: testResults.results.map((result) => (_jsxs("tr", { className: cn("hover:bg-blue-900/50"), children: [_jsxs("td", { className: cn("px-3 py-2 text-sm text-amber-400 border-b border-amber-400/20"), children: ["Player ", result.playerId] }), _jsx("td", { className: cn("px-3 py-2 text-sm text-amber-400 border-b border-amber-400/20"), children: result.position }), _jsx("td", { className: cn("px-3 py-2 text-sm text-amber-400 border-b border-amber-400/20"), children: result.rebuys }), _jsxs("td", { className: cn("px-3 py-2 text-sm font-semibold border-b border-amber-400/20", result.gain >= 0 ? "text-green-400" : "text-red-400"), children: [result.gain >= 0 ? `+${result.gain.toFixed(2)}` : `${result.gain.toFixed(2)}`, "\u20AC"] })] }, result.playerId))) })] }) }), _jsx("div", { className: cn("mt-4 flex justify-end"), children: _jsx("button", { onClick: () => setTestResults(null), className: cn("px-4 py-2 bg-red-700 text-white rounded", "hover:bg-red-600 transition-colors"), children: "Close" }) })] }) }))] }));
}
