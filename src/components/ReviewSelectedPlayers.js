import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import bgReview from '../assets/reviewpoker.png';
import { useNavigate } from 'react-router-dom';
const blindLevels = [
    { level: 1, small: 10, big: 20, duration: '20m' },
    { level: 2, small: 25, big: 50, duration: '20m' },
    { level: 3, small: 50, big: 100, duration: '20m' },
    { level: 4, small: 100, big: 200, duration: '20m' },
    { level: 5, small: 150, big: 300, duration: '20m' },
    { level: 6, small: 200, big: 400, duration: '20m' },
    { level: 7, small: 300, big: 600, duration: '20m' },
    { level: 8, small: 400, big: 800, duration: '20m' },
    { level: 9, small: 500, big: 1000, duration: '20m' },
    { level: 10, small: 600, big: 1200, duration: '20m' },
    { level: 11, small: 700, big: 1400, duration: '20m' },
    { level: 12, small: 800, big: 1600, duration: '20m' },
    { level: 13, small: 900, big: 1800, duration: '20m' },
    { level: 14, small: 1000, big: 2000, duration: '20m' },
    { level: 15, small: 1500, big: 3000, duration: '20m' },
    { level: 16, small: 2000, big: 4000, duration: '20m' },
];
const columns = [
    { key: "level", label: "Level" },
    { key: "small", label: "Small Blind" },
    { key: "big", label: "Big Blind" },
    { key: "duration", label: "Duration" },
];
// Add CSS styles
const styles = {
    button: {
        flex: 1,
        padding: '12px 24px',
        fontSize: '1rem',
        fontWeight: '600',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'background-color 0.2s'
    },
    primaryButton: {
        backgroundColor: '#3B82F6'
    },
    dangerButton: {
        backgroundColor: '#EF4444'
    },
    tableRow: {
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
  .table-row:last-child {
    border-bottom: none !important;
  }
`;
const ReviewSelectedPlayers = ({ selectedPlayers, selectedTournament, onConfirm }) => {
    const navigate = useNavigate();
    return (_jsxs(_Fragment, { children: [_jsx("style", { children: cssStyles }), _jsx("div", { style: {
                    minHeight: '100vh',
                    width: '100%',
                    backgroundImage: `url(${bgReview})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '32px'
                }, children: _jsx("div", { style: {
                        maxWidth: '80rem',
                        width: '100%',
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(4px)',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                        borderRadius: '12px',
                        overflow: 'hidden'
                    }, children: _jsxs("div", { style: {
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '32px',
                            padding: '24px'
                        }, children: [_jsxs("div", { style: { flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }, children: [selectedTournament && (_jsxs("div", { style: {
                                            fontSize: '1.875rem',
                                            fontWeight: 'bold',
                                            color: '#1F2937'
                                        }, children: ["Tournament: ", selectedTournament.year] })), _jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: '16px' }, children: [_jsx("h3", { style: {
                                                    fontSize: '1.5rem',
                                                    fontWeight: '600',
                                                    color: '#1F2937'
                                                }, children: "Selected Players" }), _jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: '8px' }, children: selectedPlayers.map((player, index) => (_jsx("div", { style: {
                                                        padding: '12px',
                                                        borderRadius: '8px',
                                                        color: 'white',
                                                        fontSize: '1.25rem',
                                                        backgroundColor: index % 2 === 0 ? '#1F2937' : '#374151'
                                                    }, children: player.name }, player.id))) })] }), _jsxs("div", { style: { display: 'flex', gap: '16px', marginTop: '24px' }, children: [_jsx("button", { onClick: onConfirm, className: "button-primary", style: {
                                                    ...styles.button,
                                                    ...styles.primaryButton
                                                }, children: "Confirm and Start Game" }), _jsx("button", { onClick: () => navigate("/partypage"), className: "button-danger", style: {
                                                    ...styles.button,
                                                    ...styles.dangerButton
                                                }, children: "Back" })] })] }), _jsxs("div", { style: { flex: 1 }, children: [_jsx("h3", { style: {
                                            fontSize: '1.5rem',
                                            fontWeight: '600',
                                            color: '#1F2937',
                                            marginBottom: '16px'
                                        }, children: "Blinds Structure" }), _jsx("div", { style: {
                                            width: '100%',
                                            overflowX: 'auto',
                                            borderRadius: '8px',
                                            border: '1px solid #E5E7EB'
                                        }, children: _jsxs("table", { style: {
                                                width: '100%',
                                                borderCollapse: 'collapse',
                                                backgroundColor: 'white'
                                            }, children: [_jsx("thead", { children: _jsx("tr", { children: columns.map((column) => (_jsx("th", { style: {
                                                                backgroundColor: '#1F2937',
                                                                color: 'white',
                                                                fontSize: '1.125rem',
                                                                padding: '12px',
                                                                textAlign: 'left',
                                                                fontWeight: '600'
                                                            }, children: column.label }, column.key))) }) }), _jsx("tbody", { children: blindLevels.map((item) => (_jsx("tr", { className: "table-row", style: styles.tableRow, children: columns.map((column) => (_jsx("td", { style: {
                                                                fontSize: '1.125rem',
                                                                padding: '12px',
                                                                color: '#1F2937'
                                                            }, children: item[column.key] }, column.key))) }, item.level))) })] }) })] })] }) }) })] }));
};
export default ReviewSelectedPlayers;
