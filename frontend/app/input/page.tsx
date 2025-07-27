"use client";
import { useEffect, useState } from "react";
import axios from "axios";

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
  const [today, setToday] = useState("");
  const [meta, setMeta] = useState({
    tournamentType: "",
    tournamentName: "",
    venue: "",
    opponent: "",
    recorded_by: "",
  });
  useEffect(() => {
    const now = new Date();
    const formatted =
      now.getFullYear() +
      "/" +
      String(now.getMonth() + 1).padStart(2, "0") +
      "/" +
      String(now.getDate()).padStart(2, "0");
    setToday(formatted);
  }, []);

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

  const totalSpike = players.reduce((spikeSum, p) => {
    return spikeSum + p.stats.spike.count;
  }, 0);

  const getSpikePercentage = (p: PlayerRow): number => {
    const individual = p.stats.spike.count;
    return totalSpike === 0
      ? 0
      : Math.round((individual / totalSpike) * 1000) / 10;
  };

  const getPlus = (p: PlayerRow): number => {
    return (
      p.stats.serve.point +
      p.stats.spike.point +
      p.stats.block.point +
      p.stats.other.point
    );
  };

  const getMinus = (p: PlayerRow): number => {
    return p.stats.serve.miss + p.stats.spike.miss + p.stats.other.miss;
  };

  const getNet = (p: PlayerRow): number => {
    return getPlus(p) - getMinus(p);
  };

  const handleSave = async () => {
    const payload = {
      date: today,
      tournament: meta.tournamentType,
      venue: meta.tournamentName,
      opponent: meta.opponent,
      recorded_by: meta.recorded_by,
      players: players.map((p) => ({
        name: p.name,
        position: p.position,
        stats: {
          serve: {
            count: p.stats.serve.count,
            point: p.stats.serve.point,
            miss: p.stats.serve.miss,
            serveMissPercentage: p.stats.serve.missPercentage,
          },
          spike: {
            count: p.stats.spike.count,
            point: p.stats.spike.point,
            miss: p.stats.spike.miss,
            spikePointPercentage: p.stats.spike.pointPercentage,
            spikePercentage: getSpikePercentage(p),
          },
          block: {
            count: p.stats.block.count,
            point: p.stats.block.point,
          },
          reception: {
            A: p.stats.reception.A,
            BC: p.stats.reception.BC,
            miss: p.stats.reception.miss,
            receptionPercentage: getReceptionPercentage(p),
          },
          other: {
            point: p.stats.other.point,
            miss: p.stats.other.miss,
            total: p.stats.other.point + p.stats.other.miss,
          },
          TOTAL: {
            plus: getPlus(p),
            minus: getMinus(p),
            net: getNet(p),
          },
        },
      })),
    };

    try {
      const res = await axios.post("/api/match", payload);
      console.log("成功:", res.data);
      alert("保存に成功しました");
    } catch (err) {
      console.error("送信失敗:", err);
      alert("保存に失敗しました");
    }
  };

  return (
    <main className="text-black">
      <h3>Date: {today}</h3>

      <label>大会の種類：</label>
      <select
        id="tournament-type"
        name="tournamentType"
        value={meta.tournamentType}
        onChange={(e) => setMeta({ ...meta, tournamentType: e.target.value })}
      >
        <option value="">-</option>
        <option value="official">公式</option>
        <option value="practice">練習</option>
      </select>

      <label>大会名:</label>
      <input
        type="text"
        id="tournament-name"
        name="tournamentName"
        value={meta.tournamentName}
        onChange={(e) => setMeta({ ...meta, tournamentName: e.target.value })}
      />

      <label>会場名:</label>
      <input
        type="text"
        id="venue"
        name="venue"
        value={meta.venue}
        onChange={(e) => setMeta({ ...meta, venue: e.target.value })}
      />

      <label>対戦相手:</label>
      <input
        type="text"
        id="opponent"
        name="opponent"
        value={meta.opponent}
        onChange={(e) => setMeta({ ...meta, opponent: e.target.value })}
      />

      <label>記入者:</label>
      <input
        type="text"
        id="recorded_by"
        name="recorded_by"
        value={meta.recorded_by}
        onChange={(e) => setMeta({ ...meta, recorded_by: e.target.value })}
      />
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
            <th>全体%</th>
            <th>回</th>
            <th>P</th>
            <th>ミス</th>
            <th>ミス%</th>
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
            <th>ー</th>
            <th>±</th>
          </tr>
        </thead>
        <tbody>
          {players.map((p, i) => (
            <tr key={i}>
              {/* 順 */}
              <td>{p.order}</td>

              {/* ポジ */}
              <td className="border">
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
              <td className="border">
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
              <td className="border">
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
              <td className="border">
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
              <td className="border">
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
              <td className="border ">
                <input
                  type="number"
                  value={p.stats.serve.count}
                  onChange={(e) => {
                    const copy = [...players];
                    const newCount = +e.target.value;
                    const miss = copy[i].stats.serve.miss;
                    copy[i].stats.serve.count = newCount;
                    copy[i].stats.serve.missPercentage =
                      newCount === 0
                        ? 0
                        : Math.round((miss / newCount) * 1000) / 10;
                    setPlayers(copy);
                  }}
                />
              </td>
              <td className="border">
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
              <td className="border">
                <input
                  type="number"
                  value={p.stats.serve.miss}
                  onChange={(e) => {
                    const copy = [...players];
                    const newMiss = +e.target.value;
                    const count = copy[i].stats.serve.count;
                    copy[i].stats.serve.miss = newMiss;
                    copy[i].stats.serve.missPercentage =
                      count === 0
                        ? 0
                        : Math.round((newMiss / count) * 1000) / 10;
                    setPlayers(copy);
                  }}
                />
              </td>

              <td className="border">{p.stats.serve.missPercentage}%</td>

              {/* ブロック */}
              <td className="border">
                <input
                  type="number"
                  value={p.stats.block.count}
                  onChange={(e) => {
                    const copy = [...players];
                    copy[i].stats.block.count = +e.target.value;
                    setPlayers(copy);
                  }}
                />
              </td>
              <td className="border">
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
              <td className="border">
                <input
                  type="number"
                  value={p.stats.spike.count}
                  onChange={(e) => {
                    const copy = [...players];
                    const newCount = +e.target.value;
                    const point = copy[i].stats.spike.point;
                    copy[i].stats.spike.count = newCount;
                    copy[i].stats.spike.pointPercentage =
                      newCount === 0
                        ? 0
                        : Math.round((point / newCount) * 1000) / 10;
                    setPlayers(copy);
                  }}
                />
              </td>

              <td className="border">
                <input
                  type="number"
                  value={p.stats.spike.point}
                  onChange={(e) => {
                    const copy = [...players];
                    const newPoint = +e.target.value;
                    const count = copy[i].stats.spike.count;
                    copy[i].stats.spike.point = newPoint;
                    copy[i].stats.spike.pointPercentage =
                      count === 0
                        ? 0
                        : Math.round((newPoint / count) * 1000) / 10;
                    setPlayers(copy);
                  }}
                />
              </td>
              <td className="border">
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
              <td className="border">{p.stats.spike.pointPercentage}%</td>
              <td className="border">{getSpikePercentage(p)}%</td>

              {/* その他 */}
              <td className="border">
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
              <td className="border">
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

              {/* TOTAL */}
              <td className="border">{getPlus(p)}</td>
              <td className="border">{getMinus(p)}</td>
              <td className="border">{getNet(p)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <br />
      <br />
      <br />
      <button onClick={handleSave} className="border">
        保存
      </button>
    </main>
  );
}
