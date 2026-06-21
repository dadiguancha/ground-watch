/**
 * 大地观察哨 — 学术公共问责指标体系 · 计算引擎
 *
 * 四个维度、十项核心指标。
 * 采用学术界自己的标准（引用、发表、承诺）反打学术界，
 * 不做主观价值判断，所有指标均为数学计算结果。
 *
 * 原则：
 *  - 任何一个单维度都有合理反驳空间，但六维叠加后，空白本身就是结论
 *  - 所有计算逻辑公开透明，任何人可复现验证
 */

// ---- 类型定义 ----

export interface PaperInput {
  citationCount: number;
  selfCitation: boolean;
  citingDisciplines: string[];    // 引用来源学科列表
  citingInstitutions: string[];   // 引用来源机构列表
  nonAcademicMentions: number;
  isFreeToRead: boolean;
}

export interface ProjectInput {
  amount: number;                   // 万元
  discipline: string;               // 主学科
  startDate: string;                // ISO date
  plannedEndDate: string;           // ISO date
  actualEndDate?: string;           // ISO date, null = 未结项
  promisedPaperCount?: number;      // 承诺论文数
  papers: PaperInput[];
}

export interface DimensionScores {
  internalEfficiency: number;       // 0-100
  communicationRadius: number;      // 0-100
  publicTraction: number;           // 0-100
  commitmentFulfillment: number;    // 0-100
}

export interface IndicatorResult {
  // 维度一：内部效率
  totalCitations: number;
  selfCitations: number;
  externalCitations: number;
  citationCost: number | null;          // null = 无穷大（引用为0）
  citationConcentration: number;        // 篇均他引
  zeroCitationRatio: number;            // 0-1

  // 维度二：传播半径
  sameDisciplineRatio: number | null;   // 0-1
  sameInstitutionRatio: number | null;  // 0-1
  crossDisciplineCitations: number;

  // 维度三：公共牵引力
  nonAcademicMentions: number;
  freeToReadRatio: number;              // 0-1
  publicDiscussionScore: number;        // 0-1 归一化

  // 维度四：承诺兑现度
  plannedDurationDays: number | null;
  actualDurationDays: number | null;
  completionDelay: number | null;       // 负数=提前
  outputShrinkage: number | null;       // 0-1

  // 综合
  dimensions: DimensionScores;
  overallScore: number;                 // 0-100
  radarData: number[][];               // [[dim, score], ...]
}

// ---- 常量 ----

// 城镇职工年均缴税额（约数，按 2024 年国家统计局数据）
// 人均可支配收入约 39,218 元 × 约 12% 个税+社保 ≈ 4,700 元/年
// 此处取近似值，使用时标注来源
const AVG_TAX_PER_YEAR = 4700;

// ---- 核心计算函数 ----

