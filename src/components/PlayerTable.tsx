import { Table } from "@nextui-org/react";
import { PlayerTableProps } from "./interfaces";

const PlayerTable: React.FC<PlayerTableProps> = ({
  config,
  players,
  style,
}) => {
  console.log("players in PlayerTable:", players);

  return (
    <div style={{ width: "100%", margin: "5px", fontWeight: "bold" }}>
      <Table bordered style={{ width: "100%" }}>
        <Table.Header>
          <Table.Column
            css={{ fontWeight: "bold", fontSize: "1rem", color: "$blue900" }}
          >
            Classement
          </Table.Column>
          <Table.Column
            css={{ fontWeight: "bold", fontSize: "1rem", color: "$blue900" }}
          >
            Nom du Joueur
          </Table.Column>
          <Table.Column
            css={{ fontWeight: "bold", fontSize: "1rem", color: "$blue900" }}
          >
            {config.title}
          </Table.Column>
          {/* <Table.Column>Total Points</Table.Column>
        <Table.Column>Total Rebuys</Table.Column>
        <Table.Column>Gains</Table.Column> */}
        </Table.Header>
        <Table.Body>
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
              <Table.Row key={player.id}>
                <Table.Cell>{rank + 1}</Table.Cell>
                <Table.Cell>{player.name}</Table.Cell>
                <Table.Cell>
                  {config.rankFunction &&
                  typeof config.rankFunction === "function" &&
                  player.stats
                    ? config.rankFunction(player.stats)
                    : "-"}
                </Table.Cell>
                {/* <Table.Cell>{player.stats.reduce((acc, stat) => acc + stat.points, 0) || "N/A"}</Table.Cell>
                <Table.Cell>{player.stats.reduce((acc, stat) => acc + stat.rebuys, 0) || "N/A"}</Table.Cell>
                <Table.Cell>{player.stats.reduce((acc, stat) => acc + stat.gains, 0) || "N/A"}</Table.Cell> */}
              </Table.Row>
            ))}
        </Table.Body>
      </Table>
    </div>
  );
};

export default PlayerTable;
