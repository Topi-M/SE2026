import type { Village } from "@/lib/coc";
import HistoryChart, { formatDate, type ChartPoint } from "../HistoryChart";
import type {
  HeistPoint,
  LeagueHistory,
  WarStarsPoint,
  XpPoint,
} from "../types";

type Props = {
  village: Village;
  xpHistory: XpPoint[] | null;
  heistHistory: HeistPoint[] | null;
  warStarsHistory: WarStarsPoint[] | null;
  leagueHistory: LeagueHistory | null;
};

const formatNumber = (n: number) => n.toLocaleString("fi-FI");
const formatCompact = (n: number) =>
  n.toLocaleString("fi-FI", { notation: "compact", maximumFractionDigits: 1 });
const shortLeague = (name: string) => name.replace(" League", "");

export default function PlayerHistory({
  village,
  xpHistory,
  heistHistory,
  warStarsHistory,
  leagueHistory,
}: Props) {
  return (
    <div className="mt-6 grid gap-4">
      {village.heroes.length > 0 && (
        <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {village.heroes.map((hero) => {
            const progress = (hero.level / hero.maxLevel) * 100;

            return (
              <article
                key={hero.name}
                className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6"
              >
                {/* Otsikko ja taso */}
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h3 className="text-xl font-bold text-white">
                    {hero.name}
                  </h3>

                  <span className="shrink-0 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-sm font-bold text-amber-400">
                    Lvl {hero.level} / {hero.maxLevel}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="h-3 overflow-hidden rounded-full border border-slate-800 bg-slate-950">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-600 to-amber-400"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <p className="mt-2 text-right text-sm text-slate-400">
                  {Math.round(progress)}% valmis
                </p>

                {/* Erotin */}
                <div className="my-5 border-t border-slate-800" />

                {/* Varusteet */}
                <h4 className="mb-3 text-sm font-bold tracking-wide text-slate-500">
                  KÄYTÖSSÄ OLEVAT VARUSTEET
                </h4>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {hero.equipment?.map((equipment) => (
                    <div
                      key={equipment.name}
                      className="rounded-xl border border-amber-600/70 bg-slate-950 p-3"
                    >
                      <p className="font-semibold text-slate-200">
                        {equipment.name}
                      </p>

                      <p className="mt-1 text-sm font-bold text-amber-400">
                        Taso {equipment.level}/{equipment.maxLevel} ★
                      </p>
                    </div>
                  ))}
                </div>
              </article>
            );
          })}
        </section>
      )}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        {xpHistory && (
          <section className="min-w-0 rounded-xl border border-slate-800 bg-slate-900/70 p-6">
            <h3 className="mb-3 text-lg font-bold text-white">XP-historia</h3>
            <XpHistoryChart history={xpHistory} />
          </section>
        )}

        {heistHistory && (
          <section className="min-w-0 rounded-xl border border-slate-800 bg-slate-900/70 p-6">
            <h3 className="mb-3 text-lg font-bold text-white">Ryöstetty Dark Elixir</h3>
            <HeistHistoryChart history={heistHistory} />
          </section>
        )}

        {warStarsHistory && (
          <section className="min-w-0 rounded-xl border border-slate-800 bg-slate-900/70 p-6">
            <h3 className="mb-3 text-lg font-bold text-white">Sotatähdet</h3>
            <WarStarsHistoryChart history={warStarsHistory} />
          </section>
        )}

        {leagueHistory && (
          <section className="min-w-0 rounded-xl border border-slate-800 bg-slate-900/70 p-6">
            <h3 className="mb-3 text-lg font-bold text-white">Liigahistoria</h3>
            <LeagueHistoryChart data={leagueHistory} />
          </section>
        )}
      </div>

    </div>
  );
}

function XpHistoryChart({ history }: { history: XpPoint[] }) {
  if (history.length === 0) return <p>Ei vielä tallennettua XP-historiaa.</p>;

  const points: ChartPoint[] = history.map((point) => {
    const date = new Date(point.recordedAt);
    return {
      date,
      value: point.expLevel,
      title: `${formatDate(date)}: XP-taso ${point.expLevel}`,
    };
  });
  const first = points[0];
  const last = points[points.length - 1];

  return (
    <HistoryChart
      points={points}
      ariaLabel={`XP-taso ${formatDate(first.date)}–${formatDate(last.date)}: ${first.value} → ${last.value}`}
    />
  );
}

function HeistHistoryChart({ history }: { history: HeistPoint[] }) {
  if (history.length === 0) return <p>Ei vielä tallennettua Dark Elixir -historiaa.</p>;

  const points: ChartPoint[] = history.map((point, index) => {
    const date = new Date(point.recordedAt);
    const gain =
      index > 0
        ? point.darkElixirLooted - history[index - 1].darkElixirLooted
        : null;
    return {
      date,
      value: point.darkElixirLooted,
      title:
        `${formatDate(date)}: ${formatNumber(point.darkElixirLooted)} Dark Elixir` +
        (gain !== null ? `\n+${formatNumber(gain)} edellisestä` : ""),
    };
  });
  const first = points[0];
  const last = points[points.length - 1];

  return (
    <HistoryChart
      points={points}
      ariaLabel={`Ryöstetty Dark Elixir ${formatDate(first.date)}–${formatDate(last.date)}: ${formatNumber(first.value)} → ${formatNumber(last.value)}`}
      formatTick={formatCompact}
      marginLeft={72}
      marginRight={84}
    />
  );
}

function WarStarsHistoryChart({ history }: { history: WarStarsPoint[] }) {
  if (history.length === 0) return <p>Ei vielä tallennettua sotatähtien historiaa.</p>;

  const points: ChartPoint[] = history.map((point, index) => {
    const date = new Date(point.recordedAt);
    const gain =
      index > 0 ? point.warStars - history[index - 1].warStars : null;
    return {
      date,
      value: point.warStars,
      title:
        `${formatDate(date)}: ${formatNumber(point.warStars)} sotatähteä` +
        (gain !== null ? `\n+${formatNumber(gain)} edellisestä` : ""),
    };
  });
  const first = points[0];
  const last = points[points.length - 1];

  return (
    <HistoryChart
      points={points}
      ariaLabel={`Sotatähdet ${formatDate(first.date)}–${formatDate(last.date)}: ${first.value} → ${last.value}`}
      formatTick={formatNumber}
      marginLeft={48}
      marginRight={52}
    />
  );
}

function LeagueHistoryChart({ data }: { data: LeagueHistory }) {
  if (data.history.length === 0) return <p>Ei vielä tallennettua liigahistoriaa.</p>;

  const names = new Map(data.tiers.map((tier) => [tier.rank, shortLeague(tier.name)]));
  const points: ChartPoint[] = data.history.map((season) => {
    const date = new Date(season.seasonStart);
    const used = season.attackWins + season.attackLosses;
    return {
      date,
      value: season.rank,
      title:
        `Viikko ${formatDate(date)}: ${season.leagueName}\n` +
        `Sijoitus ${season.placement}, ${season.leagueTrophies} pokaalia, hyökkäyksiä ${used}/${season.maxBattles}`,
    };
  });
  const first = data.history[0];
  const last = data.history[data.history.length - 1];

  return (
    <HistoryChart
      points={points}
      ariaLabel={`Liiga viikoittain ${formatDate(points[0].date)}–${formatDate(points[points.length - 1].date)}: ${first.leagueName} → ${last.leagueName}`}
      formatTick={(rank) => names.get(rank) ?? ""}
      tickCount={6}
      marginLeft={84}
      marginRight={72}
      stepLine
    />
  );
}
