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

  const handleSubmit = async () => {
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
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">URL Shortener</h1>

      <div className="space-y-4">
        <input
          className="w-full border rounded p-2"
          placeholder="Enter long URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <div className="flex gap-4">
          <input
            className="flex-1 border rounded p-2"
            placeholder="Validity (minutes)"
            value={validity}
            onChange={(e) => setValidity(e.target.value)}
          />
          <input
            className="flex-1 border rounded p-2"
            placeholder="Custom shortcode"
            value={shortcode}
            onChange={(e) => setShortcode(e.target.value)}
          />
        </div>
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded p-2"
        >
          Shorten
        </button>
      </div>

      {result && (
        <div className="mt-6 p-4 border rounded bg-gray-50">
          {result.error ? (
            <p className="text-red-600">{result.error}</p>
          ) : (
            <>
              <p>
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
              <p>
                <strong>Expiry:</strong>{" "}
                {result.expiry ? new Date(result.expiry).toLocaleString() : ""}
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
