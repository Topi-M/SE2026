// Yleinen aikasarjakaavio (XP- ja liigahistoria). Pelkkä SVG, ei kaaviokirjastoa.
// Arvot ovat viewBox-yksiköitä.

export type ChartPoint = {
  date: Date;
  value: number;
  /** Hover-vihjeen teksti. */
  title: string;
};

type Props = {
  points: ChartPoint[];
  ariaLabel: string;
  /** Y-akselin arvon teksti (esim. liigan nimi). Oletuksena luku sellaisenaan. */
  formatTick?: (value: number) => string;
  /** Viimeisen pisteen viereen kirjoitettava teksti. Oletuksena formatTick(arvo). */
  endLabel?: string;
  /** Tikkien tavoitemäärä Y-akselilla. */
  tickCount?: number;
  marginLeft?: number;
  marginRight?: number;
  stepLine?: boolean;
};

const W = 720;
const H = 320;
const TOP = 24;
const BOTTOM = 40;

const SERIES = "#38bdf8";
const GRID = "#334155";
const MUTED = "#94a3b8";
const INK = "#f8fafc";
const SURFACE = "#0f172a";

export const formatDate = (d: Date) =>
  d.toLocaleDateString("fi-FI", { day: "numeric", month: "numeric", year: "numeric" });

/** Tasaväliset kokonaislukutikit, jotka kattavat välin [min, max]. */
function niceTicks(min: number, max: number, count: number): number[] {
  const raw = (max - min) / count;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const step = Math.max(1, [1, 2, 5, 10].map((m) => m * mag).find((s) => s >= raw)!);
  const ticks: number[] = [];
  for (let v = Math.floor(min / step) * step; v <= Math.ceil(max / step) * step; v += step) {
    ticks.push(v);
  }
  return ticks;
}

export default function HistoryChart({
  points,
  ariaLabel,
  formatTick = String,
  endLabel,
  tickCount = 4,
  marginLeft = 40,
  marginRight = 44,
  stepLine = false,
}: Props) {
  const plotW = W - marginLeft - marginRight;
  const plotH = H - TOP - BOTTOM;

  const pts = points.map((p) => ({ ...p, t: p.date.getTime() }));
  const tMin = pts[0].t;
  const tMax = pts[pts.length - 1].t;

  const values = pts.map((p) => p.value);
  let lo = Math.min(...values);
  let hi = Math.max(...values);
  if (lo === hi) {
    lo -= 1;
    hi += 1;
  }
  const yTicks = niceTicks(lo, hi, tickCount);
  const yMin = yTicks[0];
  const yMax = yTicks[yTicks.length - 1];

  const x = (t: number) =>
    tMax === tMin ? marginLeft + plotW / 2 : marginLeft + ((t - tMin) / (tMax - tMin)) * plotW;
  const y = (v: number) => TOP + (1 - (v - yMin) / (yMax - yMin)) * plotH;

  // X-akselille 4 tasavälistä päivämäärää (tai yksi, jos pisteitä on vain yksi).
  const xTicks =
    tMax === tMin ? [tMin] : [0, 1, 2, 3].map((i) => tMin + ((tMax - tMin) * i) / 3);

  const last = pts[pts.length - 1];
  const path = pts
    .map((point, index) => {
      const pointX = x(point.t);
      const pointY = y(point.value);
      if (index === 0) return `M${pointX},${pointY}`;
      return stepLine
        ? `H${pointX} V${pointY}`
        : `L${pointX},${pointY}`;
    })
    .join(" ");
  const labelNearRightEdge = x(last.t) > W - marginRight - 72;
  const valueLabelX = labelNearRightEdge ? x(last.t) - 8 : x(last.t) + 8;
  const valueLabelAnchor = labelNearRightEdge ? "end" : "start";

  return (
    <svg
      className="block h-auto w-full"
      viewBox={`0 0 ${W} ${H}`}
      width={W}
      height={H}
      role="img"
      aria-label={ariaLabel}
      fontFamily="sans-serif"
      fontSize={14}
    >
      <rect width={W} height={H} fill={SURFACE} />

      {/* Vaakaruudukko ja Y-akselin arvot */}
      {yTicks.map((v) => (
        <g key={v}>
          <line
            x1={marginLeft}
            x2={W - marginRight}
            y1={y(v)}
            y2={y(v)}
            stroke={GRID}
            strokeWidth={1}
            strokeOpacity={0.75}
          />
          <text x={marginLeft - 8} y={y(v)} textAnchor="end" dominantBaseline="middle" fill={MUTED}>
            {formatTick(v)}
          </text>
        </g>
      ))}

      {/* X-akselin päivämäärät; reunimmaiset ankkuroidaan sisäänpäin */}
      {xTicks.map((t, i) => (
        <text
          key={t}
          x={x(t)}
          y={H - 8}
          fill={MUTED}
          textAnchor={
            xTicks.length === 1 ? "middle" : i === 0 ? "start" : i === xTicks.length - 1 ? "end" : "middle"
          }
        >
          {formatDate(new Date(t))}
        </text>
      ))}

      <path d={path} fill="none" stroke={SERIES} strokeWidth={3} strokeLinejoin="round" strokeLinecap="round" />

      {pts.map((p) => (
        <g key={p.t}>
          <circle cx={x(p.t)} cy={y(p.value)} r={5} fill={SERIES} stroke={SURFACE} strokeWidth={2} />
          {/* Pistettä suurempi, näkymätön alue hover-vihjettä varten */}
          <circle cx={x(p.t)} cy={y(p.value)} r={13} fill="transparent">
            <title>{p.title}</title>
          </circle>
        </g>
      ))}

      <circle
        cx={x(last.t)}
        cy={y(last.value)}
        r={9}
        fill="none"
        stroke={SERIES}
        strokeWidth={2.5}
      />

      {/* Nykyinen arvo viivan päässä */}
      <text
        x={valueLabelX}
        y={y(last.value)}
        textAnchor={valueLabelAnchor}
        dominantBaseline="middle"
        fill={INK}
        fontWeight="bold"
      >
        {endLabel ?? formatTick(last.value)}
      </text>
    </svg>
  );
}
