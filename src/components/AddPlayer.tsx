import { FormEvent, useContext, useEffect, useState } from "react";
import { AxiosError } from "axios";
import api from '../api';
import { UIContext } from '../components/UiProvider';

// Add CSS styles
const styles = {
  container: {
    width: '380px',
    display: 'flex',
    flexDirection: 'column'
  },
  scrollContainer: {
    maxHeight: '500px',
    overflowY: 'auto'
  },
  card: {
    width: '350px',
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    marginBottom: '16px'
  },
  input: {
    width: '100%',
    height: '40px',
    padding: '8px 12px',
    marginBottom: '16px',
    border: '1px solid #E5E7EB',
    borderRadius: '6px',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.2s'
  },
  button: {
    padding: '10px 20px',
    fontSize: '1rem',
    fontWeight: '600',
    color: 'white',
    backgroundColor: '#3B82F6',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    marginBottom: '16px'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: 'white',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
  },
  th: {
    backgroundColor: '#F3F4F6',
    color: '#374151',
    fontWeight: '600',
    padding: '12px',
    textAlign: 'left',
    fontSize: '0.875rem',
    borderBottom: '1px solid #E5E7EB'
  },
  td: {
    padding: '12px',
    color: '#1F2937',
    fontSize: '0.875rem',
    borderBottom: '1px solid #E5E7EB'
  }
} as const;

// Add CSS classes for hover effects
const cssStyles = `
  .input:focus {
    border-color: #3B82F6;
  }
  .button:hover {
    background-color: #2563EB;
  }
  .table-row:hover {
    background-color: #F9FAFB;
  }
`;

interface Player {
  id: number;
  name: string;
  phoneNumber: string;
}

function AddPlayer() {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [players, setPlayers] = useState<Player[]>([]);
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
      }
    };

    fetchPlayers();
  }, []);

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

  return (
    <div style={styles.container}>
      <style>{cssStyles}</style>
      <div style={styles.scrollContainer}>
        <form onSubmit={handleSubmit}>
          <div style={styles.card}>
            <div style={{ marginBottom: '12px', fontSize: '1rem', fontWeight: '500' }}>
              Enter the player name:
            </div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Your Name"
              className="input"
              style={styles.input}
            />
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              placeholder="Your Phone"
              className="input"
              style={styles.input}
            />
          </div>
          <button
            type="submit"
            className="button"
            style={styles.button}
          >
            Create New Player
          </button>
        </form>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Id</th>
              <th style={styles.th}>Joueurs dans le tournois</th>
              <th style={styles.th}>Phone</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player, index) => (
              <tr key={player.id} className="table-row">
                <td style={styles.td}>{index + 1}</td>
                <td style={styles.td}>{player.name}</td>
                <td style={styles.td}>{player.phoneNumber}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ height: '16px' }} /> {/* Spacer replacement */}
    </div>
  );
}

export default AddPlayer;
