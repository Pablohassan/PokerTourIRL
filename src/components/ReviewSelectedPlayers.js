import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import bgReview from '../assets/reviewpoker.png';
import { useNavigate } from 'react-router-dom';
import { cn } from "../lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
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
    return (_jsx("div", { className: cn("min-h-screen w-full", "bg-cover bg-center", "flex items-center justify-center", "p-4 sm:p-6", "overflow-y-auto"), style: {
            backgroundImage: `url(${bgReview})`
        }, children: _jsx(Card, { className: cn("w-full max-w-[980px]", "bg-gradient-to-b from-slate-950/90 to-slate-800/95 backdrop-blur-md", "border border-amber-400/20", "shadow-[0_0_35px_-5px_rgba(245,158,11,0.15)]", "rounded-2xl overflow-hidden"), children: _jsx(CardContent, { className: "p-4 sm:p-6", children: _jsxs("div", { className: "space-y-6", children: [selectedTournament && (_jsx(CardHeader, { className: "px-0 pt-0", children: _jsxs(CardTitle, { className: cn("font-['DS-DIGI'] text-2xl sm:text-3xl text-amber-400/90", "tracking-wider"), children: ["Tournament: ", selectedTournament.year] }) })), _jsxs("div", { className: "space-y-4", children: [_jsx("h3", { className: cn("font-['DS-DIGI'] text-xl sm:text-2xl text-amber-400/80", "tracking-wide"), children: "Selected Players" }), _jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3", children: selectedPlayers.map((player, index) => (_jsx("div", { className: cn("p-3 rounded-xl", "bg-slate-950/90", "border border-amber-400/20", "shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]", "font-['DS-DIGI'] text-lg sm:text-xl text-amber-400/90", "tracking-wide"), children: player.name }, player.id))) })] }), _jsxs("div", { className: "space-y-4", children: [_jsx("h3", { className: cn("font-['DS-DIGI'] text-xl sm:text-2xl text-amber-400/80", "tracking-wide"), children: "Blinds Structure" }), _jsx("div", { className: cn("rounded-xl overflow-hidden", "border border-amber-400/20", "shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]"), children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { children: _jsx("tr", { className: "bg-slate-950/90", children: columns.map((column) => (_jsx("th", { className: cn("p-3 text-left", "font-['DS-DIGI'] text-lg text-amber-400/80", "tracking-wide", "border-b border-amber-400/20"), children: column.label }, column.key))) }) }), _jsx("tbody", { children: blindLevels.map((item) => (_jsx("tr", { className: "border-b border-amber-400/10 last:border-0 hover:bg-slate-950/30", children: columns.map((column) => (_jsx("td", { className: cn("p-3", "font-['DS-DIGI'] text-base sm:text-lg text-amber-400/90", "tracking-wide"), children: item[column.key] }, column.key))) }, item.level))) })] }) }) })] }), _jsxs("div", { className: "flex gap-4 pt-4", children: [_jsx(Button, { onClick: onConfirm, className: cn("flex-1", "font-['DS-DIGI'] text-lg", "bg-amber-500/80 hover:bg-amber-500/60", "text-slate-900 hover:text-slate-900", "border border-amber-400/20", "h-12"), children: "Confirm and Start Game" }), _jsx(Button, { onClick: () => navigate("/partypage"), variant: "secondary", className: cn("flex-1", "font-['DS-DIGI'] text-lg", "bg-slate-800/80 hover:bg-slate-800/60", "text-amber-400", "border border-amber-400/20", "h-12"), children: "Back" })] })] }) }) }) }));
};
export default ReviewSelectedPlayers;
