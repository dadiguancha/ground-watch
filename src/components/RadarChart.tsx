"use client";

/**
 * 简约 SVG 六维雷达图
 * Neo-Brutalism 风格：纯黑线条 + 警示黄数据面
 */

interface RadarChartProps {
  data: [string, number][]; // [[维度名, 分数0-100], ...]
  size?: number;
}

export default function RadarChart({ data, size = 120 }: RadarChartProps) {
  if (!data || data.length === 0) return null;

  const n = data.length;
  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 16;

  const angleStep = (2 * Math.PI) / n;

  // 计算点的坐标
  const getPoint = (i: number, value: number) => {
    const angle = angleStep * i - Math.PI / 2;
    const r = (value / 100) * radius;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    };
  };

  // 背景网格（3 层：33, 66, 100）
  const gridLevels = [0.33, 0.66, 1.0];
  const gridPolygons = gridLevels.map((level) => {
    const points = Array.from({ length: n }, (_, i) => {
      const { x, y } = getPoint(i, level * 100);
      return `${x},${y}`;
    }).join(" ");
    return points;
  });

  // 数据多边形
  const dataPoints = data
    .map(([, score], i) => {
      const { x, y } = getPoint(i, score);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="shrink-0"
    >
      {/* 网格 */}
      {gridPolygons.map((points, j) => (
        <polygon
          key={`grid-${j}`}
          points={points}
          fill="none"
          stroke="#D1D1D1"
          strokeWidth={j === 2 ? "2" : "1"}
        />
      ))}

      {/* 轴线 */}
      {Array.from({ length: n }, (_, i) => {
        const { x, y } = getPoint(i, 100);
        return (
          <line
            key={`axis-${i}`}
            x1={cx}
            y1={cy}
            x2={x}
            y2={y}
            stroke="#D1D1D1"
            strokeWidth="1"
          />
        );
      })}

      {/* 数据面 */}
      <polygon
        points={dataPoints}
        fill="#FFD100"
        fillOpacity="0.6"
        stroke="#000"
        strokeWidth="2"
      />

      {/* 数据点 */}
      {data.map(([, score], i) => {
        const { x, y } = getPoint(i, score);
        return (
          <circle
            key={`dot-${i}`}
            cx={x}
            cy={y}
            r="3"
            fill="#000"
            stroke="#FFD100"
            strokeWidth="1"
          />
        );
      })}

      {/* 维度标签 */}
      {data.map(([label], i) => {
        const { x, y } = getPoint(i, 115);
        return (
          <text
            key={`label-${i}`}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-[8px] font-bold"
            fill="#000"
          >
            {label}
          </text>
        );
      })}

      {/* 中心分数 */}
      <text
        x={cx}
        y={cy + 1}
        textAnchor="middle"
        dominantBaseline="middle"
        className="text-xs font-black"
        fill="#000"
      >
        {Math.round(
          data.reduce((s, [, v]) => s + v, 0) / data.length
        )}
      </text>
    </svg>
  );
}
