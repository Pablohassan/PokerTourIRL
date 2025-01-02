import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import api from "./api";
import { useRoutes } from "react-router-dom";
import { PlayerRanking } from "./components/PLayerRanking";
import PartyResults from "./components/PartyResults";
import StartGame from "./components/StartGame";
import PartyPage from "./components/PartyPage";
import bourlyimage from "./assets/bourlypoker3.webp";
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
    // const [isMenuOpen, setIsMenuOpen] = React.useState(false);
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
            element: (_jsxs("div", { children: [_jsx("div", { className: " text-red-200 ", children: "Welcome to the BoulyPokerTour, this app in alpha version so be nice please " }), _jsx("img", { src: bourlyimage, alt: "pokercouv", className: "w-1/2", style: { display: 'block', marginLeft: 'auto', marginRight: 'auto' } })] })),
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
        return _jsx("div", { children: "Loading..." }); // Or any other loading indicator
    }
    return (_jsx("div", { children: _jsxs(ClerkProvider, { publishableKey: clerkPubKey, children: [element, _jsx(SignedIn, {}), _jsxs(SignedOut, { children: [_jsx(RedirectToSignIn, {}), _jsx(SignIn, {}), _jsx(SignUp, {})] })] }) }));
}
