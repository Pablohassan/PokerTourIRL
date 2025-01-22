import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState, useCallback, useRef } from 'react';
import api from '../api'; // replace with your actual API import
import ReactDOM from 'react-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
// Add CSS styles
const styles = {
    button: {
        padding: '8px 16px',
        fontSize: '0.875rem',
        fontWeight: '600',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        transition: 'background-color 0.2s'
    },
    primaryButton: {
        backgroundColor: '#3B82F6'
    },
    dangerButton: {
        backgroundColor: '#EF4444'
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
};
// Add CSS classes for hover effects
const cssStyles = `
  .button-primary:hover {
    background-color: #2563EB !important;
  }
  .button-danger:hover {
    background-color: #DC2626 !important;
  }
  .table-row:hover {
    background-color: #F9FAFB;
  }
`;
export const PartyPage = () => {
    const [parties, setParties] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedParty, setSelectedParty] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const observer = useRef(null);
    const limit = 15;
    useEffect(() => {
        const fetchParties = async () => {
            if (isLoading)
                return;
            try {
                setIsLoading(true);
                console.log(`Fetching parties for page ${page}`);
                const response = await api.get(`/parties?page=${page}&limit=${limit}`);
                const fetchedParties = response.data;
                const partiesWithStats = await Promise.all(fetchedParties.map(async (party) => {
                    const statsResponse = await api.get(`/parties/${party.id}/stats`);
                    return {
                        ...party,
                        playerStats: statsResponse.data,
                    };
                }));
                setParties(prevParties => {
                    // Create a map of existing parties by ID
                    const existingPartiesMap = new Map(prevParties.map(p => [p.id, p]));
                    // Add new parties, avoiding duplicates
                    partiesWithStats.forEach(party => {
                        if (!existingPartiesMap.has(party.id)) {
                            existingPartiesMap.set(party.id, party);
                        }
                    });
                    // Convert map back to array and sort by date (most recent first)
                    return Array.from(existingPartiesMap.values())
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                });
                setHasMore(fetchedParties.length === limit);
                console.log(`Fetched ${partiesWithStats.length} parties`);
            }
            catch (error) {
                console.error('Error loading parties:', error);
            }
            finally {
                setIsLoading(false);
            }
        };
        fetchParties();
    }, [page]);
    const lastPartyElementRef = useCallback((node) => {
        if (observer.current)
            observer.current.disconnect();
        if (isLoading)
            return;
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                console.log('Loading more parties...');
                setPage(prevPage => prevPage + 1);
            }
        });
        if (node)
            observer.current.observe(node);
    }, [hasMore, isLoading]);
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
        if (window.confirm(`Delete party ${partyId}?`)) {
            try {
                await api.delete(`/parties/${partyId}`);
                setParties(prevParties => prevParties.filter(party => party.id !== partyId));
                toast.success('Party deleted successfully');
            }
            catch (error) {
                console.error("Error deleting party:", error);
                toast.error('Failed to delete party');
            }
        }
    };
    return (_jsxs(_Fragment, { children: [_jsx("style", { children: cssStyles }), _jsxs("div", { style: { padding: '20px' }, children: [isLoading && parties.length === 0 && (_jsx("div", { style: { textAlign: 'center', padding: '20px' }, children: "Loading parties..." })), parties.map((party, i) => (_jsxs("div", { ref: parties.length === i + 1 ? lastPartyElementRef : undefined, style: { marginBottom: '20px' }, children: [_jsxs("div", { style: { padding: '8px', marginLeft: '40px', display: 'flex', alignItems: 'center', gap: '10px' }, children: [_jsx("span", { children: new Date(party.date).toLocaleDateString() }), _jsx("button", { onClick: () => deleteParty(party.id), className: "button-danger", style: {
                                            ...styles.button,
                                            ...styles.dangerButton
                                        }, children: "Delete" })] }), _jsxs("table", { style: styles.table, children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { style: styles.th, children: "Player" }), _jsx("th", { style: styles.th, children: "Position" }), _jsx("th", { style: styles.th, children: "Points" }), _jsx("th", { style: styles.th, children: "Rebuys" }), _jsx("th", { style: styles.th, children: "Out Time" }), _jsx("th", { style: styles.th, children: "Gains" })] }) }), _jsx("tbody", { children: party.playerStats.map((stat, statIndex) => (_jsxs("tr", { className: "table-row", children: [_jsx("td", { style: styles.td, children: stat.player.name }), _jsx("td", { style: styles.td, children: stat.position }), _jsx("td", { style: styles.td, children: stat.points }), _jsx("td", { style: styles.td, children: stat.rebuys }), _jsx("td", { style: styles.td, children: stat.outAt
                                                        ? `${new Date(stat.outAt).getHours().toString().padStart(2, '0')}:${new Date(stat.outAt).getMinutes().toString().padStart(2, '0')}:${new Date(stat.outAt).getSeconds().toString().padStart(2, '0')}`
                                                        : 'N/A' }), _jsx("td", { style: styles.td, children: stat.gains })] }, `${party.id}-${stat.player.id}-${statIndex}`))) })] }), _jsx("button", { onClick: () => openModal(party), className: "button-primary", style: {
                                    ...styles.button,
                                    ...styles.primaryButton,
                                    marginTop: '10px'
                                }, children: "Edit" })] }, party.id))), isModalOpen && selectedParty && ReactDOM.createPortal(_jsx("div", { style: {
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            zIndex: 1000
                        }, children: _jsxs("div", { style: {
                                backgroundColor: 'white',
                                padding: '24px',
                                borderRadius: '8px',
                                maxWidth: '600px',
                                width: '90%',
                                maxHeight: '90vh',
                                overflow: 'auto'
                            }, children: [_jsx("h2", { style: { marginBottom: '16px' }, children: "Edit Party" }), _jsxs("div", { style: { marginBottom: '24px' }, children: [_jsx("label", { style: { display: 'block', marginBottom: '8px' }, children: "Date:" }), _jsx("input", { type: "datetime-local", value: selectedParty.date.slice(0, 16), onChange: (e) => setSelectedParty({
                                                ...selectedParty,
                                                date: new Date(e.target.value).toISOString()
                                            }), style: {
                                                width: '100%',
                                                padding: '8px',
                                                border: '1px solid #E5E7EB',
                                                borderRadius: '4px'
                                            } })] }), _jsxs("table", { style: styles.table, children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { style: styles.th, children: "Player" }), _jsx("th", { style: styles.th, children: "Position" }), _jsx("th", { style: styles.th, children: "Points" }), _jsx("th", { style: styles.th, children: "Rebuys" })] }) }), _jsx("tbody", { children: selectedParty.playerStats.map((stat, index) => (_jsxs("tr", { className: "table-row", children: [_jsx("td", { style: styles.td, children: stat.player.name }), _jsx("td", { style: styles.td, children: _jsx("input", { type: "number", value: stat.position, onChange: (e) => editStat(index, 'position', parseInt(e.target.value)), style: {
                                                                width: '60px',
                                                                padding: '4px',
                                                                border: '1px solid #E5E7EB',
                                                                borderRadius: '4px'
                                                            } }) }), _jsx("td", { style: styles.td, children: _jsx("input", { type: "number", value: stat.points, onChange: (e) => editStat(index, 'points', parseInt(e.target.value)), style: {
                                                                width: '60px',
                                                                padding: '4px',
                                                                border: '1px solid #E5E7EB',
                                                                borderRadius: '4px'
                                                            } }) }), _jsx("td", { style: styles.td, children: _jsx("input", { type: "number", value: stat.rebuys, onChange: (e) => editStat(index, 'rebuys', parseInt(e.target.value)), style: {
                                                                width: '60px',
                                                                padding: '4px',
                                                                border: '1px solid #E5E7EB',
                                                                borderRadius: '4px'
                                                            } }) })] }, stat.id))) })] }), _jsxs("div", { style: { marginTop: '24px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }, children: [_jsx("button", { onClick: closeModal, className: "button-danger", style: {
                                                ...styles.button,
                                                ...styles.dangerButton
                                            }, children: "Cancel" }), _jsx("button", { onClick: handleSaveChanges, className: "button-primary", style: {
                                                ...styles.button,
                                                ...styles.primaryButton
                                            }, children: "Save Changes" })] })] }) }), document.body)] })] }));
};
export default PartyPage;
