"use client";

import { useState } from "react";
import type { Project } from "./types";

// ---- 工具函数 ----

function formatMoney(wan: number): string {
  return `¥${wan.toLocaleString("zh-CN")} 万`;
}

function formatDaily(perDay: number): string {
  return `¥${Math.round(perDay).toLocaleString("zh-CN")}/天`;
}

// 引用成本：null → ∞
function formatCitationCost(val: number | null): string {
  if (val === null) return "∞";
  if (val === 0) return "¥0";
  return `¥${Math.round(val).toLocaleString("zh-CN")}/次`;
}

// 脱水状态标签
function DehydrationBadge({ pct }: { pct: number }) {
  return (
    <span className="brutal-badge text-[10px]">
      💧 脱水量 {pct}%
    </span>
  );
}

// ---- 效率指示器子组件 ----

function MetricBox({
  label,
  value,
  sub,
  highlight = false,
}: {
  label: string;
  value: string;
  sub?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`brutal-border px-3 py-2 text-center flex-1 ${
        highlight ? "bg-warning" : "bg-white"
      }`}
    >
      <div className="text-[10px] font-bold uppercase tracking-wider text-concrete mb-1">
        {label}
      </div>
      <div
        className={`data-number text-lg leading-tight ${
          highlight ? "text-black" : "text-black"
        }`}
      >
        {value}
      </div>
      {sub && (
        <div className="text-[10px] text-concrete mt-0.5 leading-tight">{sub}</div>
      )}
    </div>
  );
}

// ---- 主卡片 ----

export default function ProjectCard({ project }: { project: Project }) {
  const [dewatered, setDewatered] = useState(false);
  const [dewatering, setDewatering] = useState(false);

  const handleDewater = () => {
    if (dewatered) {
      setDewatered(false);
      return;
    }
    setDewatering(true);
    // 模拟脱水处理延迟
    setTimeout(() => {
      setDewatering(false);
      setDewatered(true);
    }, 600);
  };

  // 总引用次数
  const totalCitations = project.papers.reduce(
    (sum, p) => sum + p.citationCount,
    0
  );

  return (
    <article
      className={`brutal-border brutal-shadow bg-white transition-all ${
        dewatering ? "animate-pulse" : ""
      }`}
    >
      {/* ---- 标题区 ---- */}
      <div className="brutal-border border-t-0 border-x-0 px-5 py-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-heading font-black text-lg leading-snug flex-1">
            {project.title}
          </h3>
          {/* 类别标签 */}
          <span className="brutal-badge shrink-0 text-[10px]">
            {project.category}
          </span>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-concrete font-medium">
          <span>{project.institution}</span>
          <span>{project.projectNumber}</span>
          <span>
            {project.startDate} – {project.plannedEndDate}
          </span>
        </div>
      </div>

      {/* ---- 金额区 ---- */}
      <div className="brutal-border border-t-0 border-x-0 px-5 py-4 bg-warning">
        <div className="flex items-end justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-black/60 mb-1">
              资助金额
            </div>
            <div className="data-number text-3xl leading-none">
              {formatMoney(project.amount)}
            </div>
          </div>
          <div className="text-right text-xs font-medium text-black/70">
            公共资金
          </div>
        </div>
      </div>

      {/* ---- 三大效率指标 ---- */}
      <div className="flex flex-col sm:flex-row">
        <MetricBox
          label="纳税人等值"
          value={`≈ ${project.taxpayerEquivalent} 人`}
          sub="年缴税额"
        />
        <MetricBox
          label="单次引用成本"
          value={formatCitationCost(project.citationCost)}
          sub={totalCitations === 0 ? "学术界自己也没看过" : `共 ${totalCitations} 次引用`}
          highlight={project.citationCost === null}
        />
        <MetricBox
          label="学术呼吸成本"
          value={formatDaily(project.dailyBurnRate)}
          sub="每日消耗"
        />
      </div>

      {/* ---- 结项成果 / 脱水摘要 ---- */}
      <div className="brutal-border border-t-0 border-x-0 px-5 py-4">
        {/* 标签栏 */}
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-black uppercase tracking-wider">
            {dewatered ? "💧 脱水结果" : `结项成果（${project.papers.length} 篇）`}
          </h4>
          {dewatered && project.papers[0] && (
            <DehydrationBadge
              pct={Math.floor(
                (1 -
                  project.papers[0].dewateredSummary.length /
                    project.papers[0].title.length /
                    3) *
                  100
              )}
            />
          )}
        </div>

        {dewatered ? (
          /* 脱水视图 */
          <div className="space-y-3">
            {project.papers.map((paper, i) => (
              <div key={i} className="brutal-border bg-[#fffef0] p-3">
                <p className="text-sm leading-relaxed font-medium">
                  {paper.dewateredSummary}
                </p>
                <p className="text-[10px] text-concrete mt-1.5">
                  ⚠ 以上为 AI 生成脱水摘要，不代表本平台观点。原文标题：
                  <a
                    href={paper.cnkiUrl}
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
          /* 原文视图 */
          <div className="space-y-2">
            {project.papers.map((paper, i) => (
              <div
                key={i}
                className="flex items-start justify-between gap-3 text-sm"
              >
                <div className="flex-1 min-w-0">
                  <p className="truncate font-medium">{paper.title}</p>
                  <p className="text-xs text-concrete mt-0.5">
                    {paper.journal} · {paper.year} · 被引 {paper.citationCount}{" "}
                    次 · 下载 {paper.downloadCount} 次
                  </p>
                </div>
                <a
                  href={paper.cnkiUrl}
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
