import ProjectCard from "@/components/ProjectCard";
import type { Project } from "@/components/types";

// ---- 硬编码样板数据（MVP 验证视觉效果用）----
const SAMPLE_PROJECTS: Project[] = [
  {
    id: "demo-1",
    projectNumber: "20AZX012",
    title:
      "海德格尔后期 Ereignis 概念的拓扑学转向及其对主体性批判的再奠基",
    category: "重点项目",
    discipline: "哲学·外国哲学",
    amount: 35,
    principalInvestigator: "张某某",
    institution: "某985高校哲学系",
    startDate: "2020-09",
    plannedEndDate: "2025-12",
    taxpayerEquivalent: 7.5,
    citationCost: 87500,
    dailyBurnRate: 192,
    papers: [
      {
        title:
          "从Ereignis到Enteignis：海德格尔后期思想中的拓扑学转向与存在论差异的再奠基",
        journal: "哲学研究",
        year: 2022,
        citationCount: 3,
        downloadCount: 218,
        cnkiUrl: "#",
        dewateredSummary:
          "用35万经费研究了海德格尔后期一个自己造的词（Ereignis），结论是这个词的意思一直在变，而且变的方式本身就说明了一种关于'主体性'的道理。",
      },
      {
        title:
          "拓扑学的本体论意涵——以海德格尔后期思想为中心的考察",
        journal: "世界哲学",
        year: 2023,
        citationCount: 1,
        downloadCount: 97,
        cnkiUrl: "#",
        dewateredSummary:
          "试图论证'拓扑学'在哲学里不是一个比喻，而是一种思考方式。但整篇论文本身没有用到任何一个拓扑学公式。",
      },
    ],
  },
  {
    id: "demo-2",
    projectNumber: "21CZX045",
    title:
      "当代法国哲学中'不可言说之物'的修辞策略及其对主体性批判的再奠基——以列维纳斯、南希、马里翁为中心",
    category: "青年项目",
    discipline: "哲学·外国哲学",
    amount: 20,
    principalInvestigator: "李某某",
    institution: "某211高校人文学院",
    startDate: "2021-07",
    plannedEndDate: "2024-12",
    taxpayerEquivalent: 4.3,
    citationCost: null,
    dailyBurnRate: 152,
    papers: [
      {
        title:
          "说不可说：列维纳斯'面容'概念的修辞学解读及其伦理意涵",
        journal: "哲学动态",
        year: 2023,
        citationCount: 0,
        downloadCount: 143,
        cnkiUrl: "#",
        dewateredSummary:
          "这篇论文的核心观点是：有些东西说不出来，但哲学家们花了20万经费和三年时间，试图说清楚'为什么说不出来'。最后得出了一个结论：确实说不出来。",
      },
    ],
  },
  {
    id: "demo-3",
    projectNumber: "19BZX078",
    title:
      "胡塞尔发生现象学中'被动综合'概念的谱系学重构与当代认知科学的对话可能",
    category: "一般项目",
    discipline: "哲学·外国哲学/科学技术哲学",
    amount: 25,
    principalInvestigator: "王某某",
    institution: "某985高校哲学系",
    startDate: "2019-06",
    plannedEndDate: "2024-06",
    taxpayerEquivalent: 5.4,
    citationCost: 62500,
    dailyBurnRate: 137,
    papers: [
      {
        title:
          "被动综合与前反思维度——胡塞尔与认知神经科学的对话空间",
        journal: "哲学研究",
        year: 2021,
        citationCount: 4,
        downloadCount: 312,
        cnkiUrl: "#",
        dewateredSummary:
          "胡塞尔100年前提了一个概念叫'被动综合'，大概意思是你不用主动想，脑子自己就在整理经验。这篇论文花了25万证明：胡塞尔说的和现代脑科学说的，可能是一回事——但不是完全一回事。",
      },
      {
        title: "发生现象学视域下的时间意识与自我构成",
        journal: "现代哲学",
        year: 2022,
        citationCount: 2,
        downloadCount: 176,
        cnkiUrl: "#",
        dewateredSummary:
          "探讨了'时间感'是怎么形成的。一个普通人在堵车的时候也会想这个问题，但不会花25万经费去想。",
      },
    ],
  },
];

// ---- 碎纸机数据 ----
// 可扩展为实时计算
const TODAY_BURN = {
  total: 1847200,
  taxpayerEquivalent: 398,
};

export default function Home() {
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
            我们不替学者说话，也不帮公众吵架。我们把公开的基金项目数据摊开——
            用学术界自己的标准（引用率、发表量）来衡量产出，
            让断裂自己说话。
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
          {/* 碎纸机占位 — 后续替换为 Lottie 动画 */}
          <div className="brutal-border bg-[#1a1a1a] shrink-0 w-20 h-20 flex items-center justify-center text-3xl">
            🗑️
          </div>
          <div className="flex-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-concrete mb-1">
              今日全网哲学类课题已消耗公共资金
            </div>
            <div className="data-number text-2xl sm:text-3xl text-alert">
              ¥{TODAY_BURN.total.toLocaleString("zh-CN")}
            </div>
            <div className="text-xs text-concrete mt-1">
              相当于 ≈ {TODAY_BURN.taxpayerEquivalent} 个纳税人一年的缴税额
            </div>
          </div>
        </div>
        <p className="text-[10px] text-concrete mt-3">
          * 基于数据库中所有进行中项目日均消耗估算。无实时连接，静态演示数据。
        </p>
      </section>

      {/* ---- 项目卡片 ---- */}
      <section className="space-y-8">
        <div className="flex items-center gap-3">
          <h2 className="font-heading font-black text-xl">📋 哲学项目追踪</h2>
          <span className="brutal-badge text-[10px]">样板数据</span>
        </div>

        {SAMPLE_PROJECTS.map((project, idx) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </section>

      {/* ---- 底部的号召 ---- */}
      <section className="text-center py-8">
        <p className="text-sm text-concrete max-w-md mx-auto leading-relaxed">
          以上为样板演示数据。正式上线后，每一笔国家社科基金哲学类项目的经费、
          论文、引用数据都将在这里公开追踪。
        </p>
      </section>
    </div>
  );
}
