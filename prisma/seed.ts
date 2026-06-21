/**
 * 大地观察哨 v2 — 数据库种子脚本
 * 使用六维指标体系 + 真实计算引擎
 *
 * 运行：npx tsx prisma/seed.ts
 */

import "dotenv/config";
import { PrismaSqlite } from "prisma-adapter-sqlite";
import { PrismaClient } from "../src/generated/prisma/client";
import { calculateIndicators, calcTaxpayerEquivalent, calcDailyBurnRate } from "../src/lib/indicators";
import type { ProjectInput, PaperInput } from "../src/lib/indicators";

const DATABASE_URL = process.env.DATABASE_URL || "file:./dev.db";

const prisma = new PrismaClient({
  adapter: new PrismaSqlite({ url: DATABASE_URL }),
});

// ---- 样板项目数据 ----

interface SeedProject {
  projectNumber: string;
  title: string;
  category: string;
  discipline: string;
  amount: number;
  principalInvestigator: string;
  institution: string;
  startDate: string;
  plannedEndDate: string;
  actualEndDate?: string;
  promisedPaperCount?: number;
  sourceUrl: string;
  papers: {
    title: string;
    journal: string;
    year: number;
    citationCount: number;
    downloadCount: number;
    cnkiUrl: string;
    selfCitation: boolean;
    citingDisciplines: string[];
    citingInstitutions: string[];
    nonAcademicMentions: number;
    isFreeToRead: boolean;
    dewateredSummary: string;
    publicRelevanceScore: number;
  }[];
}

