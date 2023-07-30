import { jsx as _jsx } from "react/jsx-runtime";
import PlayerTable from "./PlayerTable";
import { Grid } from "@nextui-org/react";
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
        // Add more configs as needed
    ];
    // {
    //   title: "championat",
    //   dataKey: "PricePool",
    //   filter: (game: GameWithPlayerName) => game.gains > 2
    // },
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
    return (_jsx(Grid.Container, { gap: 1, justify: "center", children: tableConfigs.map((config, i) => (_jsx(Grid, { xs: 12, sm: 4, md: 3, lg: 2, children: _jsx(PlayerTable, { config: config, players: players }) }, i))) }));
};
export default PartyResults;
//# sourceMappingURL=PartyResults.js.map