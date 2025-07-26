"use client";
import { useState } from "react";

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

type PlayerRow = {
  order: string;
  name: string;
  position: string;
  //   entry_year: number;
  stats: {
    serve: ServeStat;
    spike: SpikeStat;
    block: BlockStat;
    reception: ReceptionStat;
    other: OtherStat;
  };
};

const defaultStats = {
  serve: { count: 0, point: 0, miss: 0, missPercentage: 0 },
  spike: {
    count: 0,
    point: 0,
    miss: 0,
    pointPercentage: 0,
    zentaiPercentage: 0,
  },
  block: { count: 0, point: 0 },
  reception: { A: 0, BC: 0, miss: 0, zentaiPercentage: 0 },
  other: { point: 0, miss: 0, total: 0 },
};

const initialPlayers: PlayerRow[] = ["1", "2", "3", "4", "5", "6", "L"].map(
  (order) => ({
    order,
    name: "",
    position: "",
    stats: JSON.parse(JSON.stringify(defaultStats)),
  })
);

export default function InputPage() {
  const [players, setPlayers] = useState<PlayerRow[]>(initialPlayers);

  const totalReception = players.reduce((recepSum, p) => {
    return (
      recepSum +
      p.stats.reception.A +
      p.stats.reception.BC +
      p.stats.reception.miss
    );
  }, 0);

  const getReceptionPercentage = (p: PlayerRow): number => {
    const individual =
      p.stats.reception.A + p.stats.reception.BC + p.stats.reception.miss;
    return totalReception === 0
      ? 0
      : Math.round((individual / totalReception) * 1000) / 10;
  };

  const totalSpike = players.reduce((recepSum, p) => {
    return (
      recepSum + p.stats.spike.count + p.stats.spike.point + p.stats.spike.miss
    );
  }, 0);

  const getSpikePercentage = (p: PlayerRow): number => {
    const individual =
      p.stats.reception.A + p.stats.reception.BC + p.stats.reception.miss;
    return totalReception === 0
      ? 0
      : Math.round((individual / totalReception) * 1000) / 10;
  };

  return (
    <main className="text-black">
      <h3>Date:{Date()}</h3>
      <label htmlFor="tournament-type">大会の種類：</label>
      <select id="tournament-type" name="tournamentType">
        <option value="">選択してください</option>
        <option value="official">公式</option>
        <option value="practice">練習</option>
      </select>
      <label htmlFor="tournament-name">大会名:</label>
      <input type="text" id="tournament-name" name="tournamentName" />

      <label htmlFor="venue">会場名:</label>
      <input type="text" id="venue" name="venue" />

      <label htmlFor="opponent">対戦相手:</label>
      <input type="text" id="opponent" name="opponent" />

      <label htmlFor="recorded_by">記入者:</label>
      <input type="text" id="recorded_by" name="recorded_by" />
      <br />
      <br />
      <br />
      <table className="table-fixed w-full border border-black border-collapse">
        <thead>
          <tr className="border border-black">
            <th rowSpan={2}>順</th>
            <th rowSpan={2}>ポジ</th>
            <th rowSpan={2}>名前</th>
            <th colSpan={4}>レセプション</th>
            <th colSpan={4}>サーブ</th>
            <th colSpan={2}>ブロック</th>
            <th colSpan={5}>スパイク</th>
            <th colSpan={2}>その他</th>
            <th colSpan={3}>TOTAL</th>
          </tr>
          <tr>
            <th>A</th>
            <th>BC</th>
            <th>ミスP</th>
            <th>%</th>
            <th>回</th>
            <th>P</th>
            <th>ミス</th>
            <th>%</th>
            <th>回</th>
            <th>P</th>
            <th>回</th>
            <th>P</th>
            <th>ミス</th>
            <th>決定率</th>
            <th>全体%</th>
            <th>P</th>
            <th>ミス</th>
            <th>＋</th>
            <th>−</th>
            <th>±</th>
          </tr>
        </thead>
        <tbody>
          {players.map((p, i) => (
            <tr key={i}>
              {/* 順 */}
              <td>{p.order}</td>

              {/* ポジ */}
              <td className="border border-gray-400">
                <select
                  value={p.position}
                  onChange={(e) => {
                    const copy = [...players];
                    copy[i].position = e.target.value;
                    setPlayers(copy);
                  }}
                >
                  <option value="">-</option>
                  <option value="WS">WS</option>
                  <option value="OP">OP</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="S">S</option>
                  <option value="PS">PS</option>
                </select>
              </td>

              {/* 名前 */}
              <td className="border border-gray-400">
                <input
                  value={p.name}
                  onChange={(e) => {
                    const copy = [...players];
                    copy[i].name = e.target.value;
                    setPlayers(copy);
                  }}
                />
              </td>

              {/* レセプション */}
              <td className="border border-gray-400">
                <input
                  type="number"
                  value={p.stats.reception.A}
                  onChange={(e) => {
                    const copy = [...players];
                    copy[i].stats.reception.A = +e.target.value;
                    setPlayers(copy);
                  }}
                />
              </td>
              <td className="border border-gray-400">
                <input
                  type="number"
                  value={p.stats.reception.BC}
                  onChange={(e) => {
                    const copy = [...players];
                    copy[i].stats.reception.BC = +e.target.value;
                    setPlayers(copy);
                  }}
                />
              </td>
              <td className="border border-gray-400">
                <input
                  type="number"
                  value={p.stats.reception.miss}
                  onChange={(e) => {
                    const copy = [...players];
                    copy[i].stats.reception.miss = +e.target.value;
                    setPlayers(copy);
                  }}
                />
              </td>
              <td className="border">{getReceptionPercentage(p)}%</td>

              {/* サーブ */}
              <td className="border border-gray-400">
                <input
                  type="number"
                  value={p.stats.serve.point}
                  onChange={(e) => {
                    const copy = [...players];
                    copy[i].stats.serve.point = +e.target.value;
                    setPlayers(copy);
                  }}
                />
              </td>
              <td className="border border-gray-400">
                <input
                  type="number"
                  value={p.stats.serve.miss}
                  onChange={(e) => {
                    const copy = [...players];
                    copy[i].stats.serve.miss = +e.target.value;
                    setPlayers(copy);
                  }}
                />
              </td>

              {/* ブロック */}
              <td className="border border-gray-400">
                <input
                  type="number"
                  value={p.stats.block.point}
                  onChange={(e) => {
                    const copy = [...players];
                    copy[i].stats.block.point = +e.target.value;
                    setPlayers(copy);
                  }}
                />
              </td>

              {/* スパイク */}
              <td className="border border-gray-400">
                <input
                  type="number"
                  value={p.stats.spike.point}
                  onChange={(e) => {
                    const copy = [...players];
                    copy[i].stats.spike.point = +e.target.value;
                    setPlayers(copy);
                  }}
                />
              </td>
              <td className="border border-gray-400">
                <input
                  type="number"
                  value={p.stats.spike.miss}
                  onChange={(e) => {
                    const copy = [...players];
                    copy[i].stats.spike.miss = +e.target.value;
                    setPlayers(copy);
                  }}
                />
              </td>
              <td className="border">{getSpikePercentage(p)}%</td>

              {/* その他 */}
              <td className="border border-gray-400">
                <input
                  type="number"
                  value={p.stats.other.point}
                  onChange={(e) => {
                    const copy = [...players];
                    copy[i].stats.other.point = +e.target.value;
                    setPlayers(copy);
                  }}
                />
              </td>
              <td className="border border-gray-400">
                <input
                  type="number"
                  value={p.stats.other.miss}
                  onChange={(e) => {
                    const copy = [...players];
                    copy[i].stats.other.miss = +e.target.value;
                    setPlayers(copy);
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
