import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const Menu = ({ handleNavigate, setIsMenuOpen }) => {
    const handleClick = (path) => {
        handleNavigate(path);
        setIsMenuOpen(false);
    };
    return (_jsx("div", { className: "menu", children: _jsxs("div", { className: "button-container", children: [_jsx("button", { className: "poker-button", onClick: () => handleClick("/ranking"), children: "Ranking" }), _jsx("button", { className: "poker-button", onClick: () => handleClick("/startGame"), children: "Start Partie" }), _jsx("button", { className: "poker-button", onClick: () => handleClick("/results"), children: "Results" }), _jsx("button", { className: "poker-button", onClick: () => handleClick("/addplayer"), children: "Add Player" }), _jsx("button", { className: "poker-button", onClick: () => handleClick("/partypage"), children: "All Parties" }), _jsx("div", { className: "sign-out-button" })] }) }));
};
export default Menu;
