"use client";

import { useState } from "react";
import type { ProjectData } from "./types";
import RadarChart from "./RadarChart";

// ---- 工具 ----

function formatMoney(wan: number): string {
  return `¥${wan.toLocaleString("zh-CN")} 万`;
}

function formatCitationCost(val: number | null): string {
  if (val === null) return "∞";
  return `¥${Math.round(val).toLocaleString("zh-CN")}`;
}

function pct(val: number | null): string {
  if (val === null) return "—";
  return `${Math.round(val * 100)}%`;
}

function delayDays(val: number | null): string {
  if (val === null) return "—";
  if (val <= 0) return "按期/提前";
  return `延期 ${Math.round(val)} 天`;
}

// ---- 维度条 ----

function DimensionBar({
  label,
  score,
  color = "bg-warning",
}: {
  label: string;
  score: number;
  color?: string;
}) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-16 shrink-0 font-bold text-right">{label}</span>
      <div className="flex-1 h-2.5 border-2 border-black bg-white">
        <div
          className={`h-full ${color} border-r-2 border-black transition-all`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="w-8 text-right font-black data-number">{score}</span>
    </div>
  );
}

// ---- 主卡片 ----

export default function ProjectCard({ project }: { project: ProjectData }) {
  const [dewatered, setDewatered] = useState(false);
  const [dewatering, setDewatering] = useState(false);

  const handleDewater = () => {
    if (dewatered) {
      setDewatered(false);
      return;
    }
    setDewatering(true);
    setTimeout(() => {
      setDewatering(false);
      setDewatered(true);
    }, 500);
  };

  const scores = project.radarData
    ? Object.fromEntries(project.radarData.map(([k]) => [k, project.radarData?.find(([rk]) => rk === k)?.[1] ?? 0]))
    : {};

  return (
    <article className="brutal-border brutal-shadow bg-white">
      {/* ---- 标题 ---- */}
      <div className="brutal-border border-t-0 border-x-0 px-5 py-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-heading font-black text-lg leading-snug flex-1">
            {project.title}
          </h3>
          <span className="brutal-badge shrink-0 text-[10px]">{project.category}</span>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-concrete font-medium">
          <span>{project.institution}</span>
          <span>{project.projectNumber}</span>
          <span>
            {project.startDate?.slice(0, 7)} – {project.plannedEndDate?.slice(0, 7)}
          </span>
        </div>
      </div>

      {/* ---- 金额 + 雷达图 ---- */}
      <div className="brutal-border border-t-0 border-x-0 flex flex-col sm:flex-row">
        {/* 金额 */}
        <div className="brutal-border border-t-0 border-l-0 border-b-0 bg-warning px-5 py-4 sm:w-44 shrink-0">
          <div className="text-[10px] font-bold uppercase tracking-wider text-black/60 mb-1">
            资助金额
          </div>
          <div className="data-number text-3xl leading-none">
            {formatMoney(project.amount)}
          </div>
          <div className="text-xs font-medium text-black/70 mt-1">公共资金</div>
        </div>

        {/* 雷达图 */}
        <div className="flex-1 px-4 py-3 flex items-center justify-center gap-4">
          {project.radarData && (
            <RadarChart data={project.radarData} size={100} />
          )}
          <div className="flex-1 space-y-1.5 min-w-0">
            {project.radarData?.map(([dim, score]) => (
              <DimensionBar key={dim} label={dim} score={score} />
            ))}
          </div>
        </div>
      </div>

      {/* ---- 关键指标 ---- */}
      <div className="brutal-border border-t-0 border-x-0 px-5 py-3">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          {/* 引用成本 */}
          <div className="brutal-border p-2 text-center">
            <div className="text-[10px] text-concrete mb-0.5">单次引用成本</div>
            <div className="font-black data-number text-sm">
              {formatCitationCost(project.citationCost)}
            </div>
          </div>
          {/* 零引率 */}
          <div className="brutal-border p-2 text-center">
            <div className="text-[10px] text-concrete mb-0.5">零引论文占比</div>
            <div className="font-black data-number text-sm">
              {pct(project.zeroCitationRatio)}
            </div>
          </div>
          {/* 延期 */}
          <div className="brutal-border p-2 text-center">
            <div className="text-[10px] text-concrete mb-0.5">结项延期</div>
            <div className="font-black data-number text-sm">
              {delayDays(project.completionDelay)}
            </div>
          </div>
          {/* 缩水率 */}
          <div className="brutal-border p-2 text-center">
            <div className="text-[10px] text-concrete mb-0.5">成果缩水率</div>
            <div className="font-black data-number text-sm">
              {pct(project.outputShrinkage)}
            </div>
          </div>
        </div>
      </div>

      {/* ---- 论文 / 脱水 ---- */}
      <div className="brutal-border border-t-0 border-x-0 px-5 py-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-black uppercase tracking-wider">
            {dewatered
              ? "💧 脱水结果"
              : `结项成果（${project.papers.length} 篇）`}
          </h4>
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-concrete">
              引用 {project.totalCitations} | 跨学科 {project.crossDisciplineCitations} | 圈外 {project.nonAcademicMentions}
            </span>
            {project.overallScore !== null && (
              <span
                className={`brutal-badge text-[10px] ${
                  project.overallScore >= 60
                    ? "bg-[#00FF41]"
                    : project.overallScore >= 30
                      ? "bg-warning"
                      : "bg-alert text-white"
                }`}
              >
                综合 {project.overallScore}/100
              </span>
            )}
          </div>
        </div>

        {dewatered ? (
          <div className="space-y-3">
            {project.papers.map((paper, i) => (
              <div key={i} className="brutal-border bg-[#fffef0] p-3">
                <p className="text-sm leading-relaxed font-medium">
                  {paper.dewateredSummary || "（暂无脱水摘要）"}
                </p>
                <p className="text-[10px] text-concrete mt-1.5">
                  ⚠ AI 生成，不代表本平台观点。原文：
                  <a
                    href={paper.cnkiUrl || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-black ml-1"
                  >
                    {paper.title}
                  </a>
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {project.papers.map((paper, i) => (
              <div key={i} className="flex items-start justify-between gap-3 text-sm">
                <div className="flex-1 min-w-0">
                  <p className="truncate font-medium">{paper.title}</p>
                  <p className="text-xs text-concrete mt-0.5">
                    {paper.journal} · {paper.year}
                    {" · "}被引 {paper.citationCount} 次
                    {paper.nonAcademicMentions > 0 && (
                      <span className="text-alert font-bold ml-1">
                        · 圈外提及 {paper.nonAcademicMentions}
                      </span>
                    )}
                  </p>
                </div>
                <a
                  href={paper.cnkiUrl || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="brutal-border shrink-0 px-2 py-0.5 text-[10px] font-bold hover:bg-warning transition-colors"
                >
                  原文
                </a>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ---- 操作栏 ---- */}
      <div className="brutal-border border-t-0 border-x-0 px-5 py-3 flex gap-3">
        <button
          onClick={handleDewater}
          disabled={dewatering}
          className="brutal-border bg-warning px-4 py-1.5 text-sm font-black
                     brutal-interactive disabled:opacity-50 disabled:cursor-wait
                     flex items-center gap-2"
        >
          <span>{dewatering ? "⏳" : "💧"}</span>
          <span>{dewatering ? "脱水处理中..." : dewatered ? "复原" : "脱水"}</span>
        </button>
      </div>
    </article>
  );
}
