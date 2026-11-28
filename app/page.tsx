"use client";

import { useEffect, useRef, useState } from "react";
import type { Village } from "@/lib/coc";
import PlayerHistory from "./components/PlayerHistory";
import PlayerProfileCard from "./components/PlayerProfileCard";
import type {
  HeistPoint,
  LeagueHistory,
  WarStarsPoint,
  XpPoint,
} from "./types";

const DEFAULT_TAG = "#JRCL00VU";

export default function Home() {
  const [tag, setTag] = useState(DEFAULT_TAG);
  const [village, setVillage] = useState<Village | null>(null);
  const [xpHistory, setXpHistory] = useState<XpPoint[] | null>(null);
  const [heistHistory, setHeistHistory] = useState<HeistPoint[] | null>(null);
  const [warStarsHistory, setWarStarsHistory] = useState<WarStarsPoint[] | null>(null);
  const [leagueHistory, setLeagueHistory] = useState<LeagueHistory | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function fetchVillage(input: string) {
    const cleaned = input.trim().replace(/^#/, "");
    if (!cleaned) return;

    setLoading(true);
    setError(null);
    setVillage(null);
    setXpHistory(null);
    setHeistHistory(null);
    setWarStarsHistory(null);
    setLeagueHistory(null);
    try {
      const base = `/api/player/${encodeURIComponent(cleaned)}`;
      const res = await fetch(base);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Haku epäonnistui");
        return;
      }
      setVillage(data);

      const [xpRes, heistRes, warStarsRes, leagueRes] = await Promise.all([
        fetch(`${base}/xp-history`),
        fetch(`${base}/heist-history`),
        fetch(`${base}/war-stars-history`),
        fetch(`${base}/league-history`),
      ]);
      if (xpRes.ok) setXpHistory((await xpRes.json()).history);
      if (heistRes.ok) setHeistHistory((await heistRes.json()).history);
      if (warStarsRes.ok) setWarStarsHistory((await warStarsRes.json()).history);
      if (leagueRes.ok) setLeagueHistory(await leagueRes.json());
    } catch {
      setError("Palvelimeen ei saatu yhteyttä");
    } finally {
      setLoading(false);
    }
  }

  const didAutoFetch = useRef(false);
  useEffect(() => {
    if (didAutoFetch.current) return;
    didAutoFetch.current = true;
    fetchVillage(DEFAULT_TAG);
  }, []);

  function search(e: React.FormEvent) {
    e.preventDefault();
    fetchVillage(tag);
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-xl font-black tracking-tight text-white sm:text-2xl">
            Clash of Clans <span className="text-sky-400">Tracker</span>
          </h1>

          <form
            onSubmit={search}
            className="flex w-full gap-2 rounded-xl border border-slate-700 bg-slate-900 p-1.5 sm:w-auto"
          >
            <label htmlFor="tag" className="sr-only">
              Pelaajan tagi
            </label>
            <input
              id="tag"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              placeholder="#ABC123"
              className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-white outline-none placeholder:text-slate-500 sm:w-44"
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-sky-500 px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-sky-400 disabled:cursor-wait disabled:opacity-60"
            >
              {loading ? "Haetaan…" : "Hae"}
            </button>
          </form>
        </header>

        {error && (
          <p
            role="alert"
            className="mb-5 rounded-xl border border-rose-400/30 bg-rose-950/60 px-4 py-3 text-sm text-rose-200"
          >
            {error}
          </p>
        )}

        {loading && !village && (
          <p className="py-12 text-center text-sm text-slate-400">
            Haetaan pelaajan tietoja…
          </p>
        )}

        {village && (
          <>
            <PlayerProfileCard village={village} />
            <PlayerHistory
              village={village}
              xpHistory={xpHistory}
              heistHistory={heistHistory}
              warStarsHistory={warStarsHistory}
              leagueHistory={leagueHistory}
            />
          </>
        )}
      </div>
    </main>
  );
}
