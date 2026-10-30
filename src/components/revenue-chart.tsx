"use client";

import { useState } from "react";
import { formatMoney } from "@/lib/format";

type Point = { month: string; value: number };

// Simple dependency-free SVG area chart. Drawn left-to-right in time order.
export function RevenueChart({ data, currency }: { data: Point[]; currency: string }) {
  const [hover, setHover] = useState<number | null>(null);
  const w = 720;
  const h = 260;
  const pad = { top: 16, right: 16, bottom: 32, left: 16 };
  const max = Math.max(1, ...data.map((d) => d.value)) * 1.1;
  const stepX = (w - pad.left - pad.right) / (data.length - 1);
  const x = (i: number) => pad.left + i * stepX;
  const y = (v: number) => pad.top + (1 - v / max) * (h - pad.top - pad.bottom);

  const line = data.map((d, i) => `${i ? "L" : "M"}${x(i)},${y(d.value)}`).join(" ");
  const area = `${line} L${x(data.length - 1)},${h - pad.bottom} L${x(0)},${h - pad.bottom} Z`;
  const active = hover !== null ? data[hover] : null;

  return (
    <div className="relative" dir="ltr">
      <svg viewBox={`0 0 ${w} ${h}`} className="h-auto w-full" onMouseLeave={() => setHover(null)}>
        <defs>
          <linearGradient id="rev-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75, 1].map((t) => (
          <line
            key={t}
            x1={pad.left}
            x2={w - pad.right}
            y1={y(max * t)}
            y2={y(max * t)}
            stroke="var(--border)"
            strokeDasharray="4 4"
          />
        ))}
        <path d={area} fill="url(#rev-fill)" />
        <path d={line} fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinejoin="round" />
        {data.map((d, i) => (
          <g key={d.month}>
            <rect
              x={x(i) - stepX / 2}
              y={0}
              width={stepX}
              height={h}
              fill="transparent"
              onMouseEnter={() => setHover(i)}
            />
            {hover === i && (
              <>
                <line x1={x(i)} x2={x(i)} y1={pad.top} y2={h - pad.bottom} stroke="var(--border)" />
                <circle cx={x(i)} cy={y(d.value)} r="5" fill="var(--surface)" stroke="var(--primary)" strokeWidth="2.5" />
              </>
            )}
            <text
              x={x(i)}
              y={h - 10}
              textAnchor="middle"
              fontSize="11"
              fill="var(--muted)"
              className="font-sans"
            >
              {d.month}
            </text>
          </g>
        ))}
      </svg>
      {active && hover !== null && (
        <div
          className="pointer-events-none absolute -translate-x-1/2 rounded-lg border border-border bg-surface px-3 py-1.5 text-center text-xs shadow-lg"
          style={{ left: `${(x(hover) / w) * 100}%`, top: 0 }}
        >
          <div className="text-muted">{active.month}</div>
          <div className="font-bold">{formatMoney(active.value, currency)}</div>
        </div>
      )}
    </div>
  );
}
