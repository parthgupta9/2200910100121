"use client";

import { useState } from "react";
import Log from "../lib/logger";

interface ShortenResponse {
  shortLink?: string;
  shortcode?: string;
  expiry?: string;
  error?: string;
}

export default function HomePage() {
  const [url, setUrl] = useState("");
  const [shortcode, setShortcode] = useState("");
  const [validity, setValidity] = useState("");
  const [result, setResult] = useState<ShortenResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/shorten`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          validityMinutes: validity ? parseInt(validity, 10) : undefined,
          shortcode: shortcode || undefined,
        }),
      });

      const data: ShortenResponse = await res.json();
      if (!res.ok) throw new Error(data.error || "Error");
      setResult(data);
      Log("frontend", "info", "component", `Shortened URL: ${url} → ${data.shortcode}`);
    } catch (err) {
      const errorMsg = (err as Error).message;
      setResult({ error: errorMsg });
      Log("frontend", "error", "component", `Shorten failed: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg">
        <h1 className="text-3xl font-extrabold mb-6 text-center text-gray-800">
          🔗 URL Shortener
        </h1>

        <div className="space-y-4">
          <input
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Enter long URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <div className="flex gap-4">
            <input
              className="flex-1 border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Validity (minutes)"
              value={validity}
              onChange={(e) => setValidity(e.target.value)}
            />
            <input
              className="flex-1 border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Custom shortcode"
              value={shortcode}
              onChange={(e) => setShortcode(e.target.value)}
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-3 font-semibold transition-colors disabled:opacity-50"
          >
            {loading ? "Shortening..." : "Shorten"}
          </button>
        </div>

        {result && (
          <div
            className={`mt-6 p-4 rounded-lg animate-fadeIn ${
              result.error ? "bg-red-50 border border-red-200" : "bg-green-50 border border-green-200"
            }`}
          >
            {result.error ? (
              <p className="text-red-700 font-medium">{result.error}</p>
            ) : (
              <>
                <p className="text-green-800">
                  <strong>Short Link:</strong>{" "}
                  <a
                    href={result.shortLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline"
                  >
                    {result.shortLink}
                  </a>
                </p>
                {result.expiry && (
                  <p className="text-green-700 mt-1">
                    <strong>Expiry:</strong>{" "}
                    {new Date(result.expiry).toLocaleString()}
                  </p>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
