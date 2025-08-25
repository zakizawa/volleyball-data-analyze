/* 型宣言 */
type Team = "us" | "them"
type RoutarionPos = 1 | 2 | 3 | 4 | 5 | 6;
type PlayerId = string;

/* ローテーション初期状態 */
const firstState = {
    setNo: 1,
    rotation: { 1: 'sato', 2: 'ito', 3: 'kato', 4: 'sasaki', 5: 'tanaka', 6: 'saitou' },
    libero: "kudou",
    firstServe: "us"
}
const startState = (state) => {
    return ({
        setNo: state.setNo,
        score: { us: 0, them: 0 },
        weServed: state.firstServe === "us",
        rotation: { ...state.rotation },
        libero: state.libero
    })
};

console.log(startState(firstState))

/* ラリーの処理 */
const exRallyEvent = {
    setNo: 1,
    rallyWon: false
};
const exRallyState = {
    setNo: 1,
    score: { us: 7, them: 4 },
    weServed: true,
    rotation: { 1: 'sato', 2: 'ito', 3: 'kato', 4: 'sasaki', 5: 'tanaka', 6: 'saitou' },
    libero: "kudou"
}
const rotate = (r: Record<RoutarionPos, PlayerId>): Record<RoutarionPos, PlayerId> => (
    {
        1: r[6],
        2: r[1],
        3: r[2],
        4: r[3],
        5: r[4],
        6: r[5],
    }
);
const rallyState = (state, eventState) => {
    // スコアのカウントアップ
    eventState.rallyWon ? state.score.us++ : state.score.them++;
    // サーブ権の交代
    state.weServed = eventState.rallyWon;
    // 回転の具体的なロジック
    const rotateUs = !state.weServed && eventState.rallyWon;
    if (rotateUs) state.rotation = rotate(state.rotation);


    return state
};

console.log(rallyState(exRallyState, exRallyEvent))

/* 選手交代の処理 */
const exExchangeEvent = {
    out: "sato",
    in: "tsunoda",
};
const exExchangeState = {
    setNo: 3,
    score: { us: 11, them: 7 },
    weServed: true,
    rotation: { 1: 'sato', 2: 'ito', 3: 'kato', 4: 'sasaki', 5: 'tanaka', 6: 'saitou' },
    libero: "kudou"
};

const playerExchangeState = (state, eventState) => {
    const next = { ...state.rotation };
    Object.keys(next).forEach((position) => {
        if (next[position] === eventState.out) next[position] = eventState.in;
    });
    state.rotation = next;
    return state
};

console.log(playerExchangeState(exExchangeState, exExchangeEvent))

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
