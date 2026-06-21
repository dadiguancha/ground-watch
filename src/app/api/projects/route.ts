/**
 * 大地观察哨 — 项目列表 API
 * GET /api/projects
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // 生产环境无数据库时返回静态数据
    if (process.env.NODE_ENV !== "development") {
      return NextResponse.json({
        data: [],
        pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
        message: "生产环境暂不支持数据库查询，请访问首页查看静态数据",
      });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const sort = searchParams.get("sort") || "amount_desc"; // amount_desc | score_asc | newest
    const discipline = searchParams.get("discipline") || undefined;
    const year = searchParams.get("year") || undefined;

    // 构建查询
    const where: any = {};
    if (discipline) {
      where.discipline = { contains: discipline };
    }
    if (year) {
      where.startDate = {
        gte: new Date(`${year}-01-01`),
        lte: new Date(`${year}-12-31`),
      };
    }

    // 排序
    let orderBy: any = { amount: "desc" };
    switch (sort) {
      case "score_asc":
        orderBy = { overallScore: "asc" };
        break;
      case "newest":
        orderBy = { startDate: "desc" };
        break;
      case "amount_desc":
      default:
        orderBy = { amount: "desc" };
    }

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          papers: true,
        },
      }),
      prisma.project.count({ where }),
    ]);

    // 序列化
    const data = projects.map((p) => ({
      ...p,
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
    }));

    return NextResponse.json({
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "数据查询失败" },
      { status: 500 }
    );
  }
}
