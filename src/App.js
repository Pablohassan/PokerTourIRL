import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Navbar } from "@nextui-org/react";
import api from "./api";
import { Layout } from "./components/layout";
import { useRoutes, Routes, Route } from "react-router-dom";
import { PlayerRanking } from "./components/PLayerRanking";
import PartyResults from "./components/PartyResults";
import StartGame from "./components/StartGame";
import { SelectedPlayers } from "./components/SelectedPlayers";
import Ak from "./components/PokerLogo";
import { ClerkProvider, SignedIn, SignedOut, SignOutButton, RedirectToSignIn, SignIn, SignUp, } from "@clerk/clerk-react";
import AddPlayer from "./components/AddPlayer";
console.log(import.meta.env.VITE_REACT_APP_CLERK_PUBLISHABLE_KEY);
if (!import.meta.env.VITE_REACT_APP_CLERK_PUBLISHABLE_KEY) {
    throw new Error("Missing Publishable Key");
}
const clerkPubKey = import.meta.env.VITE_REACT_APP_CLERK_PUBLISHABLE_KEY;
function App() {
    const [selectedPlayers, setSelectedPlayers] = useState([]);
    const [players, setPlayers] = useState([]);
    const [parties, setParties] = useState([]);
    const [stats, setStats] = useState([]);
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
        }
        catch (error) {
            console.log("error fetching players or parties:", error);
        }
    };
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
            element: (_jsx("h1", { className: "bg-blue-500 text-white p-4", children: "Welcome to the App" })),
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
            element: (_jsx(StartGame, { selectedPlayers: selectedPlayers, players: players, setParties: setParties, updateAfterGameEnd: fetchPlayersAndParties, handlePlayerSelect: handlePlayerSelect })),
        },
    ]);
    return (_jsxs("div", { style: { width: '100%' }, children: [_jsxs(ClerkProvider, { publishableKey: clerkPubKey, children: [_jsx(SignedIn, { children: _jsx(Layout, { children: _jsxs(Navbar, { shouldHideOnScroll: true, variant: "sticky", children: [_jsx(Navbar.Brand, { children: _jsx(Ak, {}) }), _jsxs(Navbar.Content, { variant: "underline", children: [_jsx(Navbar.Link, { hideIn: "xs", href: "/ranking", children: "Ranking" }), _jsx(Navbar.Link, { hideIn: "xs", href: "/startGame", children: "Start Partie" }), _jsx(Navbar.Link, { href: "/results", children: "Results" }), _jsx(Navbar.Link, { href: "/addplayer", children: "Add player" })] }), _jsx(SignOutButton, {})] }) }) }), _jsxs(SignedOut, { children: [_jsx(Layout, { children: _jsxs(Navbar, { shouldHideOnScroll: true, variant: "sticky", children: [_jsx(Navbar.Brand, { children: _jsx(Ak, {}) }), _jsxs(Navbar.Content, { hideIn: "xs", variant: "underline", children: [_jsx(Navbar.Link, { href: "/sign-up/*", children: "Sign Up" }), _jsx(Navbar.Link, { href: "/sign-in/*", children: "Sign in" })] }), _jsxs(Navbar.Content, { children: [_jsx(Navbar.Link, { href: "/ranking", children: "Ranking" }), _jsx(Navbar.Item, { children: _jsx(SignedOut, {}) })] }), _jsx(SignOutButton, {})] }) }), _jsxs(Routes, { children: [_jsx(Route, { path: "/sign-in/*", element: _jsx(SignIn, {}) }), _jsx(Route, { path: "/sign-up/*", element: _jsx(SignUp, {}) }), _jsx(Route, { path: "/*", element: _jsx(RedirectToSignIn, {}) })] }), ";"] })] }), _jsx(SelectedPlayers, { selectedPlayers: selectedPlayers }), element] }));
}
export default App;
//# sourceMappingURL=App.js.map