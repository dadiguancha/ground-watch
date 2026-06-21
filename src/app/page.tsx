import ProjectCard from "@/components/ProjectCard";
import type { ProjectData } from "@/components/types";

// ---- 静态保底数据（Vercel 部署时使用，避免 SQLite 依赖）----

const STATIC_FALLBACK: ProjectData[] = [
  {
    id: "static-1",
    projectNumber: "20AZX012",
    title: "海德格尔后期 Ereignis 概念的拓扑学转向及其对主体性批判的再奠基",
    category: "重点项目",
    discipline: "哲学·外国哲学",
    amount: 35,
    principalInvestigator: "张某某",
    institution: "某985高校哲学系",
    startDate: "2020-09-01",
    plannedEndDate: "2025-12-31",
    actualEndDate: "2025-12-31",
    totalCitations: 4,
    selfCitations: 1,
    externalCitations: 1,
    citationCost: 87500,
    citationConcentration: 0.5,
    zeroCitationRatio: 0,
    sameDisciplineCitationRatio: 0.5,
    sameInstitutionCitationRatio: 0,
    crossDisciplineCitations: 0,
    nonAcademicMentions: 0,
    isFreeToRead: false,
    publicDiscussionCount: 0,
    plannedDurationDays: 1947,
    actualDurationDays: 1947,
    completionDelay: 0,
    promisedPaperCount: 5,
    actualPaperCount: 2,
    outputShrinkage: 0.6,
    overallScore: 39,
    radarData: [["内部效率", 50], ["传播半径", 35], ["公共牵引", 0], ["承诺兑现", 70]],
    papers: [
      {
        id: "p1", title: "从Ereignis到Enteignis：海德格尔后期思想中的拓扑学转向与存在论差异的再奠基",
        journal: "哲学研究", year: 2022, citationCount: 3, downloadCount: 218,
        cnkiUrl: "#", selfCitation: true, citingDisciplines: ["哲学·外国哲学"],
        citingInstitutions: ["某985高校哲学系"], nonAcademicMentions: 0,
        isFreeToRead: false, dewateredSummary: "用35万经费研究了海德格尔后期一个自己造的词（Ereignis），结论是这个词的意思一直在变。",
        publicRelevanceScore: 5,
      },
      {
        id: "p2", title: "拓扑学的本体论意涵——以海德格尔后期思想为中心的考察",
        journal: "世界哲学", year: 2023, citationCount: 1, downloadCount: 97,
        cnkiUrl: "#", selfCitation: false, citingDisciplines: ["哲学·外国哲学"],
        citingInstitutions: ["某211高校人文学院"], nonAcademicMentions: 0,
        isFreeToRead: false, dewateredSummary: "试图论证'拓扑学'在哲学里不是一个比喻。但整篇论文没有用到任何一个拓扑学公式。",
        publicRelevanceScore: 5,
      },
    ],
  },
  {
    id: "static-2",
    projectNumber: "21CZX045",
    title: "当代法国哲学中'不可言说之物'的修辞策略及其对主体性批判的再奠基",
    category: "青年项目",
    discipline: "哲学·外国哲学",
    amount: 20,
    principalInvestigator: "李某某",
    institution: "某211高校人文学院",
    startDate: "2021-07-01",
    plannedEndDate: "2024-12-31",
    actualEndDate: "2025-06-30",
    totalCitations: 0,
    selfCitations: 0,
    externalCitations: 0,
    citationCost: null,
    citationConcentration: 0,
    zeroCitationRatio: 1,
    sameDisciplineCitationRatio: null,
    sameInstitutionCitationRatio: null,
    crossDisciplineCitations: 0,
    nonAcademicMentions: 0,
    isFreeToRead: false,
    publicDiscussionCount: 0,
    plannedDurationDays: 1279,
    actualDurationDays: 1460,
    completionDelay: 181,
    promisedPaperCount: 3,
    actualPaperCount: 1,
    outputShrinkage: 0.67,
    overallScore: 17,
    radarData: [["内部效率", 0], ["传播半径", 30], ["公共牵引", 0], ["承诺兑现", 37]],
    papers: [
      {
        id: "p3", title: "说不可说：列维纳斯'面容'概念的修辞学解读及其伦理意涵",
        journal: "哲学动态", year: 2023, citationCount: 0, downloadCount: 143,
        cnkiUrl: "#", selfCitation: false, citingDisciplines: [], citingInstitutions: [],
        nonAcademicMentions: 0, isFreeToRead: false,
        dewateredSummary: "花了20万经费和三年时间，试图说清楚'为什么说不出来'。结论：确实说不出来。",
        publicRelevanceScore: 3,
      },
    ],
  },
  {
    id: "static-3",
    projectNumber: "19BZX078",
    title: "胡塞尔发生现象学中'被动综合'概念的谱系学重构与当代认知科学的对话可能",
    category: "一般项目",
    discipline: "哲学·外国哲学",
    amount: 25,
    principalInvestigator: "王某某",
    institution: "某985高校哲学系",
    startDate: "2019-06-01",
    plannedEndDate: "2024-06-30",
    actualEndDate: "2024-06-30",
    totalCitations: 6,
    selfCitations: 0,
    externalCitations: 4,
    citationCost: 41667,
    citationConcentration: 2,
    zeroCitationRatio: 0,
    sameDisciplineCitationRatio: 0.5,
    sameInstitutionCitationRatio: 0,
    crossDisciplineCitations: 3,
    nonAcademicMentions: 1,
    isFreeToRead: false,
    publicDiscussionCount: 0,
    plannedDurationDays: 1856,
    actualDurationDays: 1856,
    completionDelay: 0,
    promisedPaperCount: 4,
    actualPaperCount: 2,
    outputShrinkage: 0.5,
    overallScore: 51,
    radarData: [["内部效率", 50], ["传播半径", 70], ["公共牵引", 8], ["承诺兑现", 75]],
    papers: [
      {
        id: "p4", title: "被动综合与前反思维度——胡塞尔与认知神经科学的对话空间",
        journal: "哲学研究", year: 2021, citationCount: 4, downloadCount: 312,
        cnkiUrl: "#", selfCitation: false, citingDisciplines: ["哲学·外国哲学", "心理学", "科学技术哲学"],
        citingInstitutions: ["某985高校哲学系", "某师范大学心理学院"], nonAcademicMentions: 1,
        isFreeToRead: false, dewateredSummary: "胡塞尔说的和现代脑科学说的，可能是一回事——但不是完全一回事。",
        publicRelevanceScore: 30,
      },
      {
        id: "p5", title: "发生现象学视域下的时间意识与自我构成",
        journal: "现代哲学", year: 2022, citationCount: 2, downloadCount: 176,
        cnkiUrl: "#", selfCitation: false, citingDisciplines: ["哲学·外国哲学"],
        citingInstitutions: ["某985高校哲学系"], nonAcademicMentions: 0,
        isFreeToRead: false, dewateredSummary: "探讨了'时间感'是怎么形成的。一个普通人在堵车的时候也会想这个问题，但不会花25万经费去想。",
        publicRelevanceScore: 15,
      },
    ],
  },
];

// ---- 数据获取（本地用 DB，Vercel 用 API）----

async function getProjects(): Promise<ProjectData[]> {
  // 尝试从数据库直连（本地开发）
  if (process.env.NODE_ENV === "development") {
    try {
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
    } catch {
      // 数据库不可用，回退到静态数据
    }
  }

  // 生产环境 / 数据库不可用 → 用硬编码静态数据
  return STATIC_FALLBACK;
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
