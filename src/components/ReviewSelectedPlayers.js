import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import bgReview from '../assets/reviewpoker.png';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { cn } from '../lib/utils';
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
const ReviewSelectedPlayers = ({ selectedPlayers, selectedTournament, onConfirm }) => {
    const navigate = useNavigate();
    return (_jsx("div", { style: {
            height: '550px',
            width: '970px',
            margin: '0 auto',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundImage: `url(${bgReview})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative'
        }, children: _jsxs("div", { style: {
                width: '100%',
                height: '100%',
                padding: '16px',
                backgroundColor: 'rgba(0, 0, 0, 0.75)', // Noir semi-transparent poker
                backdropFilter: 'blur(3px)',
                border: '1px solid rgba(212, 175, 55, 0.3)', // Bordure dorée
                borderRadius: '12px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                display: 'flex',
                flexDirection: 'column'
            }, children: [selectedTournament && (_jsx("div", { style: { marginBottom: '16px' }, children: _jsxs("h1", { style: {
                            fontFamily: 'DS-DIGI',
                            fontSize: '1.5rem',
                            color: '#D4AF37', // Doré poker
                            letterSpacing: '0.1em',
                            textAlign: 'center',
                            margin: 0,
                            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)'
                        }, children: ["Tournament: ", selectedTournament.year] }) })), _jsxs("div", { style: {
                        flex: 1,
                        display: 'flex',
                        gap: '20px',
                        overflow: 'hidden'
                    }, children: [_jsxs("div", { style: {
                                flex: '0 0 300px',
                                display: 'flex',
                                flexDirection: 'column'
                            }, children: [_jsxs("h3", { style: {
                                        fontFamily: 'DS-DIGI',
                                        fontSize: '1rem',
                                        color: '#F4E4BC', // Beige doré clair
                                        letterSpacing: '0.05em',
                                        marginBottom: '12px',
                                        margin: 0,
                                        textShadow: '1px 1px 2px rgba(0, 0, 0, 0.7)'
                                    }, children: ["Selected Players (", selectedPlayers.length, ")"] }), _jsx("div", { style: {
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(2, 1fr)',
                                        gap: '8px',
                                        overflowY: 'auto',
                                        maxHeight: 'calc(100% - 40px)',
                                        paddingRight: '4px'
                                    }, children: selectedPlayers.map((player) => (_jsx("div", { style: {
                                            padding: '8px',
                                            borderRadius: '6px',
                                            backgroundColor: '#D4AF37', // Doré poker pour les joueurs sélectionnés
                                            border: '1px solid #D4AF37',
                                            boxShadow: '0 2px 8px rgba(212, 175, 55, 0.4)',
                                            fontFamily: 'DS-DIGI',
                                            fontSize: '0.875rem',
                                            color: '#000000', // Texte noir sur fond doré
                                            letterSpacing: '0.05em',
                                            textAlign: 'center',
                                            fontWeight: '600'
                                        }, children: player.name }, player.id))) })] }), _jsxs("div", { style: {
                                flex: 1,
                                display: 'flex',
                                flexDirection: 'column'
                            }, children: [_jsx("h3", { style: {
                                        fontFamily: 'DS-DIGI',
                                        fontSize: '1rem',
                                        color: '#F4E4BC', // Beige doré clair
                                        letterSpacing: '0.05em',
                                        marginBottom: '12px',
                                        margin: 0,
                                        textShadow: '1px 1px 2px rgba(0, 0, 0, 0.7)'
                                    }, children: "Blinds Structure" }), _jsx("div", { style: {
                                        flex: 1,
                                        borderRadius: '6px',
                                        overflow: 'hidden',
                                        border: '1px solid rgba(212, 175, 55, 0.2)', // Bordure dorée
                                        boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.3)',
                                        backgroundColor: 'rgba(20, 20, 20, 0.5)' // Noir poker
                                    }, children: _jsx("div", { style: {
                                            height: '100%',
                                            overflowY: 'auto'
                                        }, children: _jsxs("table", { style: {
                                                width: '100%',
                                                borderCollapse: 'collapse'
                                            }, children: [_jsx("thead", { style: {
                                                        position: 'sticky',
                                                        top: 0,
                                                        backgroundColor: 'rgba(20, 20, 20, 0.95)', // Noir poker
                                                        zIndex: 1
                                                    }, children: _jsx("tr", { children: columns.map((column) => (_jsx("th", { style: {
                                                                padding: '8px 12px',
                                                                textAlign: 'left',
                                                                fontFamily: 'DS-DIGI',
                                                                fontSize: '0.875rem',
                                                                color: '#F4E4BC', // Beige doré clair
                                                                letterSpacing: '0.05em',
                                                                borderBottom: '1px solid rgba(212, 175, 55, 0.2)'
                                                            }, children: column.label }, column.key))) }) }), _jsx("tbody", { children: blindLevels.map((item, index) => (_jsx("tr", { style: {
                                                            borderBottom: index < blindLevels.length - 1 ? '1px solid rgba(212, 175, 55, 0.1)' : 'none'
                                                        }, onMouseEnter: (e) => {
                                                            e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.1)';
                                                        }, onMouseLeave: (e) => {
                                                            e.currentTarget.style.backgroundColor = 'transparent';
                                                        }, children: columns.map((column) => (_jsx("td", { style: {
                                                                padding: '6px 12px',
                                                                fontFamily: 'DS-DIGI',
                                                                fontSize: '0.875rem',
                                                                color: '#F4E4BC', // Beige doré clair
                                                                letterSpacing: '0.05em'
                                                            }, children: item[column.key] }, column.key))) }, item.level))) })] }) }) })] })] }), _jsxs("div", { style: {
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingTop: '12px',
                        borderTop: '1px solid rgba(212, 175, 55, 0.3)', // Bordure dorée
                        marginTop: '12px'
                    }, children: [_jsxs("div", { style: {
                                fontSize: '0.875rem',
                                color: '#F4E4BC', // Beige doré clair
                                fontFamily: 'DS-DIGI',
                                letterSpacing: '0.05em'
                            }, children: ["Ready to start with ", selectedPlayers.length, " players"] }), _jsxs("div", { style: {
                                display: 'flex',
                                gap: '12px'
                            }, children: [_jsx(Button, { onClick: () => navigate("/partypage"), variant: "outline", className: cn("font-['DS-DIGI'] text-sm", "bg-black/80 text-[#F4E4BC] font-semibold", "border-[#D4AF37]/30 hover:border-[#D4AF37]/50", "hover:bg-[#D4AF37]/10 hover:text-[#F4E4BC]", "shadow-[0_2px_4px_rgba(0,0,0,0.3)]"), children: "Back" }), _jsx(Button, { onClick: onConfirm, className: cn("font-['DS-DIGI'] text-sm min-w-[180px]", "bg-[#D4AF37] text-black font-semibold", "border-[#D4AF37] hover:bg-[#B8941F]", "shadow-[0_2px_4px_rgba(0,0,0,0.3)]", "hover:shadow-[0_4px_8px_rgba(212,175,55,0.4)]"), children: "Confirm and Start Game" })] })] })] }) }));
};
export default ReviewSelectedPlayers;
