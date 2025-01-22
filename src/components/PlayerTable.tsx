import { PlayerTableProps } from "./interfaces";
import { cn } from "../lib/utils";

const PlayerTable: React.FC<PlayerTableProps> = ({
  config,
  players,
}) => {
  return (
    <div className="w-full bg-slate-900">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-slate-700/50">
            <th className="py-2 px-3 text-lg font-semibold text-slate-400 bg-slate-800/50">#</th>
            <th className="py-2 px-3 text-lg font-semibold text-slate-400 bg-slate-800/50">Nom</th>
            <th className="py-2 px-3 text-lg font-semibold text-slate-400 bg-slate-800/50 text-right">{config.title}</th>
          </tr>
        </thead>
        <tbody>
          {players
            .filter((player) => {
              return typeof config.filterFunction === "function"
                ? player.stats && config.filterFunction(player.stats)
                : true;
            })
            .sort((a, b) => {
              return typeof config.rankFunction === "function"
                ? (a.stats && b.stats
                  ? config.rankFunction(b.stats) - config.rankFunction(a.stats)
                  : 0)
                : 0;
            })
            .map((player, rank) => (
              <tr
                key={player.id}
                className={cn(
                  "border-b border-slate-700/50 transition-colors",
                  "hover:bg-slate-800/50",
                  rank === 0 && "bg-amber-900/20 hover:bg-amber-900/30",
                  rank === 1 && "bg-slate-700/20 hover:bg-slate-700/30",
                  rank === 2 && "bg-orange-900/10 hover:bg-orange-900/20"
                )}
              >
                <td className="py-1.5 px-3 text-md font-medium text-slate-400">
                  {rank + 1}
                </td>
                <td className="py-1.5 px-3 text-md font-medium text-slate-300">
                  {player.name}
                </td>
                <td className="py-1.5 px-3 text-md font-semibold text-slate-200 text-right tabular-nums">
                  {config.rankFunction &&
                    typeof config.rankFunction === "function" &&
                    player.stats
                    ? config.rankFunction(player.stats)
                    : "-"}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default PlayerTable;
