import { Tournaments } from "./interfaces.js";

interface ContentProps {
  selectedTournament: Tournaments | null;  // Le tournoi sélectionné est maintenant passé en prop
}

export const Content: React.FC<ContentProps> = ({ selectedTournament }) => {
  return (
    <div style={{ fontSize: "20px", marginTop: "8px", fontFamily: "DS-DIGI" }}>
      <div>
        Bourly Poker Tour:
        {selectedTournament ? (
          <>
            <div>Saison {selectedTournament.id}</div>
            {selectedTournament.year && <div> Année en cours: {selectedTournament.year}</div>}
          </>
        ) : (
          <div>Chargement des données...</div>
        )}
      </div>
      <div style={{ height: '1rem' }} /> {/* Spacer replacement */}
    </div>
  );
};

export default Content;