const SEED_PROJECTS: SeedProject[] = [
  {
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
    promisedPaperCount: 5,
    sourceUrl: "https://fz.people.com.cn/skygb/sk/index.php/Index/seach",
    papers: [
      {
        title: "从Ereignis到Enteignis：海德格尔后期思想中的拓扑学转向与存在论差异的再奠基",
        journal: "哲学研究",
        year: 2022,
        citationCount: 3,
        downloadCount: 218,
        cnkiUrl: "#",
        selfCitation: true,
        citingDisciplines: ["哲学·外国哲学"],
        citingInstitutions: ["某985高校哲学系"],
        nonAcademicMentions: 0,
        isFreeToRead: false,
        dewateredSummary:
          "用35万经费研究了海德格尔后期一个自己造的词（Ereignis），结论是这个词的意思一直在变，而且变的方式本身就说明了一种关于'主体性'的道理。",
        publicRelevanceScore: 5,
      },
      {
        title: "拓扑学的本体论意涵——以海德格尔后期思想为中心的考察",
        journal: "世界哲学",
        year: 2023,
        citationCount: 1,
        downloadCount: 97,
        cnkiUrl: "#",
        selfCitation: false,
        citingDisciplines: ["哲学·外国哲学"],
        citingInstitutions: ["某211高校人文学院"],
        nonAcademicMentions: 0,
        isFreeToRead: false,
        dewateredSummary:
          "试图论证'拓扑学'在哲学里不是一个比喻，而是一种思考方式。但整篇论文本身没有用到任何一个拓扑学公式。",
        publicRelevanceScore: 5,
      },
    ],
  },
  {
    projectNumber: "21CZX045",
    title:
      "当代法国哲学中'不可言说之物'的修辞策略及其对主体性批判的再奠基——以列维纳斯、南希、马里翁为中心",
    category: "青年项目",
    discipline: "哲学·外国哲学",
    amount: 20,
    principalInvestigator: "李某某",
    institution: "某211高校人文学院",
    startDate: "2021-07-01",
    plannedEndDate: "2024-12-31",
    actualEndDate: "2025-06-30",
    promisedPaperCount: 3,
    sourceUrl: "https://fz.people.com.cn/skygb/sk/index.php/Index/seach",
    papers: [
      {
        title: "说不可说：列维纳斯'面容'概念的修辞学解读及其伦理意涵",
        journal: "哲学动态",
        year: 2023,
        citationCount: 0,
        downloadCount: 143,
        cnkiUrl: "#",
        selfCitation: false,
        citingDisciplines: [],
        citingInstitutions: [],
        nonAcademicMentions: 0,
        isFreeToRead: false,
        dewateredSummary:
          "这篇论文的核心观点是：有些东西说不出来，但哲学家们花了20万经费和三年时间，试图说清楚'为什么说不出来'。最后得出了一个结论：确实说不出来。",
        publicRelevanceScore: 3,
      },
    ],
  },
  {
    projectNumber: "19BZX078",
    title:
      "胡塞尔发生现象学中'被动综合'概念的谱系学重构与当代认知科学的对话可能",
    category: "一般项目",
    discipline: "哲学·外国哲学/科学技术哲学",
    amount: 25,
    principalInvestigator: "王某某",
    institution: "某985高校哲学系",
    startDate: "2019-06-01",
    plannedEndDate: "2024-06-30",
    actualEndDate: "2024-06-30",
    promisedPaperCount: 4,
    sourceUrl: "https://fz.people.com.cn/skygb/sk/index.php/Index/seach",
    papers: [
      {
        title: "被动综合与前反思维度——胡塞尔与认知神经科学的对话空间",
        journal: "哲学研究",
        year: 2021,
        citationCount: 4,
        downloadCount: 312,
        cnkiUrl: "#",
        selfCitation: false,
        citingDisciplines: ["哲学·外国哲学", "心理学·认知心理学", "科学技术哲学"],
        citingInstitutions: ["某985高校哲学系", "某师范大学心理学院"],
        nonAcademicMentions: 1,
        isFreeToRead: false,
        dewateredSummary:
          "胡塞尔100年前提了一个概念叫'被动综合'，大概意思是你不用主动想，脑子自己就在整理经验。这篇论文花了25万证明：胡塞尔说的和现代脑科学说的，可能是一回事——但不是完全一回事。",
        publicRelevanceScore: 30,
      },
      {
        title: "发生现象学视域下的时间意识与自我构成",
        journal: "现代哲学",
        year: 2022,
        citationCount: 2,
        downloadCount: 176,
        cnkiUrl: "#",
        selfCitation: false,
        citingDisciplines: ["哲学·外国哲学"],
        citingInstitutions: ["某985高校哲学系"],
        nonAcademicMentions: 0,
        isFreeToRead: false,
        dewateredSummary:
          "探讨了'时间感'是怎么形成的。一个普通人在堵车的时候也会想这个问题，但不会花25万经费去想。",
        publicRelevanceScore: 15,
      },
    ],
  },
];

// ---- 主函数 ----

