/**
 * 大地观察哨 — 数据库种子脚本
 * MVP 阶段填充样板数据，验证全链路可用。
 *
 * 运行：npx tsx prisma/seed.ts
 */

import { PrismaSqlite } from "prisma-adapter-sqlite";
import { PrismaClient } from "../src/generated/prisma/client";

// 使用与 .env 相同的路径（相对于项目根目录）
const DATABASE_URL = process.env.DATABASE_URL || "file:./dev.db";

const prisma = new PrismaClient({
  adapter: new PrismaSqlite({ url: DATABASE_URL }),
});

async function main() {
  console.log("🌱 开始填充样板数据...\n");

  // 清空旧数据
  await prisma.vote.deleteMany();
  await prisma.paper.deleteMany();
  await prisma.project.deleteMany();
  await prisma.keyword.deleteMany();

  // ---- 项目 1 ----
  const p1 = await prisma.project.create({
    data: {
      projectNumber: "20AZX012",
      title:
        "海德格尔后期 Ereignis 概念的拓扑学转向及其对主体性批判的再奠基",
      category: "重点项目",
      discipline: "哲学·外国哲学",
      amount: 35,
      principalInvestigator: "张某某",
      institution: "某985高校哲学系",
      startDate: new Date("2020-09-01"),
      plannedEndDate: new Date("2025-12-31"),
      taxpayerEquivalent: 7.5,
      citationCost: 87500,
      dailyBurnRate: 192,
      sourceUrl: "https://fz.people.com.cn/skygb/sk/index.php/Index/seach",
      papers: {
        create: [
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
    },
  });

  // ---- 项目 2 ----
  const p2 = await prisma.project.create({
    data: {
      projectNumber: "21CZX045",
      title:
        "当代法国哲学中'不可言说之物'的修辞策略及其对主体性批判的再奠基——以列维纳斯、南希、马里翁为中心",
      category: "青年项目",
      discipline: "哲学·外国哲学",
      amount: 20,
      principalInvestigator: "李某某",
      institution: "某211高校人文学院",
      startDate: new Date("2021-07-01"),
      plannedEndDate: new Date("2024-12-31"),
      taxpayerEquivalent: 4.3,
      citationCost: null, // 引用为0 → 无穷大
      dailyBurnRate: 152,
      sourceUrl: "https://fz.people.com.cn/skygb/sk/index.php/Index/seach",
      papers: {
        create: [
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
    },
  });

  // ---- 项目 3 ----
  const p3 = await prisma.project.create({
    data: {
      projectNumber: "19BZX078",
      title:
        "胡塞尔发生现象学中'被动综合'概念的谱系学重构与当代认知科学的对话可能",
      category: "一般项目",
      discipline: "哲学·外国哲学/科学技术哲学",
      amount: 25,
      principalInvestigator: "王某某",
      institution: "某985高校哲学系",
      startDate: new Date("2019-06-01"),
      plannedEndDate: new Date("2024-06-30"),
      taxpayerEquivalent: 5.4,
      citationCost: 62500,
      dailyBurnRate: 137,
      sourceUrl: "https://fz.people.com.cn/skygb/sk/index.php/Index/seach",
      papers: {
        create: [
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
    },
  });

  // ---- 关键词 ----
  const keywords = [
    { word: "主体性", funding: 55, count: 2 },
    { word: "海德格尔", funding: 35, count: 1 },
    { word: "拓扑学", funding: 35, count: 1 },
    { word: "Ereignis", funding: 35, count: 1 },
    { word: "现象学", funding: 45, count: 2 },
    { word: "胡塞尔", funding: 25, count: 1 },
    { word: "主体间性", funding: 20, count: 1 },
    { word: "列维纳斯", funding: 20, count: 1 },
    { word: "认知科学", funding: 25, count: 1 },
    { word: "不可言说", funding: 20, count: 1 },
  ];

  for (const kw of keywords) {
    await prisma.keyword.create({ data: { word: kw.word, totalFunding: kw.funding, projectCount: kw.count } });
  }

  // ---- 站点配置 ----
  await prisma.siteConfig.upsert({
    where: { id: "main" },
    create: {
      id: "main",
      dailyBaselineAmount: 481,
      dailyBaselineDate: new Date(),
    },
    update: {
      dailyBaselineAmount: 481,
      dailyBaselineDate: new Date(),
    },
  });

  console.log(`✅ 已创建 ${3} 个项目，${5} 篇论文，${keywords.length} 个关键词`);
  console.log(`   项目1: ${p1.title.slice(0, 30)}... (ID: ${p1.id})`);
  console.log(`   项目2: ${p2.title.slice(0, 30)}... (ID: ${p2.id})`);
  console.log(`   项目3: ${p3.title.slice(0, 30)}... (ID: ${p3.id})`);

  // 验证查询
  const count = await prisma.project.count();
  console.log(`\n📊 数据库中共 ${count} 个项目\n`);
}

main()
  .catch((e) => {
    console.error("❌ 种子失败:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
