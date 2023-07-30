"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_datepicker_1 = __importDefault(require("react-datepicker"));
require("react-datepicker/dist/react-datepicker.css");
const api_1 = __importDefault(require("./api"));
const App = () => {
    const [players, setPlayers] = (0, react_1.useState)([]);
    const [parties, setParties] = (0, react_1.useState)([]);
    const [selectedTournament, setSelectedTournament] = (0, react_1.useState)(null);
    const [newGame, setNewGame] = (0, react_1.useState)({
        date: new Date(),
        points: 0,
        rebuys: 0,
        playerId: null,
        partyId: null,
    });
    // Assuming these endpoints exist in your backend
    (0, react_1.useEffect)(() => {
        const fetchPlayers = () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const res = yield api_1.default.get('/player');
                setPlayers(res.data);
            }
            catch (error) {
                console.log("error fetching players:", error);
            }
        });
        const fetchParties = () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const res = yield api_1.default.get('/party');
                setParties(res.data);
            }
            catch (error) {
                console.log("error fetching parties:", error);
            }
        });
        fetchPlayers();
        fetchParties();
    }, []);
    const handleNewGameChange = (event) => {
        setNewGame(Object.assign(Object.assign({}, newGame), { [event.target.name]: Number(event.target.value) }));
    };
    const handleDateChange = (date) => {
        setNewGame(Object.assign(Object.assign({}, newGame), { date }));
    };
    const handleAddNewGame = () => __awaiter(void 0, void 0, void 0, function* () {
        if (!newGame.playerId || !newGame.partyId) {
            alert("Please select a player and a party before adding a new game");
            return;
        }
        try {
            const res = yield api_1.default.post('/game', newGame);
            alert('New game added successfully');
        }
        catch (err) {
            console.error(err);
            alert('Failed to add new game');
        }
    });
    const handleSelectChange = (event) => {
        const { name, value } = event.target;
        setNewGame(Object.assign(Object.assign({}, newGame), { [name]: Number(value) }));
    };
    return (<div>
      <h1>Championnat de Poker Holdem No Limit</h1>
      <h2>Participants</h2>
      
      <label htmlFor="newGameDate">Date : </label>
      <react_datepicker_1.default selected={newGame.date} onChange={handleDateChange}/>
      <div>
  {/* ... */}
  <label htmlFor="newGamePlayer">Player: </label>
  <select id="newGamePlayer" name="playerId" value={newGame.playerId || ''} onChange={handleSelectChange}>
    <option value=''>Select player</option>
    {players.map((player) => (<option key={player.id} value={player.id}>{player.name}</option>))}
  </select>

  <label htmlFor="newGameParty">Party: </label>
  <select id="newGameParty" name="partyId" value={newGame.partyId || ''} onChange={handleSelectChange}>
    <option value=''>Select party</option>
    {parties.map((party) => (<option key={party.id} value={party.id}>{party.date}</option>))}
  </select>

  <button onClick={handleAddNewGame}>Ajouter</button>
    </div>
      <label htmlFor="newGamePoints">Points: </label>
      <input id="newGamePoints" name="points" type="number" value={newGame.points} onChange={handleNewGameChange}/>
      <label htmlFor="newGameRebuys">Rebuys: </label>
      <input id="newGameRebuys" name="rebuys" type="number" value={newGame.rebuys} onChange={handleNewGameChange}/>
      <button onClick={handleAddNewGame}>Ajouter</button>
    </div>);
};
exports.default = App;
