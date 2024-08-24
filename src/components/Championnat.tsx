import React, { useState, useEffect } from "react";
import api from "../api";

interface Championnat {
    id: number;
    saison: number;
    // include other properties as necessary
  }

  interface ChampionnatComponentProps {
    selectedChampionnat: number | null;
    setSelectedChampionnat: React.Dispatch<React.SetStateAction<number | null>>;
  }
  


const ChampionnatComponent = ({ setSelectedChampionnat }: ChampionnatComponentProps)  => {
  const [championnats, setChampionnats] = useState<Championnat[]>([]);;

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchChampionnats();
  }, []);

  const fetchChampionnats = async () => {
    setIsLoading(true);
    const response = await api.get("/championnats");
    setChampionnats(response.data);
    setIsLoading(false);
  };

  const handleChampionnatSelect = (id: number) => {
    setSelectedChampionnat(id);
  };

  // const createChampionnat = async (championnatData: []) => {
  //   const response = await fetch('/api/championnats', {
  //     method: "POST",
  //     body: JSON.stringify(championnatData),
  //   });
  //   if (response.ok) {
  //     fetchChampionnats();
  //   } else {
  //     console.error("Error creating championnat");
  //   }
  // };

  // const updateChampionnat = async (id :number, championnatData: []) => {
  //   const response = await fetch(`/api/championnats/${id}`, {
  //     method: "PUT",
  //     body: JSON.stringify(championnatData),
  //   });
  //   if (response.ok) {
  //     fetchChampionnats();
  //   } else {
  //     console.error("Error updating championnat");
  //   }
  // };

  const deleteChampionnat = async (id: number) => {
    const response = await fetch(`/api/championnats/${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      fetchChampionnats();
    } else {
      console.error("Error deleting championnat");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Championnats</h2>
      {championnats.map((championnat) => (
        <div key={championnat.id}>
          <h3>{championnat.saison}</h3>
          <button onClick={() => handleChampionnatSelect(championnat.id)}>
            Select
          </button>
          <button onClick={() => deleteChampionnat(championnat.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default ChampionnatComponent;