async function main() {
  console.log("🌱 大地观察哨 v2 — 填充样板数据（含六维指标体系）\n");

  // 清空
  await prisma.vote.deleteMany();
  await prisma.paper.deleteMany();
  await prisma.project.deleteMany();
  await prisma.keyword.deleteMany();
  await prisma.siteConfig.deleteMany();

  for (const seed of SEED_PROJECTS) {
    // 构建 PaperInput 用于指标计算
    const paperInputs: PaperInput[] = seed.papers.map((p) => ({
      citationCount: p.citationCount,
      selfCitation: p.selfCitation,
      citingDisciplines: p.citingDisciplines,
      citingInstitutions: p.citingInstitutions,
      nonAcademicMentions: p.nonAcademicMentions,
      isFreeToRead: p.isFreeToRead,
    }));

    const projectInput: ProjectInput = {
      amount: seed.amount,
      discipline: seed.discipline,
      startDate: seed.startDate,
      plannedEndDate: seed.plannedEndDate,
      actualEndDate: seed.actualEndDate,
      promisedPaperCount: seed.promisedPaperCount,
      papers: paperInputs,
    };

    // 计算指标
    const indicators = calculateIndicators(projectInput);
    const taxpayer = calcTaxpayerEquivalent(seed.amount);
    const dailyBurn = calcDailyBurnRate(seed.amount, seed.startDate, seed.actualEndDate);

    // 存入数据库
    await prisma.project.create({
      data: {
        projectNumber: seed.projectNumber,
        title: seed.title,
        category: seed.category,
        discipline: seed.discipline,
        amount: seed.amount,
        principalInvestigator: seed.principalInvestigator,
        institution: seed.institution,
        startDate: new Date(seed.startDate),
        plannedEndDate: new Date(seed.plannedEndDate),
        actualEndDate: seed.actualEndDate ? new Date(seed.actualEndDate) : null,

        // 维度一
        totalCitations: indicators.totalCitations,
        selfCitations: indicators.selfCitations,
        externalCitations: indicators.externalCitations,
        citationCost: indicators.citationCost,
        citationConcentration: indicators.citationConcentration,
        zeroCitationRatio: indicators.zeroCitationRatio,

        // 维度二
        sameDisciplineCitationRatio: indicators.sameDisciplineRatio,
        sameInstitutionCitationRatio: indicators.sameInstitutionRatio,
        crossDisciplineCitations: indicators.crossDisciplineCitations,

        // 维度三
        nonAcademicMentions: indicators.nonAcademicMentions,
        isFreeToRead: indicators.freeToReadRatio === 1,
        publicDiscussionCount: Math.round(indicators.publicDiscussionScore * 10),

        // 维度四
        plannedDurationDays: indicators.plannedDurationDays,
        actualDurationDays: indicators.actualDurationDays,
        completionDelay: indicators.completionDelay,
        promisedPaperCount: seed.promisedPaperCount,
        actualPaperCount: seed.papers.length,
        outputShrinkage: indicators.outputShrinkage,

        // 综合
        overallScore: indicators.overallScore,
        radarData: JSON.stringify(indicators.radarData),

        sourceUrl: seed.sourceUrl,

        papers: {
          create: seed.papers.map((p) => ({
            title: p.title,
            journal: p.journal,
            year: p.year,
            citationCount: p.citationCount,
            downloadCount: p.downloadCount,
            cnkiUrl: p.cnkiUrl,
            selfCitation: p.selfCitation,
            citingDisciplines: JSON.stringify(p.citingDisciplines),
            citingInstitutions: JSON.stringify(p.citingInstitutions),
            nonAcademicMentions: p.nonAcademicMentions,
            isFreeToRead: p.isFreeToRead,
            dewateredSummary: p.dewateredSummary,
            publicRelevanceScore: p.publicRelevanceScore,
          })),
        },
      },
    });

    console.log(
      `  ✅ [${indicators.overallScore}分] ${seed.title.slice(0, 40)}...`
    );
    console.log(
      `     内部效率:${indicators.dimensions.internalEfficiency} | 传播半径:${indicators.dimensions.communicationRadius} | 公共牵引:${indicators.dimensions.publicTraction} | 承诺兑现:${indicators.dimensions.commitmentFulfillment}`
    );
  }

  // 关键词
  const keywords = [
    "主体性", "海德格尔", "拓扑学", "Ereignis",
    "现象学", "胡塞尔", "主体间性", "列维纳斯",
    "认知科学", "不可言说", "被动综合", "存在论",
  ];
  for (const word of keywords) {
    await prisma.keyword.create({
      data: { word, totalFunding: 15 + Math.random() * 30, projectCount: 1 + Math.floor(Math.random() * 3) },
    });
  }

  // 站点配置
  await prisma.siteConfig.create({
    data: { id: "main", dailyBaselineAmount: 481, dailyBaselineDate: new Date() },
  });

  const count = await prisma.project.count();
  console.log(`\n📊 数据库共 ${count} 个项目`);
}

main()
  .catch((e) => {
    console.error("❌ 种子失败:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
