import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import DatePicker from 'react-datepicker';
export const NewGameForm = ({ newGame, handleNewGameChange, handleDateChange, handleAddNewGame }) => {
    return (_jsxs("div", { children: [_jsx("label", { htmlFor: "newGameDate", children: "Date : " }), _jsx(DatePicker, { selected: newGame.date, onChange: handleDateChange }), _jsx("label", { htmlFor: "newGamePoints", children: "Points: " }), _jsx("input", { id: "newGamePoints", name: "points", type: "number", value: newGame.points, onChange: handleNewGameChange }), _jsx("label", { htmlFor: "newGameRebuys", children: "Rebuys: " }), _jsx("input", { id: "newGameRebuys", name: "rebuys", type: "number", value: newGame.rebuys, onChange: handleNewGameChange }), _jsx("button", { onClick: handleAddNewGame, children: "Ajouter" })] }));
};
//# sourceMappingURL=NewGameForm.js.map