import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from "react";
import { Navbar, Link, NavbarBrand, NavbarContent, NavbarItem } from "@nextui-org/react";
import api from "./api";
import { useRoutes, Routes, Route } from "react-router-dom";
import { PlayerRanking } from "./components/PLayerRanking";
import PartyResults from "./components/PartyResults";
import StartGame from "./components/StartGame";
import PartyPage from "./components/PartyPage";
import PokerLogo from "./components/PokerLogo";
// import Ak from "./components/PokerLogo";
import { ClerkProvider, SignedIn, SignedOut, SignOutButton, RedirectToSignIn, SignIn, SignUp, } from "@clerk/clerk-react";
import AddPlayer from "./components/AddPlayer";
import axios from "axios";
console.log(import.meta.env.VITE_REACT_APP_CLERK_PUBLISHABLE_KEY);
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
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const fetchChampionnat = async () => {
            try {
                const response = await axios.get("http://localhost:3000/tournaments");
                // Si vous souhaitez stocker tous les tournois dans le tableau:
                setChampionnat(response.data.map((t) => ({
                    id: t.id,
                    year: t.year,
                    createdAt: new Date(t.createdAt)
                })));
            }
            catch (error) {
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
        }
        catch (error) {
            console.log("error fetching players or parties:", error);
        }
        setIsLoading(false);
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
            element: (_jsx(StartGame, { selectedPlayers: selectedPlayers, players: players, setParties: setParties, updateAfterGameEnd: fetchPlayersAndParties, handlePlayerSelect: handlePlayerSelect, championnat: championnat, setSelectedPLayers: setSelectedPlayers })),
        },
    ]);
    return (_jsxs("div", { children: [_jsxs(ClerkProvider, { publishableKey: clerkPubKey, children: [_jsx(SignedIn, { children: isLoading ? (_jsx("div", { children: "Loading..." })) : (_jsxs(Navbar, { position: "static", className: "", children: [_jsx(NavbarBrand, { children: _jsx(PokerLogo, {}) }), _jsxs(NavbarContent, { className: "sm:flex gap-4", justify: "center", children: [_jsx(NavbarItem, { children: _jsx(Link, { color: "foreground", href: "/ranking", children: "Ranking" }) }), _jsx(NavbarItem, { children: _jsx(Link, { color: "foreground", href: "/startGame", children: "Start Partie" }) }), _jsx(Link, { href: "/results", children: "Results" }), _jsx(Link, { href: "/addplayer", children: "Add player" }), _jsx(Link, { href: "/partypage", children: "All Parties" })] }), _jsx(SignOutButton, {})] })) }), _jsxs(SignedOut, { children: [_jsxs(Navbar, { shouldHideOnScroll: true, children: [_jsx(NavbarBrand, {}), _jsxs(NavbarContent, { children: [_jsx(NavbarItem, { children: _jsx(Link, { href: "/sign-up/*", children: "Sign Up" }) }), _jsx(Link, { href: "/sign-in/*", children: "Sign in" })] }), _jsxs(NavbarContent, { children: [_jsx(Link, { href: "/ranking", children: "Ranking" }), _jsx(NavbarItem, { children: _jsx(SignedOut, {}) })] }), _jsx(SignOutButton, {})] }), _jsxs(Routes, { children: [_jsx(Route, { path: "/sign-in/*", element: _jsx(SignIn, {}) }), _jsx(Route, { path: "/sign-up/*", element: _jsx(SignUp, {}) }), _jsx(Route, { path: "/*", element: _jsx(RedirectToSignIn, {}) })] }), ";"] })] }), element] }));
}
//# sourceMappingURL=App.js.map