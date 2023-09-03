import { jsx as _jsx } from "react/jsx-runtime";
import PlayerTable from "./PlayerTable";
function calculateGains(playerStats) {
    return playerStats.reduce((sum, game) => {
        let gain = 0;
        if (game.position === 1)
            gain = game.totalCost * 0.6;
        else if (game.position === 2)
            gain = game.totalCost * 0.3;
        else if (game.position === 3)
            gain = game.totalCost * 0.1;
        return sum + Math.round(gain);
    }, 0);
}
const PartyResults = ({ players, playerStats }) => {
    ;
    const tableConfigs = [
        {
            title: "Points",
            filterFunction: (playerStat) => {
                const result = playerStat.some((game) => game.points > 1);
                console.log("Points Filter result for games", playerStat, "is", result);
                return result;
            },
            rankFunction: (playerStat) => playerStat.reduce((total, game) => total + game.points, 0),
        },
        {
            title: "Gains",
            filterFunction: (playerStat) => {
                const gains = calculateGains(playerStat);
                return gains > 0;
            },
            rankFunction: (playerStat) => calculateGains(playerStat),
        },
        {
            title: "Recave",
            filterFunction: (playerStat) => {
                const result = playerStat.some((stat) => stat.rebuys > 1);
                console.log("Recave Filter result for stats", playerStat, "is", result);
                return result;
            },
            rankFunction: (playerStat) => playerStat.reduce((total, stat) => total + stat.rebuys, 0),
        },
        {
            title: "Moneydown",
            filterFunction: (playerStat) => playerStat.some((stat) => stat.totalCost > 5),
            rankFunction: (playerStat) => playerStat.reduce((total, stat) => total + stat.totalCost, 0),
        },
        {
            title: "Killer",
            filterFunction: (playerStat) => {
                const result = playerStat.some((stat) => stat.kills > 2);
                console.log("Killer Filter result for stats", playerStat, "is", result);
                return result;
            },
            rankFunction: (playerStat) => playerStat.reduce((total, stat) => total + stat.kills, 0),
        },
        {
            title: "Bule",
            filterFunction: (playerStat) => {
                const result = playerStat.some((stat) => stat.position == 4);
                console.log("Bulman Filter result for stats", playerStat, "is", result);
                return result;
            },
            rankFunction: (playerStat) => playerStat.reduce((total, stat) => total + stat.position, 0),
        },
        // Add more configs as needed
    ];
    // {
    //   title: "adefinir",
    //   dataKey: "adef",
    //   filter: (game: GameWithPlayerName) => game.rebuys > 2
    // },
    // Add more configurations for more tables
    // {
    //   title: "Bule",
    //   dataKey: "BulMan",
    // },
    // {
    //   title: "Assidu",
    //   dataKey: "Nombre de parties",
    //   rankFunction: (games: Game[]) => games.reduce((total, game) => total + game.totalCost, 0),
    //   filterFunction: (games: Game[]) => games.length > 1, // for example, only include players who played at least one game
    // },
    // Define playerGames inside the map function, so 'player' is accessible
    return (_jsx("div", { style: { margin: 0 }, children: tableConfigs.map((config, i) => (_jsx("div", { children: _jsx(PlayerTable, { "aria-label": "tableau des parties", config: config, players: players }) }, i))) }));
};
export default PartyResults;
//# sourceMappingURL=PartyResults.js.map