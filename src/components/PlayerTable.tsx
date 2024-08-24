import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { PlayerTableProps } from "./interfaces";

const PlayerTable: React.FC<PlayerTableProps> = ({
  config,
  players,
}) => {
  console.log("players in PlayerTable:", players);

  return (
    <div style={{ width: "100%", minWidth:"300px", maxWidth:"340px", margin: "5px", fontWeight: "bold" }}>
      <Table  style={{ width: "100%" }}>
        <TableHeader>
          <TableColumn 
            style={{ fontWeight: "bold", fontSize: "0.9rem", color: "$blue900" }}
          >
            Position
          </TableColumn> 
          <TableColumn
            style={{ fontWeight: "bold", fontSize: "0.9rem", color: "$blue900" }}
          >
            Joueur
          </TableColumn>
          <TableColumn
            style={{ fontWeight: "bold", fontSize: "0.9rem", color: "$blue900" }}
          >
            {config.title}
          </TableColumn>
          {/* <Table.Column>Total Points</Table.Column>
        <Table.Column>Total Rebuys</Table.Column>
        <Table.Column>Gains</Table.Column> */}
        </TableHeader>
        <TableBody>
          {players
            .filter((player) => {
              const result =
                typeof config.filterFunction === "function"
                  ? player.stats && config.filterFunction(player.stats)
                  : true;

              return result;
            })
            .sort((a, b) => {
              const result =
                typeof config.rankFunction === "function"
                  ? a.stats &&
                    b.stats &&
                    config.rankFunction(b.stats) - config.rankFunction(a.stats)
                  : 0;

              return result;
            })
            .map((player, rank) => (
              <TableRow key={player.id}>
                <TableCell>{rank + 1}</TableCell>
                <TableCell>{player.name}</TableCell>
                <TableCell>
                  {config.rankFunction &&
                  typeof config.rankFunction === "function" &&
                  player.stats
                    ? config.rankFunction(player.stats)
                    : "-"}
                </TableCell>
                {/* <Table.Cell>{player.stats.reduce((acc, stat) => acc + stat.points, 0) || "N/A"}</Table.Cell>
                <Table.Cell>{player.stats.reduce((acc, stat) => acc + stat.rebuys, 0) || "N/A"}</Table.Cell>
                <Table.Cell>{player.stats.reduce((acc, stat) => acc + stat.gains, 0) || "N/A"}</Table.Cell> */}
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PlayerTable;
