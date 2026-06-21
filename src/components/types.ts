/** 大地观察哨 v2 — 前端类型定义 */

export interface PaperData {
  id: string;
  title: string;
  journal: string | null;
  year: number | null;
  citationCount: number;
  downloadCount: number;
  cnkiUrl: string | null;
  selfCitation: boolean;
  citingDisciplines: string[];
  citingInstitutions: string[];
  nonAcademicMentions: number;
  isFreeToRead: boolean;
  dewateredSummary: string | null;
  publicRelevanceScore: number | null;
}

export interface ProjectData {
  id: string;
  projectNumber: string;
  title: string;
  category: string;
  discipline: string;
  amount: number;
  principalInvestigator: string;
  institution: string;
  startDate: string;
  plannedEndDate: string;
  actualEndDate: string | null;

  // 维度一：内部效率
  totalCitations: number;
  selfCitations: number;
  externalCitations: number;
  citationCost: number | null;
  citationConcentration: number | null;
  zeroCitationRatio: number | null;

  // 维度二：传播半径
  sameDisciplineCitationRatio: number | null;
  sameInstitutionCitationRatio: number | null;
  crossDisciplineCitations: number;

  // 维度三：公共牵引力
  nonAcademicMentions: number;
  isFreeToRead: boolean;
  publicDiscussionCount: number;

  // 维度四：承诺兑现度
  plannedDurationDays: number | null;
  actualDurationDays: number | null;
  completionDelay: number | null;
  promisedPaperCount: number | null;
  actualPaperCount: number;
  outputShrinkage: number | null;

  // 综合
  overallScore: number | null;
  radarData: [string, number][] | null;

  // 关联
  papers: PaperData[];
}
