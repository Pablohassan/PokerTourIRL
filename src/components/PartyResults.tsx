import PlayerTable from "./PlayerTable";
import{ PlayerStats, PlayerTableProps,PartyResultsProps, } from "./interfaces.js"




function calculateGains(playerStats: PlayerStats[]): number {
  return playerStats.reduce((sum, game) => {
    let gain = 0;
    if (game.position === 1) gain = game.totalCost * 0.6;
    else if (game.position === 2) gain = game.totalCost * 0.3;
    else if (game.position === 3) gain = game.totalCost * 0.1;
    return sum + Math.round(gain);
  }, 0);
}


const PartyResults: React.FC<PartyResultsProps> = ({
  players,

}) => {
;

  
  const tableConfigs: PlayerTableProps["config"][] = [
    {
      title: "Points 2023",
      filterFunction: (playerStat: PlayerStats[]) => {
        // Filter out stats not from 2023
        const filteredStats = playerStat.filter(stat => {
          const year = new Date(stat.createdAt).getFullYear();
          return year === 2023;
        });
        // Check if there are any games with points greater than 1 in 2023
        const result = filteredStats.some(game => game.points > 1);
        console.log("Points Filter result for games in 2023", filteredStats, "is", result);
        return result;
      },
      rankFunction: (playerStat: PlayerStats[]) => {
        // Sum points only for games in 2023
        return playerStat.filter(stat => new Date(stat.createdAt).getFullYear() === 2023)
                         .reduce((total, game) => total + game.points, 0);
      },
    },
    {
      title: "Points 2024",
      filterFunction: (playerStat: PlayerStats[]) => {
        // Filter out stats not from 2024
        const filteredStats = playerStat.filter(stat => {
          const year = new Date(stat.createdAt).getFullYear();
          return year === 2024;
        });
        // Check if there are any games with points greater than 1 in 2024
        const result = filteredStats.some(game => game.points > 1);
        console.log("Points Filter result for games in 2024", filteredStats, "is", result);
        return result;
      },
      rankFunction: (playerStat: PlayerStats[]) => {
        // Sum points only for games in 2024
        return playerStat.filter(stat => new Date(stat.createdAt).getFullYear() === 2024)
                         .reduce((total, game) => total + game.points, 0);
      },
    },
  
    {
      title: "Gains 2023",
      filterFunction: (playerStat: PlayerStats[]) => {
        const filteredStats = playerStat.filter(stat => new Date(stat.createdAt).getFullYear() === 2023);
        return calculateGains(filteredStats) > 0;
      },
      rankFunction: (playerStat: PlayerStats[]) => calculateGains(playerStat.filter(stat => new Date(stat.createdAt).getFullYear() === 2023)),
    },
    {
      title: "Gains 2024",
      filterFunction: (playerStat: PlayerStats[]) => {
        const filteredStats = playerStat.filter(stat => new Date(stat.createdAt).getFullYear() === 2024);
        return calculateGains(filteredStats) > 0;
      },
      rankFunction: (playerStat: PlayerStats[]) => calculateGains(playerStat.filter(stat => new Date(stat.createdAt).getFullYear() === 2024)),
    },
    {
      title: "Recave 2023",
      filterFunction: (playerStat: PlayerStats[]) => {
        const filteredStats = playerStat.filter(stat => new Date(stat.createdAt).getFullYear() === 2023);
        return filteredStats.some(stat => stat.rebuys > 1);
      },
      rankFunction: (playerStat: PlayerStats[]) => playerStat.filter(stat => new Date(stat.createdAt).getFullYear() === 2023).reduce((total, stat) => total + stat.rebuys, 0),
    },
    {
      title: "Recave 2024",
      filterFunction: (playerStat: PlayerStats[]) => {
        const filteredStats = playerStat.filter(stat => new Date(stat.createdAt).getFullYear() === 2024);
        return filteredStats.some(stat => stat.rebuys > 1);
      },
      rankFunction: (playerStat: PlayerStats[]) => playerStat.filter(stat => new Date(stat.createdAt).getFullYear() === 2024).reduce((total, stat) => total + stat.rebuys, 0),
    },
    {
      title: "Moneydown 2023",
      filterFunction: (playerStat: PlayerStats[]) => playerStat.filter(stat => new Date(stat.createdAt).getFullYear() === 2023).some(stat => stat.totalCost > 5),
      rankFunction: (playerStat: PlayerStats[]) => playerStat.filter(stat => new Date(stat.createdAt).getFullYear() === 2023).reduce((total, stat) => total + stat.totalCost, 0),
    },
    {
      title: "Moneydown 2024",
      filterFunction: (playerStat: PlayerStats[]) => playerStat.filter(stat => new Date(stat.createdAt).getFullYear() === 2024).some(stat => stat.totalCost > 5),
      rankFunction: (playerStat: PlayerStats[]) => playerStat.filter(stat => new Date(stat.createdAt).getFullYear() === 2024).reduce((total, stat) => total + stat.totalCost, 0),
    },
    {
      title: "Killer 2023",
      filterFunction: (playerStat: PlayerStats[]) => playerStat.filter(stat => new Date(stat.createdAt).getFullYear() === 2023).some(stat => stat.kills > 2),
      rankFunction: (playerStat: PlayerStats[]) => playerStat.filter(stat => new Date(stat.createdAt).getFullYear() === 2023).reduce((total, stat) => total + stat.kills, 0),
    },
    {
      title: "Killer 2024",
      filterFunction: (playerStat: PlayerStats[]) => playerStat.filter(stat => new Date(stat.createdAt).getFullYear() === 2024).some(stat => stat.kills > 2),
      rankFunction: (playerStat: PlayerStats[]) => playerStat.filter(stat => new Date(stat.createdAt).getFullYear() === 2024).reduce((total, stat) => total + stat.kills, 0),
    },
    {
      title: "Bule 2023",
      filterFunction: (playerStat: PlayerStats[]) => playerStat.filter(stat => new Date(stat.createdAt).getFullYear() === 2023).some(stat => stat.position == 4),
      rankFunction: (playerStat: PlayerStats[]) => playerStat.filter(stat => new Date(stat.createdAt).getFullYear() === 2023).reduce((total, stat) => total + stat.position, 0),
    },
    {
      title: "Bule 2024",
      filterFunction: (playerStat: PlayerStats[]) => playerStat.filter(stat => new Date(stat.createdAt).getFullYear() === 2024).some(stat => stat.position == 4),
      rankFunction: (playerStat: PlayerStats[]) => playerStat.filter(stat => new Date(stat.createdAt).getFullYear() === 2024).reduce((total, stat) => total + stat.position, 0),
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
  
  return (
    
    <div style={{ display: 'grid',
     gridTemplateColumns: 'repeat(2, 1fr)',
     justifyContent: 'center', // Center horizontally
  alignItems: 'stretch', // Center vertically
  justifyItems:'center',
  gap: '10px',
  margin:"10px"

     }}>
      {tableConfigs.map((config, i) => (
        <div key={i}>
          <PlayerTable aria-label="tableau des parties"
            config={config}
            players={players}
           
          />
        </div>
      ))}
    </div>
   
  );
};

export default PartyResults;
