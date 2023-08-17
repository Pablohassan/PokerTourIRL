export interface Player {
    id: number;
    name: string;
    phoneNumber:string;
    stats: PlayerStats[];
  }
  
  export interface PlayerStats {
    kills:number;
    id: number;
    eliminatedById:number;
    createdAt: Date;
    points: number;
    rebuys: number;
    buyin: number;
    playerId: number;
    partyId: number;
    totalCost: number;
    totalRebuys: number;
    position: number;
    gains: number;
    outAt: Date | null;
  }
  
  export interface Parties {
    id: number;
    date: Date;
    tournamentId: number;
    playerStats: PlayerStats[];
  }
  
  export interface PartyResultsProps {
    players: Player[];
    parties: Parties[];
    playerStats?: PlayerStats[];
  }
  export interface Tournaments {
    id: number,
    year:number,
    createdAt: Date
  }
  export interface PlayerTableProps {
    config: {
      title: string;
      filter?: (playerStats: PlayerStats) => boolean;
      rankFunction?: (playerStats: PlayerStats[]) => number;
      filterFunction?: (playerStats: PlayerStats[]) => boolean;
    };
    players: Player[];
    style?: React.CSSProperties
    
  }
  