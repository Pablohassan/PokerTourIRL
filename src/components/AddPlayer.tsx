import { FormEvent, useContext, useEffect, useState } from "react";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import api from '../api';
import { UIContext } from '../components/UiProvider';


interface Player {
  id: number;
  name: string;
  phoneNumber: string;
}

function AddPlayer() {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [players, setPlayers] = useState<Player[]>([]);
  const navigate = useNavigate();
  const uiContext = useContext(UIContext);

  if (!uiContext) {
    throw new Error('UIContext is undefined, please ensure the component is wrapped with a <UIProvider>');
  }

  const { notify } = uiContext;

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await api.get('/player');
        setPlayers(response.data);
      } catch (error) {
        console.error(error);
        notify('error', 'Failed to load players');
      }
    };

    fetchPlayers();
  }, [notify]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (name.length < 3) {
      notify('warning', 'Player name must be at least 3 characters long');
      return;
    }
    if (phoneNumber.length < 9 || phoneNumber.length > 9) {
      notify("Attention", "il manque un chiffre", "le format exigé pour le numero ", "662123454")
      return;
    }

    try {
      const response = await api.get('/player');
      const players = response.data;

      const playerExists = players.some((player: { name: string }) => player.name.toLowerCase() === name.toLowerCase());

      if (playerExists) {
        notify('warning', `Player ${name} already exists`);
        return;
      }

      const postResponse = await api.post('/players', { name, phoneNumber });

      if (postResponse.data) {
        notify('success', `Player ${name} has been added successfully`);
        setName('');
        setPhoneNumber('');
        // Refresh players list
        const refreshResponse = await api.get('/player');
        setPlayers(refreshResponse.data);
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error(axiosError);
      notify('error', 'An error occurred while creating the player');
    }
  };

  const navigateToPlayerPage = (playerId: number) => {
    navigate(`/player/${playerId}`);
  };

  return (
    <div className="min-h-screen bg-slate-900 p-5">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-amber-400 mb-6">Player Management</h1>

        <div className="bg-slate-800 border border-amber-400/30 shadow-[0_0_15px_rgba(251,191,36,0.1)] rounded-lg p-5 mb-8">
          <h2 className="text-xl font-semibold text-amber-400 mb-4">Add New Player</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-amber-400 mb-2">Player Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Enter player name"
                className="w-full px-3 py-2 bg-slate-900 border border-amber-400 rounded text-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/30"
              />
            </div>

            <div>
              <label className="block text-amber-400 mb-2">Phone Number</label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                placeholder="Enter 9-digit phone number"
                className="w-full px-3 py-2 bg-slate-900 border border-amber-400 rounded text-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/30"
              />
            </div>

            <button
              type="submit"
              className="px-4 py-2 text-sm font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-lg border border-amber-400 transition-all duration-200 hover:shadow-[0_0_10px_rgba(251,191,36,0.3)]"
            >
              Create New Player
            </button>
          </form>
        </div>

        <div className="overflow-hidden rounded-[5px] border border-amber-400 bg-slate-900 shadow-[0_0_20px_rgba(251,191,36,0.1)]">
          <table className="w-full">
            <thead>
              <tr>
                <th className="px-3 py-3 text-left text-sm font-semibold bg-blue-900/90 text-amber-400 border-b border-amber-400">#</th>
                <th className="px-3 py-3 text-left text-sm font-semibold bg-blue-900/90 text-amber-400 border-b border-amber-400">Player Name</th>
                <th className="px-3 py-3 text-left text-sm font-semibold bg-blue-900/90 text-amber-400 border-b border-amber-400">Phone Number</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player, index) => (
                <tr
                  key={player.id}
                  className="hover:bg-blue-900/80 transition-colors cursor-pointer"
                  onClick={() => navigateToPlayerPage(player.id)}
                >
                  <td className="px-3 py-3 text-sm text-amber-400 border-b border-amber-400/20">{index + 1}</td>
                  <td className="px-3 py-3 text-sm text-amber-400 border-b border-amber-400/20 hover:text-amber-300">{player.name}</td>
                  <td className="px-3 py-3 text-sm text-amber-400 border-b border-amber-400/20">{player.phoneNumber}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AddPlayer;
