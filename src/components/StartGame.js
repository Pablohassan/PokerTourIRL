import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import api from "../api";
import { NewGameForm } from "./NewGameForm";
const StartGame = ({ selectedPlayers, handlePlayerSelect, players, setParties, updateAfterGameEnd, }) => {
    const [gameStarted, setGameStarted] = useState(false);
    const [games, setGames] = useState([]);
    const [timeLeft, setTimeLeft] = useState(20 * 60); // 20 minutes in seconds
    const [blind, setBlind] = useState(1); // Replace with your initial blind value
    const [outPlayers, setOutPlayers] = useState([]);
    const [newGame, setNewGame] = useState({
        date: new Date(),
        points: 0,
        rebuys: 0,
    });
    useEffect(() => {
        if (!gameStarted) {
            return;
        }
        const timer = setInterval(() => {
            setTimeLeft((time) => {
                if (time === 0) {
                    setBlind((blind) => blind * 2);
                    return 20 * 60; // reset time
                }
                else {
                    return time - 1;
                }
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);
    const handleNewGameChange = (event) => {
        setNewGame({ ...newGame, [event.target.name]: event.target.value });
    };
    const handleDateChange = (date) => {
        setNewGame({ ...newGame, date: date });
    };
    const handleAddNewGame = () => {
        if (selectedPlayers.length < 4) {
            alert("Please select at least 4 players before starting a new game");
        }
        else {
            handleGameStart(); // Assuming the game should start when new game data is submitted
        }
    };
    const handleGameStart = async () => {
        if (selectedPlayers.length < 4) {
            alert("Please select at least 4 players before starting a new game");
            return;
        }
        try {
            const response = await api.post("/game/start", {
                date: new Date(),
                players: selectedPlayers,
            });
            if (response.data && Array.isArray(response.data.games)) {
                setGames(response.data.games);
            }
            alert("New game started successfully");
            setGameStarted(true);
        }
        catch (err) {
            console.error(err);
            alert("Failed to start new game");
        }
    };
    const handleRebuy = (playerId) => {
        setGames((prevGames) => prevGames.map((game) => game.playerId === playerId
            ? {
                ...game,
                rebuys: game.rebuys + 1,
                totalCost: (game.totalCost ?? 0) + 5,
            }
            : game));
    };
    const calculatePoints = (totalPlayers, position) => {
        return position;
    };
    const handleOutOfGame = async (playerId) => {
        if (window.confirm("Is this player out of the game?")) {
            const gameIndex = games.findIndex((game) => game.playerId === playerId);
            if (gameIndex !== -1) {
                const game = games[gameIndex];
                const outAt = new Date();
                const updatedGameForApi = {
                    ...game,
                    points: calculatePoints(selectedPlayers.length, outPlayers.length + 1),
                    outAt: outAt.toISOString(),
                };
                const updatedGameForState = {
                    ...game,
                    points: calculatePoints(selectedPlayers.length, outPlayers.length + 1),
                    outAt: outAt,
                };
                try {
                    await api.put(`/games/${game.id}`, updatedGameForApi);
                    setGames((prevGames) => {
                        const newGames = [...prevGames];
                        newGames[gameIndex] = updatedGameForState;
                        return newGames;
                    });
                    setOutPlayers((prevOutPlayers) => {
                        const player = selectedPlayers.find((player) => player.id === playerId);
                        if (player) {
                            return [...prevOutPlayers, player];
                        }
                        else {
                            return prevOutPlayers;
                        }
                    });
                }
                catch (error) {
                    console.error("Error:", error);
                }
            }
        }
    };
    const handleGameEnd = async () => {
        if (window.confirm("Are you sure you want to stop the game?")) {
            // Here, no need to map over selectedPlayers, just use the games state
            try {
                // Make API call to save results to the database
                const res = await api.post("/gameResults", games);
                // After the results are saved successfully, update the parent component
                updateAfterGameEnd(games);
            }
            catch (error) {
                console.error("Error:", error);
            }
        }
    };
    return (_jsxs("div", { children: [_jsxs("div", { children: [_jsx("h3", { children: "Select Players:" }), players.map((player) => (_jsxs("div", { children: [_jsx("input", { type: "checkbox", id: `player-${player.id}`, name: player.name, value: player.id, onChange: () => handlePlayerSelect(player.id), checked: selectedPlayers.some((selectedPlayer) => selectedPlayer.id === player.id) }), _jsx("label", { htmlFor: `player-${player.id}`, children: player.name })] }, player.id)))] }), _jsx("h2", { children: "Game in Progress" }), !gameStarted ? (_jsx(NewGameForm, { newGame: newGame, handleNewGameChange: handleNewGameChange, handleDateChange: handleDateChange, handleAddNewGame: handleAddNewGame })) : (_jsxs(_Fragment, { children: [gameStarted && (_jsxs("div", { children: ["Time left: ", timeLeft, " seconds. Small/Big blind: ", blind, "/", blind * 2] })), _jsx("div", { children: selectedPlayers.map((player) => (_jsxs("div", { children: [_jsx("span", { children: player.name }), _jsx("button", { onClick: () => handleRebuy(player.id), children: "Rebuy" }), _jsx("button", { onClick: () => handleOutOfGame(player.id), children: "Out of Game" })] }, player.id))) }), !gameStarted && (_jsx("button", { onClick: handleGameStart, children: "Start Game" })), gameStarted && _jsx("button", { onClick: handleGameEnd, children: "Stop Partie" })] })), ";"] }));
};
export default StartGame;
//# sourceMappingURL=StartGame.js.map