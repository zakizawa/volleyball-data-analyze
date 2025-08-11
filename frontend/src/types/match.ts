
type ServeStat = {
  count: number;
  point: number;
  miss: number;
  missPercentage: number;
};

type SpikeStat = {
  count: number;
  point: number;
  miss: number;
  pointPercentage: number;
  zentaiPercentage: number;
};

type BlockStat = {
  count: number;
  point: number;
};

type ReceptionStat = {
  A: number;
  BC: number;
  miss: number;
  zentaiPercentage: number;
};

type OtherStat = {
  point: number;
  miss: number;
  total: number;
};

export type PlayerRow = {
  order: string;
  name: string;
  position: '' | 'WS' | 'OP' | 'M' | 'L' | 'S' | 'PS';
  //   entry_year: number;
  stats: {
    serve: ServeStat;
    spike: SpikeStat;
    block: BlockStat;
    reception: ReceptionStat;
    other: OtherStat;
  };
};

export type MatchMeta = {
  date: string;
  tournamentType: '' | 'official' | 'practice';
  tournamentName: string;
  venue: string;
  opponent: string;
  recorded_by: string;
};

export const createDefaultStats = (): PlayerRow["stats"] => ({
  serve: { count: 0, point: 0, miss: 0, missPercentage: 0 },
  spike: { count: 0, point: 0, miss: 0, pointPercentage: 0, zentaiPercentage: 0 },
  block: { count: 0, point: 0 },
  reception: { A: 0, BC: 0, miss: 0, zentaiPercentage: 0 },
  other: { point: 0, miss: 0, total: 0 },
});