export function calculateIndicators(input: ProjectInput): IndicatorResult {
  const { amount, discipline, papers, startDate, plannedEndDate, actualEndDate, promisedPaperCount } = input;

  const paperCount = papers.length;

  // ==========================================================
  //  维度一：内部效率（学术界自己的货币）
  // ==========================================================

  const totalCitations = papers.reduce((s, p) => s + p.citationCount, 0);
  const selfCitations = papers.filter(p => p.selfCitation).length;
  const externalCitations = papers.reduce(
    (s, p) => s + (p.selfCitation ? 0 : p.citationCount),
    0
  );

  // 单次引用成本
  const citationCost = totalCitations === 0 ? null : (amount * 10000) / totalCitations;

  // 篇均他引次数
  const citationConcentration = paperCount === 0 ? 0 : externalCitations / paperCount;

  // 零引论文占比
  const zeroCitationPapers = papers.filter(p => p.citationCount === 0).length;
  const zeroCitationRatio = paperCount === 0 ? 0 : zeroCitationPapers / paperCount;

  // ==========================================================
  //  维度二：传播半径（谁在读？）
  // ==========================================================

  // 同二级学科引用占比
  let sameDisciplineRatio: number | null = null;
  let sameInstitutionRatio: number | null = null;
  let crossDisciplineCitations = 0;

  if (totalCitations > 0) {
    let sameDisciplineCount = 0;
    let sameInstitutionCount = 0;
    let crossDiscCount = 0;

    for (const paper of papers) {
      for (const d of paper.citingDisciplines || []) {
        if (d === discipline) {
          sameDisciplineCount++;
        } else {
          crossDiscCount++;
        }
      }
    }

    sameDisciplineRatio = sameDisciplineCount / Math.max(totalCitations, 1);
    sameInstitutionRatio = 0; // 需要机构数据，默认 0
    crossDisciplineCitations = crossDiscCount;
  }

  // ==========================================================
  //  维度三：公共牵引力（出圈了吗？）
  // ==========================================================

  const nonAcademicMentions = papers.reduce(
    (s, p) => s + (p.nonAcademicMentions || 0),
    0
  );

  // 免费可读比例
  const freeCount = papers.filter(p => p.isFreeToRead).length;
  const freeToReadRatio = paperCount === 0 ? 0 : freeCount / paperCount;

  // 公共影响力归一化（0-1）
  // 一篇非学术引用 = 0.1 分，满分 1.0
  const publicDiscussionScore = Math.min(1.0, nonAcademicMentions * 0.1);

  // ==========================================================
  //  维度四：承诺兑现度（你说的做到了吗？）
  // ==========================================================

  let plannedDurationDays: number | null = null;
  let actualDurationDays: number | null = null;
  let completionDelay: number | null = null;

  const sDate = new Date(startDate);
  const pDate = new Date(plannedEndDate);

  if (!isNaN(sDate.getTime()) && !isNaN(pDate.getTime())) {
    plannedDurationDays = Math.floor(
      (pDate.getTime() - sDate.getTime()) / (1000 * 60 * 60 * 24)
    );
  }

  if (actualEndDate) {
    const aDate = new Date(actualEndDate);
    if (!isNaN(aDate.getTime()) && plannedDurationDays !== null) {
      actualDurationDays = Math.floor(
        (aDate.getTime() - sDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      completionDelay = actualDurationDays - plannedDurationDays;
    }
  }

  // 成果缩水率
  let outputShrinkage: number | null = null;
  if (promisedPaperCount !== undefined && promisedPaperCount > 0) {
    outputShrinkage = Math.max(0, 1 - paperCount / promisedPaperCount);
  }

  // ==========================================================
  //  综合评分计算（0-100）
  // ==========================================================

  const dimensions = calculateDimensionScores({
    citationCost,
    zeroCitationRatio,
    sameDisciplineRatio,
    nonAcademicMentions,
    freeToReadRatio,
    publicDiscussionScore,
    completionDelay,
    outputShrinkage,
  });

  const overallScore = Math.round(
    (dimensions.internalEfficiency +
      dimensions.communicationRadius +
      dimensions.publicTraction +
      dimensions.commitmentFulfillment) /
      4
  );

  // 雷达图数据
  const radarData: number[][] = [
    ["内部效率", Math.round(dimensions.internalEfficiency)],
    ["传播半径", Math.round(dimensions.communicationRadius)],
    ["公共牵引力", Math.round(dimensions.publicTraction)],
    ["承诺兑现度", Math.round(dimensions.commitmentFulfillment)],
  ];

  return {
    totalCitations,
    selfCitations,
    externalCitations,
    citationCost,
    citationConcentration,
    zeroCitationRatio,
    sameDisciplineRatio,
    sameInstitutionRatio,
    crossDisciplineCitations,
    nonAcademicMentions,
    freeToReadRatio,
    publicDiscussionScore,
    plannedDurationDays,
    actualDurationDays,
    completionDelay,
    outputShrinkage,
    dimensions,
    overallScore,
    radarData,
  };
}

// ---- 各维度评分函数（0-100）----

interface DimensionInput {
  citationCost: number | null;
  zeroCitationRatio: number;
  sameDisciplineRatio: number | null;
  nonAcademicMentions: number;
  freeToReadRatio: number;
  publicDiscussionScore: number;
  completionDelay: number | null;
  outputShrinkage: number | null;
}

function calculateDimensionScores(input: DimensionInput): DimensionScores {
  // 维度一：内部效率（越高越好）
  let internalEfficiency = 0;

  // 零引率惩罚（权重 50%）
  internalEfficiency += (1 - input.zeroCitationRatio) * 50;

  // 引用成本（权重 50%）
  if (input.citationCost !== null && input.citationCost > 0) {
    // 引用成本越低越好。假设 1000 元/次 为及格线
    const costScore = Math.max(0, 1 - input.citationCost / 10000) * 50;
    internalEfficiency += costScore;
  }
  // 引用为 0 → 此维度 0 分

  // 维度二：传播半径（越低越封闭）
  let communicationRadius = 0;

  if (input.sameDisciplineRatio !== null) {
    // 同科引用率越低 = 传播越广
    communicationRadius += (1 - input.sameDisciplineRatio) * 70;
  }
  // 有总引用但无跨学科数据 → 给 30 分基准
  if (communicationRadius === 0 && input.sameDisciplineRatio === null) {
    communicationRadius = 30;
  }

  // 维度三：公共牵引力
  let publicTraction = 0;

  // 非学术引用（权重 40%）
  publicTraction += Math.min(input.nonAcademicMentions * 5, 40);

  // 免费可读（权重 30%）
  publicTraction += input.freeToReadRatio * 30;

  // 公共讨论（权重 30%）
  publicTraction += input.publicDiscussionScore * 30;

  // 维度四：承诺兑现度
  let commitmentFulfillment = 100; // 满分开始，逐项扣

  // 延期惩罚
  if (input.completionDelay !== null) {
    if (input.completionDelay > 0) {
      // 每延期 30 天扣 5 分，最多扣 50
      commitmentFulfillment -= Math.min(50, (input.completionDelay / 30) * 5);
    }
  }

  // 缩水惩罚
  if (input.outputShrinkage !== null) {
    commitmentFulfillment -= input.outputShrinkage * 50;
  }

  // 如果无结项数据，给 50 分基准
  if (input.completionDelay === null && input.outputShrinkage === null) {
    commitmentFulfillment = 50;
  }

  return {
    internalEfficiency: Math.max(0, Math.min(100, Math.round(internalEfficiency))),
    communicationRadius: Math.max(0, Math.min(100, Math.round(communicationRadius))),
    publicTraction: Math.max(0, Math.min(100, Math.round(publicTraction))),
    commitmentFulfillment: Math.max(0, Math.min(100, Math.round(commitmentFulfillment))),
  };
}

// ---- 辅助函数 ----

/**
 * 计算纳税人等值
 * @param amountWan 金额（万元）
 * @returns 相当于多少纳税人年缴税额
 */
export function calcTaxpayerEquivalent(amountWan: number): number {
  return Math.round((amountWan * 10000) / AVG_TAX_PER_YEAR * 10) / 10;
}

/**
 * 计算日均消耗（元/天）
 * @param amountWan 金额（万元）
 * @param startDate 开始日期
 * @param endDate 结束日期（默认今天）
 */
export function calcDailyBurnRate(
  amountWan: number,
  startDate: string,
  endDate?: string
): number {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();
  const days = Math.max(1, Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
  return Math.round((amountWan * 10000) / days);
}

/**
 * 格式化引用成本
 */
export function formatCitationCost(cost: number | null): string {
  if (cost === null) return "∞ —— 学术界自己也没看过";
  if (cost === 0) return "¥0";
  return `¥${Math.round(cost).toLocaleString("zh-CN")}/次`;
}

/**
 * 指标解读 — 为每个维度生成一句话解读
 */
export function interpretDimension(
  dim: keyof DimensionScores,
  score: number
): string {
  const interpretations: Record<keyof DimensionScores, Record<string, string>> = {
    internalEfficiency: {
      high: "该项目产出的论文在学术界内部被有效引用，经费产生了基本的学术交流价值。",
      mid: "部分论文有人看，但相当比例产出在学术界内部也未产生任何影响。",
      low: "该项目产出的论文在学术界内部几乎未被引用——按学术界自己的标准，这项研究无人问津。",
    },
    communicationRadius: {
      high: "研究成果被多个学科的学者引用，产生了跨学科影响。",
      mid: "引用主要集中在同一学科内部，成果未穿透到邻近领域。",
      low: "所有引用来自同一学科甚至同一机构——这是一场封闭的自我对话。",
    },
    publicTraction: {
      high: "研究成果产生了可观的公共影响，被非学术渠道引用或讨论。",
      mid: "有少量圈外关注，但主要影响力仍限于学术围墙之内。",
      low: "公共资金资助的研究成果，在公共领域未留下任何痕迹。纳税人不知道自己付钱做了什么。",
    },
    commitmentFulfillment: {
      high: "项目按计划完成，产出与承诺基本一致。",
      mid: "存在延期或产出缩水，但尚在可接受范围。",
      low: "严重延期、产出大幅缩水——申请书里的承诺与最终交付之间存在显著差距。",
    },
  };

  const tier = score >= 70 ? "high" : score >= 40 ? "mid" : "low";
  return interpretations[dim][tier];
}
