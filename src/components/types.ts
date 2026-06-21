/** 项目卡片 Props — 对应未来 Prisma schema */
export interface ProjectPaper {
  title: string;
  journal: string;
  year: number;
  citationCount: number;
  downloadCount: number;
  cnkiUrl: string;
  dewateredSummary: string; // AI 脱水版一句话摘要
}

export interface Project {
  id: string;
  projectNumber: string;
  title: string;
  category: string; // "重点项目" | "一般项目" | "青年项目"
  discipline: string;
  amount: number; // 万元
  principalInvestigator: string;
  institution: string;
  startDate: string; // ISO date
  plannedEndDate: string;
  papers: ProjectPaper[];

  // 预计算效率指标
  taxpayerEquivalent: number; // 纳税人等值
  citationCost: number | null; // 单次引用成本（null 表示引用为 0 → ∞）
  dailyBurnRate: number; // 日均消耗（元/天）
}
