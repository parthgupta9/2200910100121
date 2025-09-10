"use client";

import { useState } from "react";
import Log from "../../lib/logger";

interface ClickData {
  timestamp: string;
  referrer?: string;
  country?: string;
}
interface StatsResponse {
  shortcode?: string;
  originalUrl?: string;
  createdAt?: string;
  expiry?: string;
  totalClicks?: number;
  clicks?: ClickData[];
  error?: string;
}

export default function StatsPage() {
  const [code, setCode] = useState("");
  const [stats, setStats] = useState<StatsResponse | null>(null);

  const fetchStats = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/shorturls/${code}`);
      const data: StatsResponse = await res.json();
      if (!res.ok) throw new Error(data.error || "Error");
      setStats(data);
      Log("frontend", "info", "component", `Fetched stats for ${code}`);
    } catch (err) {
      const errorMsg = (err as Error).message;
      setStats({ error: errorMsg });
      Log("frontend", "error", "component", `Stats fetch failed: ${errorMsg}`);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Stats</h1>

      <div className="flex gap-4 mb-4">
        <input
          className="flex-1 border rounded p-2"
          placeholder="Shortcode"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button
          onClick={fetchStats}
          className="bg-green-600 hover:bg-green-700 text-white rounded p-2"
        >
          Get Stats
        </button>
      </div>

      {stats && (
        <div className="p-4 border rounded bg-gray-50">
          {stats.error ? (
            <p className="text-red-600">{stats.error}</p>
          ) : (
            <>
              <p><strong>Original:</strong> {stats.originalUrl}</p>
              <p><strong>Total Clicks:</strong> {stats.totalClicks}</p>
              <p><strong>Expiry:</strong> {stats.expiry ? new Date(stats.expiry).toLocaleString() : ""}</p>
              <h2 className="text-lg font-semibold mt-4">Clicks:</h2>
              <ul className="list-disc list-inside">
                {stats.clicks?.map((c, i) => (
                  <li key={i}>
                    {new Date(c.timestamp).toLocaleString()} — {c.referrer || "direct"} — {c.country}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}
