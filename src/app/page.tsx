import ProjectCard from "@/components/ProjectCard";
import type { ProjectData } from "@/components/types";

// ---- 服务端数据获取 ----

async function getProjects(): Promise<ProjectData[]> {
  try {
    // 服务端直接查询数据库，不走 HTTP
    const { prisma } = await import("@/lib/prisma");
    const projects = await prisma.project.findMany({
      orderBy: { amount: "desc" },
      take: 20,
      include: { papers: true },
    });

    return projects.map((p) => ({
      ...p,
      startDate: p.startDate.toISOString(),
      plannedEndDate: p.plannedEndDate.toISOString(),
      actualEndDate: p.actualEndDate?.toISOString() ?? null,
      radarData: p.radarData ? JSON.parse(p.radarData) : null,
      papers: p.papers.map((paper) => ({
        ...paper,
        citingDisciplines: paper.citingDisciplines
          ? JSON.parse(paper.citingDisciplines)
          : [],
        citingInstitutions: paper.citingInstitutions
          ? JSON.parse(paper.citingInstitutions)
          : [],
      })),
    })) as ProjectData[];
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return [];
  }
}

// ---- 首页 ----

export default async function Home() {
  const projects = await getProjects();

  // 计算碎纸机数据
  const totalAmount = projects.reduce((s, p) => s + p.amount, 0);
  const avgTaxpayer = 4.7; // 千人，见指标引擎注释
  const todayBurn = Math.round((totalAmount * 10000) / 365);
  const todayTaxpayer = Math.round(todayBurn / avgTaxpayer);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-10">
      {/* ---- 英雄区 ---- */}
      <section className="space-y-4">
        <div className="brutal-border brutal-shadow-lg bg-warning p-6 sm:p-8">
          <h1 className="font-heading font-black text-3xl sm:text-4xl leading-tight">
            这笔钱，
            <br />
            研究了个啥？
          </h1>
          <p className="mt-4 text-sm font-medium max-w-lg leading-relaxed">
            四维学术公共问责指标：内部效率 · 传播半径 · 公共牵引力 · 承诺兑现度。
            用学术界自己的标准衡量产出，不辩论，只展示。
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="brutal-badge text-[11px]">破五唯</span>
            <span className="brutal-badge text-[11px]">反学术形式主义</span>
            <span className="brutal-badge text-[11px]">把论文写在祖国的大地上</span>
          </div>
        </div>
      </section>

      {/* ---- 碎纸机区 ---- */}
      <section className="brutal-border brutal-shadow bg-black text-white p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="brutal-border bg-[#1a1a1a] shrink-0 w-20 h-20 flex items-center justify-center text-3xl">
            🗑️
          </div>
          <div className="flex-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-concrete mb-1">
              哲学类课题年均消耗公共资金
            </div>
            <div className="data-number text-2xl sm:text-3xl text-alert">
              ¥{todayBurn.toLocaleString("zh-CN")}
              <span className="text-base text-concrete">/天</span>
            </div>
            <div className="text-xs text-concrete mt-1">
              相当于 ≈ {todayTaxpayer} 个纳税人一年的缴税额
            </div>
          </div>
        </div>
        <p className="text-[10px] text-concrete mt-3">
          * 基于 {projects.length} 个哲学类项目数据估算。数据来源：国家社科基金项目数据库。
        </p>
      </section>

      {/* ---- 项目列表 ---- */}
      <section className="space-y-8">
        <div className="flex items-center gap-3">
          <h2 className="font-heading font-black text-xl">
            📋 哲学项目追踪
          </h2>
          <span className="brutal-badge text-[10px]">
            {projects.length} 个项目
          </span>
        </div>

        {projects.length === 0 ? (
          <div className="brutal-border p-12 text-center">
            <p className="text-concrete">暂无数据。数据采集管道正在建设中。</p>
          </div>
        ) : (
          projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))
        )}
      </section>
    </div>
  );
}
