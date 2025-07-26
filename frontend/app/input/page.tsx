"use client";

export default function InputPage() {
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
    </main>
  );
}
