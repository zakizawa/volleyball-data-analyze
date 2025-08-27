import { cursorTo } from "readline";

/* 型宣言 */
type Team = "us" | "them"
type RotationPos = 1 | 2 | 3 | 4 | 5 | 6;
type PlayerId = string;
type Position = 'WS' | 'OP' | 'M' | 'L' | 'S' | 'PS';
type Rotation = Record<RotationPos, PlayerId>;

type MatchMeta = {
    date: string;
    tournamentType: "official" | "practice";
    tournamentName: string;
    venue: string;
    opponent: string;
    recorder: string;
};

type StatReception = { A: number; BC: number; miss: number };
type StatServe = { count: number; point: number; miss: number };
type StatBlock = { count: number; point: number };
type StatSpike = { count: number; point: number; miss: number };
type StatOther = { point: number; miss: number };

type PlayerStats = {
    reception: StatReception;
    serve: StatServe;
    block: StatBlock;
    spike: StatSpike;
    other: StatOther;
};

type PlayerRow = {
    slot: 1 | 2 | 3 | 4 | 5 | 6 | "L";
    position: Position;
    name: string;
    id: PlayerId;
    stats: PlayerStats;
};


type MatchSetState = {
    setNo: number;
    score: { us: number, them: number };
    weServed: boolean;
    rotation: Rotation;
    libero?: PlayerId
}

// アプリ全体の状態
type AppState = {
    meta: MatchMeta;
    setState: MatchSetState;
    players: PlayerRow[];
    events: MatchEvent[];
    cursor: number;
};

// Event型
type BaseEvent = {
    seq: number;
};
type SetStartEvent = BaseEvent & {
    type: "setStart";
    setNo: number;
    rotation: Rotation;
    firstServe: Team;
    libero?: PlayerId;
}
type RallyEvent = BaseEvent & {
    type: "rally";
    setNo: number;
    rallyWon: boolean;
};
type SubEvent = BaseEvent & {
    type: "sub";
    setNo: number;
    in: PlayerId;
    out: PlayerId;
};
type TimeoutEvent = BaseEvent & {
    type: "timeout";
    setNo: number
    team: Team;
};
type StatSetEvent = BaseEvent & {
    type: "statSet";
    playerId: PlayerId;
    cat: "reception" | "serve" | "block" | "spike" | "other";
    field: "A" | "BC" | "miss" | "count" | "point";
    value: number
};
type MatchEvent =
    | SetStartEvent
    | RallyEvent
    | SubEvent
    | TimeoutEvent
    | StatSetEvent

// ----- 処理 -----
const today = () => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
};

const emptyStats = () => ({
    reception: { A: 0, BC: 0, miss: 0 },
    serve: { count: 0, point: 0, miss: 0 },
    block: { count: 0, point: 0 },
    spike: { count: 0, point: 0, miss: 0 },
    other: { point: 0, miss: 0 },
});

const makeInitialPlayers = () => {
    const rows = [1, 2, 3, 4, 5, 6].map((slot) => ({
        slot: slot,
        name: "",
        id: `p_${slot}`,
        stat: emptyStats()
    }));
    return rows
};

const rotate = (r: Rotation): Rotation => (
    {
        1: r[6],
        2: r[1],
        3: r[2],
        4: r[3],
        5: r[4],
        6: r[5],
    }
);

const initialAppState = () => {
    const players = makeInitialPlayers();
    const rotation = { 1: players[0].id, 2: players[1].id, 3: players[2].id, 4: players[3].id, 5: players[4].id, 6: players[5].id };
    const meta = {
        date: today(),
        tournamentType: "",
        tournamentName: "",
        venue: "",
        opponent: "",
        recorder: ""
    }
    const setState = {
        setNo: 1,
        score: { us: 0, them: 0 },
        weServed: false,
        rotation: {},
        libero: undefined,
    }
    return { meta, setState, players, events: [] }
};

const createInitialSetState = (event: SetStartEvent): MatchSetState => {
    return ({
        setNo: event.setNo,
        score: { us: 0, them: 0 },
        weServed: event.firstServe === "us",
        rotation: { ...event.rotation },
        libero: event.libero
    })
};

const cloneState = (state: MatchSetState): MatchSetState => {
    return ({
        setNo: state.setNo,
        score: { ...state.score },
        weServed: state.weServed,
        rotation: { ...state.rotation },
        libero: state.libero
    })
};

const POS = [1, 2, 3, 4, 5, 6] as const;

const matchSetReducer = (state: MatchSetState, event: MatchEvent) => {
    if (event.type === "setStart") return createInitialSetState(event);

    const s = cloneState(state);

    switch (event.type) {
        case "rally": {
            // スコアのカウントアップ
            event.rallyWon ? s.score.us++ : s.score.them++;
            // サーブ権の交代
            s.weServed = event.rallyWon;
            // 回転の具体的なロジック
            const rotateUs = !s.weServed && event.rallyWon;
            if (rotateUs) s.rotation = rotate(s.rotation);
            return s;
        }

        case "sub": {
            const next: Rotation = { ...s.rotation };
            for (const pos of POS) {
                if (next[pos] === event.out) {
                    next[pos] = event.in;
                    break;
                }
            }
            s.rotation = next;
            return s
        }

        case "timeout": {
            return s
        };

    }
};

// プロトタイプ
// type ServeStat = {
//   count: number;
//   point: number;
//   miss: number;
//   missPercentage: number;
// };

// type SpikeStat = {
//   count: number;
//   point: number;
//   miss: number;
//   pointPercentage: number;
//   zentaiPercentage: number;
// };

// type BlockStat = {
//   count: number;
//   point: number;
// };

// type ReceptionStat = {
//   A: number;
//   BC: number;
//   miss: number;
//   zentaiPercentage: number;
// };

// type OtherStat = {
//   point: number;
//   miss: number;
//   total: number;
// };

// export type PlayerRow = {
//   order: string;
//   name: string;
//   position: '' | 'WS' | 'OP' | 'M' | 'L' | 'S' | 'PS';
//   //   entry_year: number;
//   stats: {
//     serve: ServeStat;
//     spike: SpikeStat;
//     block: BlockStat;
//     reception: ReceptionStat;
//     other: OtherStat;
//   };
// };

// export type MatchMeta = {
//   date: string;
//   tournamentType: '' | 'official' | 'practice';
//   tournamentName: string;
//   venue: string;
//   opponent: string;
//   recorded_by: string;
// };

// export const createDefaultStats = (): PlayerRow['stats'] => ({
//   serve: { count: 0, point: 0, miss: 0, missPercentage: 0 },
//   spike: {
//     count: 0,
//     point: 0,
//     miss: 0,
//     pointPercentage: 0,
//     zentaiPercentage: 0
//   },
//   block: { count: 0, point: 0 },
//   reception: { A: 0, BC: 0, miss: 0, zentaiPercentage: 0 },
//   other: { point: 0, miss: 0, total: 0 }
// });
