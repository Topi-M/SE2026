import Image from "next/image";
import type { Village } from "@/lib/coc";

type Props = {
  village: Village;
};

const formatNumber = (n: number) => n.toLocaleString("fi-FI");

const roleLabels: Record<string, string> = {
  leader: "Johtaja",
  coLeader: "Apulaisjohtaja",
  admin: "Vanhin",
  member: "Jäsen",
};

const formatRole = (role: string | null) => (role ? roleLabels[role] ?? role : null);

export default function PlayerProfileCard({ village }: Props) {
  const clanBadgeUrl =
    village.clan?.badgeUrls?.medium ?? village.clan?.badgeUrls?.small;
  const leagueIconUrl =
    village.leagueIconUrls?.medium ??
    village.leagueIconUrls?.small ??
    village.leagueIconUrls?.tiny;

  return (
    <section
      aria-label={`Pelaajan ${village.name} tiedot`}
      className="overflow-hidden rounded-xl border border-slate-700 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 shadow-2xl shadow-black/30"
    >
      <div className="space-y-6 p-5 sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="relative flex h-24 w-24 shrink-0 flex-col items-center justify-center rounded-xl border-4 border-amber-500 bg-slate-950 text-center shadow-lg shadow-amber-950/20">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400">
              Town Hall
            </span>
            <span className="text-4xl font-black leading-tight text-white">
              {village.townHallLevel}
            </span>
            <span className="absolute -bottom-2 -right-2 rounded-xl border border-sky-400 bg-sky-600 px-2 py-1 text-xs font-extrabold text-white shadow">
              XP {village.expLevel}
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <h2 className="break-words text-3xl font-black tracking-tight text-white sm:text-4xl">
                {village.name}
              </h2>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex min-h-8 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 px-2.5 py-1 text-center font-mono text-xs text-slate-300">
                  {village.tag}
                </span>
                {village.warPreference && (
                  <span
                    className={`inline-flex min-h-8 items-center rounded-xl border px-3 py-1.5 text-xs font-semibold ${
                      village.warPreference === "in"
                        ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-200"
                        : "border-rose-400/30 bg-rose-500/10 text-rose-200"
                    }`}
                  >
                    {village.warPreference === "in"
                      ? "Sota: Mukana (IN)"
                      : "Sota: Ulkona (OUT)"}
                  </span>
                )}
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-sm">
              {village.labels.map((label) => {
                const iconUrl =
                  label.iconUrls?.small ??
                  label.iconUrls?.tiny ??
                  label.iconUrls?.medium;
                return (
                  <span
                    key={label.id}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-slate-300"
                  >
                    {iconUrl && (
                      <Image
                        src={iconUrl}
                        alt=""
                        width={18}
                        height={18}
                        unoptimized
                        className="h-[18px] w-[18px] object-contain"
                      />
                    )}
                    {label.name}
                  </span>
                );
              })}
              
              {village.isLegend && (
                <span className="rounded-xl border border-violet-400/30 bg-violet-500/10 px-3 py-1.5 text-violet-200">
                  ✨ Legend League
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-3 rounded-xl border border-slate-800/80 bg-slate-950/60 p-4 sm:grid-cols-2 sm:gap-0 sm:divide-x sm:divide-slate-700/80 sm:p-5">
          <div className="flex min-w-0 items-center gap-4 sm:pr-5">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center text-3xl">
              {clanBadgeUrl ? (
                <Image
                  src={clanBadgeUrl}
                  alt=""
                  width={56}
                  height={56}
                  unoptimized
                  className="h-full w-full object-contain"
                />
              ) : (
                "🛡️"
              )}
            </span>
            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-400">
              {village.clan ? `Klaani (Taso ${village.clan.level})` : "Klaani"}
              </p>
              <p className="truncate text-lg font-bold text-white">
                {village.clan?.name ?? "Ei klaania"}
              </p>
              {village.clan && (
                <p className="truncate text-sm text-amber-300">
                  {formatRole(village.role) ?? "Jäsen"} ({village.clan.tag})
                </p>
              )}
            </div>
          </div>

          <div className="flex min-w-0 items-center gap-4 border-t border-slate-700/80 pt-3 sm:border-t-0 sm:pl-5 sm:pt-0">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-3xl">
              {leagueIconUrl ? (
                <Image
                  src={leagueIconUrl}
                  alt=""
                  width={56}
                  height={56}
                  unoptimized
                  className="h-full w-full object-contain"
                />
              ) : (
                "🏆"
              )}
            </span>
            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-400">Nykyinen liiga</p>
              <p className="truncate text-lg font-bold text-white">
                {village.league ?? "Ei liigaa"}
              </p>
              <p className="truncate text-sm text-amber-300">
                🏆 {formatNumber(village.trophies)} pokaalia
                {village.bestLeague && village.bestLeague !== village.league
                  ? ` · Paras: ${village.bestLeague}`
                  : ""}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 border-t border-slate-700/80 md:grid-cols-4">
        <div className="border-b border-slate-700/80 p-4 text-center sm:p-5 md:border-b-0 md:border-r">
          <p className="text-xs text-slate-400 sm:text-sm">Sotatähdet</p>
          <p className="mt-1 text-lg font-bold text-amber-300 sm:text-xl">
            ⭐ {formatNumber(village.warStars)}
          </p>
        </div>
        <div className="border-b border-slate-700/80 p-4 text-center sm:p-5 md:border-b-0 md:border-r">
          <p className="text-xs text-slate-400 sm:text-sm">Lahjoitukset (Annettu / Saatu)</p>
          <p className="mt-1 text-lg font-bold text-emerald-400 sm:text-xl">
            {formatNumber(village.donations)}
            <span className="text-slate-500"> / </span>
            <span className="text-sky-400">{formatNumber(village.donationsReceived)}</span>
          </p>
        </div>
        <div className="border-r border-slate-700/80 p-4 text-center sm:p-5 md:border-r">
          <p className="text-xs text-slate-400 sm:text-sm">Ryöstetty Dark Elixir</p>
          <p className="mt-1 text-lg font-bold text-violet-300 sm:text-xl">
            💧{" "}
            {village.darkElixirLooted === null
              ? "Ei tietoa"
              : formatNumber(village.darkElixirLooted)}
          </p>
        </div>
        <div className="p-4 text-center sm:p-5">
          <p className="text-xs text-slate-400 sm:text-sm">
            Builder Hall {village.builderHallLevel ?? "—"}
          </p>
          <p className="mt-1 text-lg font-bold text-slate-200 sm:text-xl">
            🔨{" "}
            {village.builderBaseTrophies === null
              ? "Ei pokaaleja"
              : `${formatNumber(village.builderBaseTrophies)} pokaalia`}
          </p>
        </div>
      </div>
    </section>
  );
}
