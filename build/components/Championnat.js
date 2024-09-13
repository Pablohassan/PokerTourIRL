import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import api from "../api";
const ChampionnatComponent = ({ setSelectedChampionnat }) => {
    const [championnats, setChampionnats] = useState([]);
    ;
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
    const handleChampionnatSelect = (id) => {
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
    const deleteChampionnat = async (id) => {
        const response = await fetch(`/api/championnats/${id}`, {
            method: "DELETE",
        });
        if (response.ok) {
            fetchChampionnats();
        }
        else {
            console.error("Error deleting championnat");
        }
    };
    if (isLoading) {
        return _jsx("div", { children: "Loading..." });
    }
    return (_jsxs("div", { children: [_jsx("h2", { children: "Championnats" }), championnats.map((championnat) => (_jsxs("div", { children: [_jsx("h3", { children: championnat.saison }), _jsx("button", { onClick: () => handleChampionnatSelect(championnat.id), children: "Select" }), _jsx("button", { onClick: () => deleteChampionnat(championnat.id), children: "Delete" })] }, championnat.id)))] }));
};
export default ChampionnatComponent;
