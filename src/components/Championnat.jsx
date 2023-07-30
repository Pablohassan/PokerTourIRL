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
const api_1 = __importDefault(require("../api"));
const ChampionnatComponent = ({ selectedChampionnat, setSelectedChampionnat }) => {
    const [championnats, setChampionnats] = (0, react_1.useState)([]);
    ;
    const [isLoading, setIsLoading] = (0, react_1.useState)(true);
    (0, react_1.useEffect)(() => {
        fetchChampionnats();
    }, []);
    const fetchChampionnats = () => __awaiter(void 0, void 0, void 0, function* () {
        setIsLoading(true);
        const response = yield api_1.default.get("/championnats");
        setChampionnats(response.data);
        setIsLoading(false);
    });
    const handleChampionnatSelect = (id) => {
        setSelectedChampionnat(id);
    };
    const createChampionnat = (championnatData) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield fetch('/api/championnats', {
            method: "POST",
            body: JSON.stringify(championnatData),
        });
        if (response.ok) {
            fetchChampionnats();
        }
        else {
            console.error("Error creating championnat");
        }
    });
    const updateChampionnat = (id, championnatData) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield fetch(`/api/championnats/${id}`, {
            method: "PUT",
            body: JSON.stringify(championnatData),
        });
        if (response.ok) {
            fetchChampionnats();
        }
        else {
            console.error("Error updating championnat");
        }
    });
    const deleteChampionnat = (id) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield fetch(`/api/championnats/${id}`, {
            method: "DELETE",
        });
        if (response.ok) {
            fetchChampionnats();
        }
        else {
            console.error("Error deleting championnat");
        }
    });
    if (isLoading) {
        return <div>Loading...</div>;
    }
    return (<div>
      <h2>Championnats</h2>
      {championnats.map((championnat) => (<div key={championnat.id}>
          <h3>{championnat.saison}</h3>
          <button onClick={() => handleChampionnatSelect(championnat.id)}>
            Select
          </button>
          <button onClick={() => deleteChampionnat(championnat.id)}>
            Delete
          </button>
        </div>))}
    </div>);
};
exports.default = ChampionnatComponent;
