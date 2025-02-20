import { useEffect, useState, useCallback, useRef } from 'react';
import api from '../api'; // replace with your actual API import
import { PlayerStats } from './interfaces';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { cn } from '../lib/utils';
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";

// Add CSS styles


// Add CSS classes for hover effects


// interface Player {
//   id: number;
//   name: string;
// }

interface Party {
  id: number;
  date: string;
  playerStats: PlayerStats[];
}

export const PartyPage = () => {
  const [parties, setParties] = useState<Party[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedParty, setSelectedParty] = useState<Party | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);
  const limit = 10; // Match backend limit
  const [selectedYear, setSelectedYear] = useState(2025);
  const years = [2023, 2024, 2025];

  useEffect(() => {
    const fetchParties = async () => {
      if (isLoading) return;

      try {
        setIsLoading(true);
        console.log(`Fetching parties for page ${page}`);

        const response = await api.get(`/parties?page=${page}&limit=${limit}&year=${selectedYear}`);
        const fetchedParties = response.data;

        const partiesWithStats = await Promise.all(fetchedParties.map(async (party: Party) => {
          const statsResponse = await api.get(`/parties/${party.id}/stats`);
          return {
            ...party,
            playerStats: statsResponse.data,
          };
        }));

        setParties(prevParties => {
          // Create a map of existing parties by ID to avoid duplicates
          const existingPartiesMap = new Map(prevParties.map(p => [p.id, p]));

          // Add new parties
          partiesWithStats.forEach(party => {
            existingPartiesMap.set(party.id, party);
          });

          // Convert map back to array and sort by date (most recent first)
          return Array.from(existingPartiesMap.values())
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        });

        // Update hasMore based on whether we received a full page of results
        setHasMore(fetchedParties.length === limit);
      } catch (error) {
        console.error('Error loading parties:', error);
        toast.error('Failed to load parties');
      } finally {
        setIsLoading(false);
      }
    };

    fetchParties();
  }, [page]);

  const lastPartyElementRef = useCallback((node: HTMLDivElement) => {
    if (observer.current) observer.current.disconnect();
    if (isLoading) return;

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        console.log('Loading more parties...');
        setPage(prevPage => prevPage + 1);
      }
    });

    if (node) observer.current.observe(node);
  }, [hasMore, isLoading]);

  const openModal = useCallback((party: Party) => {
    setSelectedParty(party);
    setModalOpen(true);

  }, []);

  const closeModal = () => {
    setModalOpen(false);
    setSelectedParty(null);
  };

  const updatePartyDate = async () => {
    if (!selectedParty) return;
    try {
      await api.put(`/parties/${selectedParty.id}`, {
        date: new Date(selectedParty.date).toISOString(),
      });
      closeModal();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log('Error', error.message);
        }
      } else if (error instanceof Error) {
        console.log('Error', error.message);
      } else {
        console.log('An unexpected error occurred');
      }
    }
  };

  const updateAllPlayerStats = async () => {
    if (!selectedParty) return;

    try {
      const updates = selectedParty.playerStats.map((stat) => ({
        id: stat.id,
        data: {
          position: stat.position,
          points: stat.points,
          rebuys: stat.rebuys,
        },
      }));

      await api.put("/updateMultipleGamesResults", updates);

      closeModal();
    } catch (error) {
      console.error("An error occurred while updating the player stats:", error);
    }
  };

  const handleSaveChanges = async () => {
    await updateAllPlayerStats();
    await updatePartyDate();
  };

  const editStat = (playerIndex: number, field: keyof PlayerStats, value: any) => {
    if (!selectedParty) return;
    const updatedStats: PlayerStats[] = [...selectedParty.playerStats];
    (updatedStats[playerIndex] as any)[field] = value;
    setSelectedParty({
      ...selectedParty,
      playerStats: updatedStats,
    });
  };

  const deleteParty = async (partyId: number) => {
    if (window.confirm(`Delete party ${partyId}?`)) {
      try {
        await api.delete(`/parties/${partyId}`);
        setParties(prevParties => prevParties.filter(party => party.id !== partyId));
        toast.success('Party deleted successfully');
      } catch (error) {
        console.error("Error deleting party:", error);
        toast.error('Failed to delete party');
      }
    }
  };

  const filterPartiesByYear = (parties: Party[], year: number) => {
    return parties.filter(party =>
      new Date(party.date).getFullYear() === year
    );
  };

  return (
    <div className="p-5 min-h-screen bg-slate-900">
      <Tabs defaultValue="2025" className="mb-4">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 p-0.5 rounded-lg">
          {years.map(year => (
            <TabsTrigger
              key={year}
              value={year.toString()}
              onClick={() => setSelectedYear(year)}
              className={cn(
                "font-['DS-DIGI']",
                "text-3xl xl:text-base",
                "h-8",
                "data-[state=active]:bg-amber-500/10",
                "data-[state=active]:text-amber-400",
                "data-[state=active]:shadow-[0_0_10px_rgba(245,158,11,0.1)]",
                "text-slate-400",
                "transition-all"
              )}
            >
              {year}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {years.map(year => (
        <div key={year} className={cn(
          selectedYear === year ? "block" : "hidden"
        )}>
          {filterPartiesByYear(parties, year).map((party, i) => (
            <div
              key={party.id}
              ref={parties.length === i + 1 ? lastPartyElementRef : undefined}
              className="mb-5"
            >
              <div className="px-2 ml-10 flex items-center gap-3">
                <span className="text-amber-400">{new Date(party.date).toLocaleDateString()}</span>
                <button
                  onClick={() => deleteParty(party.id)}
                  className="px-4 py-2 text-sm font-semibold text-white bg-red-700 hover:bg-red-800 rounded-[5px] border border-red-300/70 transition-all duration-200 hover:shadow-[0_0_10px_rgba(251,191,36,0.3)]"
                >
                  Delete
                </button>
              </div>

              <div className="mt-2 overflow-hidden rounded-[5px] border border-amber-400 bg-slate-900 shadow-[0_0_20px_rgba(251,191,36,0.1)]">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="px-3 py-3 text-left text-sm font-semibold bg-blue-900/90 text-amber-400 border-b border-amber-400">Player</th>
                      <th className="px-3 py-3 text-left text-sm font-semibold bg-blue-900/90 text-amber-400 border-b border-amber-400">Position</th>
                      <th className="px-3 py-3 text-left text-sm font-semibold bg-blue-900/90 text-amber-400 border-b border-amber-400">Points</th>
                      <th className="px-3 py-3 text-left text-sm font-semibold bg-blue-900/90 text-amber-400 border-b border-amber-400">Rebuys</th>
                      <th className="px-3 py-3 text-left text-sm font-semibold bg-blue-900/90 text-amber-400 border-b border-amber-400">Out Time</th>
                      <th className="px-3 py-3 text-left text-sm font-semibold bg-blue-900/90 text-amber-400 border-b border-amber-400">Gains</th>
                    </tr>
                  </thead>
                  <tbody>
                    {party.playerStats.map((stat, statIndex) => (
                      <tr
                        key={`${party.id}-${stat.player.id}-${statIndex}`}
                        className="hover:bg-blue-900/80 transition-colors"
                      >
                        <td className="px-3 py-3 text-sm text-amber-400 border-b border-amber-400/20">{stat.player.name}</td>
                        <td className="px-3 py-3 text-sm text-amber-400 border-b border-amber-400/20">{stat.position}</td>
                        <td className="px-3 py-3 text-sm text-amber-400 border-b border-amber-400/20">{stat.points}</td>
                        <td className="px-3 py-3 text-sm text-amber-400 border-b border-amber-400/20">{stat.rebuys}</td>
                        <td className="px-3 py-3 text-sm text-amber-400 border-b border-amber-400/20">
                          {stat.outAt
                            ? `${new Date(stat.outAt).getHours().toString().padStart(2, '0')}:${new Date(stat.outAt).getMinutes().toString().padStart(2, '0')}:${new Date(stat.outAt).getSeconds().toString().padStart(2, '0')}`
                            : 'N/A'}
                        </td>
                        <td className={cn(
                          "px-3 py-3 text-sm font-semibold border-b border-amber-400/20",
                          stat.gains >= 0 ? "text-green-400" : "text-red-400"
                        )}>
                          {stat.gains >= 0 ? `+${stat.gains}` : stat.gains}€
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <button
                  onClick={() => openModal(party)}
                  className="m-3 px-4 py-2 text-sm font-semibold text-white bg-slate-700 hover:bg-blue-800 rounded-[5px] border border-slate-400/70 transition-all duration-200 hover:shadow-[0_0_10px_rgba(251,191,36,0.3)]"
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      ))}

      {isModalOpen && selectedParty && ReactDOM.createPortal(
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-blue-900 p-6 rounded-lg max-w-2xl w-[90%] max-h-[90vh] overflow-auto border border-amber-400 shadow-[0_0_30px_rgba(251,191,36,0.2)]">
            <h2 className="text-2xl font-semibold mb-4 text-amber-400">Edit Party</h2>

            <div className="mb-6">
              <label className="block mb-2 text-amber-400">Date:</label>
              <input
                type="datetime-local"
                value={selectedParty.date.slice(0, 16)}
                onChange={(e) => setSelectedParty({
                  ...selectedParty,
                  date: new Date(e.target.value).toISOString()
                })}
                className="w-full px-3 py-2 bg-slate-900 border border-amber-400 rounded text-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/30"
              />
            </div>

            <div className="overflow-hidden rounded-lg border border-amber-400 bg-slate-900">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="px-3 py-3 text-left text-sm font-semibold bg-blue-900 text-amber-400 border-b border-amber-400">Player</th>
                    <th className="px-3 py-3 text-left text-sm font-semibold bg-blue-900 text-amber-400 border-b border-amber-400">Position</th>
                    <th className="px-3 py-3 text-left text-sm font-semibold bg-blue-900 text-amber-400 border-b border-amber-400">Points</th>
                    <th className="px-3 py-3 text-left text-sm font-semibold bg-blue-900 text-amber-400 border-b border-amber-400">Rebuys</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedParty.playerStats.map((stat, index) => (
                    <tr key={stat.id} className="hover:bg-blue-900/50 transition-colors">
                      <td className="px-3 py-3 text-sm text-amber-400 border-b border-amber-400/20">{stat.player.name}</td>
                      <td className="px-3 py-3 text-sm text-amber-400 border-b border-amber-400/20">
                        <input
                          type="number"
                          value={stat.position}
                          onChange={(e) => editStat(index, 'position', parseInt(e.target.value))}
                          className="w-16 px-2 py-1 bg-slate-900 border border-amber-400 rounded text-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/30"
                        />
                      </td>
                      <td className="px-3 py-3 text-sm text-amber-400 border-b border-amber-400/20">
                        <input
                          type="number"
                          value={stat.points}
                          onChange={(e) => editStat(index, 'points', parseInt(e.target.value))}
                          className="w-16 px-2 py-1 bg-slate-900 border border-amber-400 rounded text-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/30"
                        />
                      </td>
                      <td className="px-3 py-3 text-sm text-amber-400 border-b border-amber-400/20">
                        <input
                          type="number"
                          value={stat.rebuys}
                          onChange={(e) => editStat(index, 'rebuys', parseInt(e.target.value))}
                          className="w-16 px-2 py-1 bg-slate-900 border border-amber-400 rounded text-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/30"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm font-semibold text-white bg-red-900 hover:bg-red-800 rounded-lg border border-amber-400 transition-all duration-200 hover:shadow-[0_0_10px_rgba(251,191,36,0.3)]"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveChanges}
                className="px-4 py-2 text-sm font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-lg border border-amber-400 transition-all duration-200 hover:shadow-[0_0_10px_rgba(251,191,36,0.3)]"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default PartyPage;

