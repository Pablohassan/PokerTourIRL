import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState, useCallback, useRef } from 'react';
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Button } from '@nextui-org/react';
import api from '../api'; // replace with your actual API import
import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
export const PartyPage = () => {
    const [parties, setParties] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedParty, setSelectedParty] = useState(null);
    const [page, setPage] = useState(1); // Page actuelle
    const [hasMore, setHasMore] = useState(true); // Indique s'il y a plus de données à charger
    const observer = useRef(null);
    const limit = 15; // Limite d'éléments par page
    useEffect(() => {
        const fetchParties = async () => {
            try {
                const response = await api.get(`/parties?page=${page}&limit=${limit}`);
                const fetchedParties = response.data;
                const partiesWithStats = await Promise.all(fetchedParties.map(async (party) => {
                    const statsResponse = await api.get(`/parties/${party.id}/stats`);
                    return {
                        ...party,
                        playerStats: statsResponse.data,
                    };
                }));
                setParties(prevParties => [...prevParties, ...partiesWithStats]);
                setHasMore(fetchedParties.length === limit);
            }
            catch (error) {
                console.error('Erreur lors du chargement des parties:', error);
            }
        };
        fetchParties();
    }, [page]);
    const lastPartyElementRef = useCallback((node) => {
        if (observer.current)
            observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        });
        if (node)
            observer.current.observe(node);
    }, [hasMore]);
    const openModal = useCallback((party) => {
        setSelectedParty(party);
        setModalOpen(true);
    }, []);
    const closeModal = () => {
        setModalOpen(false);
        setSelectedParty(null);
    };
    const updatePartyDate = async () => {
        if (!selectedParty)
            return;
        try {
            await api.put(`/parties/${selectedParty.id}`, {
                date: new Date(selectedParty.date).toISOString(),
            });
            closeModal();
        }
        catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    console.log(error.response.data);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                }
                else if (error.request) {
                    console.log(error.request);
                }
                else {
                    console.log('Error', error.message);
                }
            }
            else if (error instanceof Error) {
                console.log('Error', error.message);
            }
            else {
                console.log('An unexpected error occurred');
            }
        }
    };
    const updateAllPlayerStats = async () => {
        if (!selectedParty)
            return;
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
        }
        catch (error) {
            console.error("An error occurred while updating the player stats:", error);
        }
    };
    const handleSaveChanges = async () => {
        await updateAllPlayerStats();
        await updatePartyDate();
    };
    const editStat = (playerIndex, field, value) => {
        if (!selectedParty)
            return;
        const updatedStats = [...selectedParty.playerStats];
        updatedStats[playerIndex][field] = value;
        setSelectedParty({
            ...selectedParty,
            playerStats: updatedStats,
        });
    };
    const deleteParty = async (partyId) => {
        if (window.confirm(`Supprimer la partie ${partyId}?`))
            try {
                await api.delete(`/parties/${partyId}`);
                const updatedParties = parties.filter((party) => party.id !== partyId);
                setParties(updatedParties);
            }
            catch (error) {
                console.error("Error deleting the party:", error);
            }
    };
    return (_jsxs("div", { children: [parties.map((party, i) => {
                if (parties.length === i + 1) {
                    return (_jsxs("div", { ref: lastPartyElementRef, className: "mb-20", children: [_jsxs("div", { className: "p-2 ml-10", children: [new Date(party.date).toLocaleDateString(), _jsx(Button, { style: { marginLeft: "10px" }, size: "sm", color: "danger", onClick: () => deleteParty(party.id), children: "Delete" })] }), _jsxs(Table, { "aria-label": "tableau general", style: { padding: 10, width: '100%' }, children: [_jsxs(TableHeader, { children: [_jsx(TableColumn, { children: "Player" }), _jsx(TableColumn, { children: "Position" }), _jsx(TableColumn, { children: "Points" }), _jsx(TableColumn, { children: "Rebuys" }), _jsx(TableColumn, { children: "Sortie" }), _jsx(TableColumn, { children: "Gains" })] }), _jsx(TableBody, { children: party.playerStats.map((stat, i) => (_jsxs(TableRow, { children: [_jsx(TableCell, { children: stat.player.name }), _jsx(TableCell, { children: stat.position }), _jsx(TableCell, { children: stat.points }), _jsx(TableCell, { children: stat.rebuys }), _jsx(TableCell, { children: stat.outAt
                                                        ? `${new Date(stat.outAt).getHours().toString().padStart(2, '0')}:${new Date(stat.outAt).getMinutes().toString().padStart(2, '0')}:${new Date(stat.outAt).getSeconds().toString().padStart(2, '0')}`
                                                        : 'N/A' }), _jsx(TableCell, { children: stat.gains })] }, i))) })] }), _jsx(Button, { size: "sm", color: "primary", onClick: () => openModal(party), children: "Edit" })] }, i));
                }
                else {
                    return (_jsxs("div", { className: "mb-20", children: [_jsxs("div", { className: "p-2 ml-10", children: [new Date(party.date).toLocaleDateString(), _jsx(Button, { style: { marginLeft: "10px" }, size: "sm", color: "danger", onClick: () => deleteParty(party.id), children: "Delete" })] }), _jsxs(Table, { "aria-label": "tableau general", style: { padding: 10, width: '100%' }, children: [_jsxs(TableHeader, { children: [_jsx(TableColumn, { children: "Player" }), _jsx(TableColumn, { children: "Position" }), _jsx(TableColumn, { children: "Points" }), _jsx(TableColumn, { children: "Rebuys" }), _jsx(TableColumn, { children: "Sortie" }), _jsx(TableColumn, { children: "Gains" })] }), _jsx(TableBody, { children: party.playerStats.map((stat, i) => (_jsxs(TableRow, { children: [_jsx(TableCell, { children: stat.player.name }), _jsx(TableCell, { children: stat.position }), _jsx(TableCell, { children: stat.points }), _jsx(TableCell, { children: stat.rebuys }), _jsx(TableCell, { children: stat.outAt
                                                        ? `${new Date(stat.outAt).getHours().toString().padStart(2, '0')}:${new Date(stat.outAt).getMinutes().toString().padStart(2, '0')}:${new Date(stat.outAt).getSeconds().toString().padStart(2, '0')}`
                                                        : 'N/A' }), _jsx(TableCell, { children: stat.gains })] }, i))) })] }), _jsx(Button, { size: "sm", color: "primary", onClick: () => openModal(party), children: "Edit" })] }, i));
                }
            }), isModalOpen && selectedParty && ReactDOM.createPortal(_jsx("div", { style: {
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }, children: _jsx("div", { style: {
                        backgroundColor: '#f0f0f0',
                        borderRadius: '10px',
                        maxWidth: '600px',
                        width: '100%',
                        padding: '20px',
                        overflowY: 'auto',
                        maxHeight: '90vh'
                    }, children: _jsxs("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }, children: [_jsxs("div", { style: { gridColumn: '1 / -1', textAlign: 'center', marginBottom: '20px' }, children: [_jsx("h2", { children: "Edit Party Stats" }), _jsx("div", { children: selectedParty.date })] }), _jsxs("div", { style: { gridColumn: '1 / -1', marginBottom: '20px' }, children: [_jsx("label", { style: { fontWeight: 'bold' }, children: "Date of Party:" }), _jsx("input", { type: "date", value: selectedParty ? selectedParty.date.substring(0, 10) : '', onChange: (e) => {
                                            if (selectedParty) {
                                                setSelectedParty({
                                                    ...selectedParty,
                                                    date: e.target.value,
                                                });
                                            }
                                        }, style: { width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', marginLeft: '10px' } })] }), selectedParty && selectedParty.playerStats.map((stat, i) => (_jsxs(React.Fragment, { children: [_jsx("div", { style: { gridColumn: '1 / -1', fontWeight: 'bold', marginBottom: '10px' }, children: stat.player.name }), _jsxs("div", { style: { display: 'flex', flexDirection: 'column', alignItems: 'center' }, children: [_jsx("div", { style: { marginBottom: '5px' }, children: "Position" }), _jsx("input", { type: "number", value: stat.position, onChange: (e) => editStat(i, 'position', Number(e.target.value)), style: { width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', marginBottom: '20px' } })] }), _jsxs("div", { style: { display: 'flex', flexDirection: 'column', alignItems: 'center' }, children: [_jsx("div", { style: { marginBottom: '5px' }, children: "Points" }), _jsx("input", { type: "number", value: stat.points, onChange: (e) => editStat(i, 'points', Number(e.target.value)), style: { width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', marginBottom: '20px' } })] }), _jsxs("div", { style: { display: 'flex', flexDirection: 'column', alignItems: 'center' }, children: [_jsx("div", { style: { marginBottom: '5px' }, children: "Rebuys" }), _jsx("input", { type: "number", value: stat.rebuys, onChange: (e) => editStat(i, 'rebuys', Number(e.target.value)), style: { width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', marginBottom: '20px' } })] })] }, i))), _jsxs("div", { style: { gridColumn: '1 / -1', display: 'flex', justifyContent: 'space-around', marginTop: '20px' }, children: [_jsx(Button, { onClick: handleSaveChanges, style: { padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }, children: "Save" }), _jsx(Button, { onClick: closeModal, style: { padding: '10px 20px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }, children: "Cancel" })] })] }) }) }), document.body)] }));
};
export default PartyPage;
