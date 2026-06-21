"""
大地观察哨 — 国家社科基金项目数据采集器

目标来源：国家社科基金项目数据库
URL: https://fz.people.com.cn/skygb/sk/index.php/Index/seach

采集范围：哲学学科，近 5 年（2021-2025）
输出：结构化 JSON → 后续导入数据库

使用：
    python3 scraper.py                    # 全量采集
    python3 scraper.py --year 2024        # 仅采集指定年份
    python3 scraper.py --test             # 测试模式（仅 3 页）
"""

import asyncio
import json
import re
import sys
from datetime import datetime
from pathlib import Path
from typing import Optional
from urllib.parse import urljoin

import httpx
from bs4 import BeautifulSoup

# ---- 配置 ----

BASE_URL = "https://fz.people.com.cn/skygb/sk/index.php"
SEARCH_URL = urljoin(BASE_URL, "Index/seach")
DETAIL_URL = urljoin(BASE_URL, "Index/detail")

# 哲学学科代码（国家社科基金学科分类）
# 需根据实际数据库确认，以下是常见编码
DISCIPLINE_CODES = {
    "哲学": "ZX",
    "马克思主义哲学": "ZX001",
    "中国哲学": "ZX002",
    "外国哲学": "ZX003",
    "逻辑学": "ZX004",
    "伦理学": "ZX005",
    "美学": "ZX006",
    "宗教学": "ZX007",
    "科学技术哲学": "ZX008",
}

OUTPUT_DIR = Path(__file__).parent / "output"
OUTPUT_DIR.mkdir(exist_ok=True)

# 请求间隔（秒），避免被封
REQUEST_DELAY = 1.5


# ---- 数据模型 ----

class ProjectScraper:
    """国家社科基金项目数据采集器"""

    def __init__(self, test_mode: bool = False):
        self.test_mode = test_mode
        self.client = httpx.Client(
            headers={
                "User-Agent": (
                    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                    "AppleWebKit/537.36 (KHTML, like Gecko) "
                    "Chrome/131.0.0.0 Safari/537.36"
                ),
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
                "Accept-Encoding": "gzip, deflate",
            },
            timeout=30.0,
            follow_redirects=True,
        )
        self.results: list[dict] = []

    def _parse_amount(self, text: str) -> Optional[float]:
        """从文本中提取金额（万元）"""
        if not text:
            return None
        # 匹配 "20万元" "20万" "20" 等
        match = re.search(r"(\d+\.?\d*)\s*万", text)
        if match:
            return float(match.group(1))
        # 尝试直接匹配数字
        match = re.search(r"(\d+\.?\d*)", text)
        if match:
            val = float(match.group(1))
            return val if val < 1000 else None  # 金额不太可能超过 1000 万
        return None

    def _parse_date(self, text: str) -> Optional[str]:
        """解析日期为 YYYY-MM-DD 格式"""
        if not text:
            return None
        # 2020-09 格式
        match = re.match(r"(\d{4})-(\d{2})", text)
        if match:
            return f"{match.group(1)}-{match.group(2)}-01"
        # 2020年9月
        match = re.match(r"(\d{4})年(\d{1,2})月", text)
        if match:
            return f"{match.group(1)}-{int(match.group(2)):02d}-01"
        # 纯年份
        match = re.match(r"(\d{4})", text)
        if match:
            return f"{match.group(1)}-01-01"
        return text

    def search_page(self, page: int = 1, year: Optional[int] = None) -> BeautifulSoup:
        """
        搜索项目列表页

        参数：
            page: 页码
            year: 立项年度筛选
        返回：BeautifulSoup 对象
        """
        params: dict[str, str | int] = {
            "pageno": page,
        }
        # 哲学学科筛选 — key 名称需根据实际页面调整
        # 常见参数名：xueke, xk, discipline, subject
        # 先在 params 中尝试添加学科筛选
        # params["xueke"] = "哲学"

        if year:
            params["year"] = str(year)

        try:
            resp = self.client.get(SEARCH_URL, params=params)
            resp.encoding = "utf-8"
            return BeautifulSoup(resp.text, "lxml")
        except Exception as e:
            print(f"  ⚠ 搜索请求失败 (page={page}): {e}")
            return BeautifulSoup("", "lxml")

    def parse_list_page(self, soup: BeautifulSoup) -> list[dict]:
        """
        解析搜索结果列表页，提取项目概要信息

        适配多种可能的 HTML 结构：
        - <table> 行
        - <div class="project-item">
        - <li> 列表
        """
        items = []

        # ---- 尝试 1: 表格结构 ----
        tables = soup.find_all("table")
        for table in tables:
            rows = table.find_all("tr")[1:]  # 跳过表头
            for row in rows:
                cols = row.find_all("td")
                if len(cols) < 4:
                    continue
                item = self._parse_table_row(cols)
                if item:
                    items.append(item)
            if items:
                return items

        # ---- 尝试 2: div 列表结构 ----
        for cls in ["project-item", "proj-item", "result-item", "list-item"]:
            divs = soup.find_all("div", class_=re.compile(cls))
            for div in divs:
                item = self._parse_div_item(div)
                if item:
                    items.append(item)
            if items:
                return items

        # ---- 尝试 3: 通用 a 标签提取 ----
        links = soup.find_all("a", href=re.compile(r"(detail|view|show|index\.php)"))
        for link in links:
            text = link.get_text(strip=True)
            href = link.get("href", "")
            if text and len(text) > 10:  # 应该是项目标题
                items.append({
                    "title": text,
                    "detail_url": urljoin(BASE_URL, href),
                    "raw_html": str(link.parent.parent)[:200] if link.parent else "",
                })

        return items

    def _parse_table_row(self, cols) -> Optional[dict]:
        """解析表格行"""
        try:
            texts = [col.get_text(strip=True) for col in cols]
            # 常见列顺序：序号 | 批准号 | 项目名称 | 负责人 | 单位 | 学科 | 金额 | 年份
            # 这是猜测，需要根据实际 HTML 调整
            return {
                "title": texts[2] if len(texts) > 2 else "",
                "project_number": texts[1] if len(texts) > 1 else "",
                "principal_investigator": texts[3] if len(texts) > 3 else "",
                "institution": texts[4] if len(texts) > 4 else "",
                "discipline": texts[5] if len(texts) > 5 else "",
                "amount_text": texts[6] if len(texts) > 6 else "",
                "year_text": texts[7] if len(texts) > 7 else "",
                "raw_texts": texts,
            }
        except Exception:
            return None

    def _parse_div_item(self, div) -> Optional[dict]:
        """解析 div 型项目条目"""
        title_el = div.find(["h3", "h4", "a", "strong"])
        if not title_el:
            return None
        return {
            "title": title_el.get_text(strip=True),
            "detail_url": (
                urljoin(BASE_URL, title_el.get("href", ""))
                if title_el.name == "a"
                else None
            ),
            "raw_html": str(div)[:300],
        }

    def fetch_detail(self, url: str) -> Optional[dict]:
        """
        抓取项目详情页

        提取：
        - 项目完整信息
        - 结项成果（论文标题列表）
        - 成果摘要
        """
        try:
            resp = self.client.get(url)
            resp.encoding = "utf-8"
            soup = BeautifulSoup(resp.text, "lxml")

            detail: dict = {"detail_url": url, "papers": []}

            # ---- 通用提取：所有文本字段 ----
            # 查找包含关键信息的行或 div
            all_text = soup.get_text(separator="\n", strip=True)
            lines = [l.strip() for l in all_text.split("\n") if l.strip()]

            # 尝试从文本行中匹配常见字段
            for line in lines:
                if "项目名称" in line or "课题名称" in line:
                    detail["title"] = line.split("：")[-1].split(":")[-1].strip()
                elif "批准号" in line or "项目编号" in line:
                    detail["project_number"] = line.split("：")[-1].split(":")[-1].strip()
                elif "负责人" in line:
                    detail["principal_investigator"] = line.split("：")[-1].split(":")[-1].strip()
                elif "承担单位" in line or "所在单位" in line:
                    detail["institution"] = line.split("：")[-1].split(":")[-1].strip()
                elif "资助金额" in line or "经费" in line or "批准经费" in line:
                    detail["amount_text"] = line
                    detail["amount"] = self._parse_amount(line)
                elif "立项时间" in line or "立项日期" in line:
                    detail["start_date"] = self._parse_date(
                        line.split("：")[-1].split(":")[-1].strip()
                    )
                elif "计划完成" in line or "完成时间" in line:
                    detail["planned_end_date"] = self._parse_date(
                        line.split("：")[-1].split(":")[-1].strip()
                    )
                elif "学科分类" in line or "学科" in line:
                    detail["discipline"] = line.split("：")[-1].split(":")[-1].strip()
                elif "项目类别" in line:
                    detail["category"] = line.split("：")[-1].split(":")[-1].strip()

            # ---- 论文/成果提取 ----
            # 寻找"成果""论文""发表"相关区块
            paper_section = soup.find(
                string=re.compile(r"(阶段性成果|结项成果|发表论文|成果名称|最终成果)")
            )
            if paper_section:
                parent = paper_section.find_parent(["div", "table", "ul", "tr"])
                if parent:
                    # 提取该区块内所有看起来像论文标题的文本
                    paper_texts = parent.find_all(
                        ["a", "li", "td", "p", "span"]
                    )
                    for pt in paper_texts:
                        text = pt.get_text(strip=True)
                        # 论文标题通常较长且包含学术词汇
                        if len(text) > 15 and not any(
                            kw in text
                            for kw in ["成果", "论文", "发表", "项目", "编号"]
                        ):
                            detail["papers"].append({"title": text})

            # 如果上面没找到论文，尝试从全文文本中匹配
            if not detail.get("papers"):
                # 查找 "1." "2." 等编号后的文本，可能是论文列表
                paper_pattern = re.findall(
                    r"(?:^|\n)\s*(?:\d+[\.\、\)）])\s*(.{15,}?)(?:\n|$)",
                    all_text,
                )
                for p in paper_pattern:
                    if not any(
                        kw in p
                        for kw in ["项目", "成果", "负责人", "单位", "批准"]
                    ):
                        detail["papers"].append({"title": p.strip()})

            # 提取完整原始文本作为备用
            detail["_raw_text_sample"] = all_text[:2000]

            return detail

        except Exception as e:
            print(f"  ⚠ 详情页抓取失败 ({url}): {e}")
            return None

    async def run(self, years: Optional[list[int]] = None) -> list[dict]:
        """
        主采集流程

        参数：
            years: 要采集的年份列表，None = 全部年份
        """
        if years is None:
            years = list(range(2021, 2026))

        print("=" * 60)
        print("  大地观察哨 — 国家社科基金项目数据采集器")
        print(f"  目标学科：哲学")
        print(f"  采集年份：{years}")
        print(f"  模式：{'测试（每类3页）' if self.test_mode else '全量'}")
        print("=" * 60)

        for year in years:
            print(f"\n📅 采集 {year} 年项目...")
            page = 1
            year_items: list[dict] = []

            while True:
                print(f"  页 {page}...", end=" ", flush=True)

                soup = self.search_page(page=page, year=year)
                list_items = self.parse_list_page(soup)

                if not list_items:
                    print("无数据，翻页结束")
                    break

                print(f"发现 {len(list_items)} 条")

                for item in list_items:
                    # 获取详情
                    detail_url = item.get("detail_url")
                    if detail_url:
                        await asyncio.sleep(REQUEST_DELAY)
                        detail = self.fetch_detail(detail_url)
                        if detail:
                            # 合并列表页和详情页数据
                            merged = {**item, **detail}
                            year_items.append(merged)
                        else:
                            year_items.append(item)
                    else:
                        year_items.append(item)

                # 检查是否还有下一页
                next_link = soup.find("a", string=re.compile(r"(下一页|下页|>|›|»)"))
                if not next_link:
                    # 也检查数字分页
                    pagination = soup.find(
                        "div", class_=re.compile(r"(page|pagin|fenye)")
                    )
                if not next_link and not (
                    pagination
                    and soup.find(
                        "a",
                        string=str(page + 1),
                    )
                ):
                    break

                page += 1
                if self.test_mode and page > 3:
                    print("  ⏹ 测试模式：已达 3 页限制")
                    break

                await asyncio.sleep(REQUEST_DELAY)

            # 保存当年数据
            self._save_year_results(year, year_items)
            self.results.extend(year_items)
            print(f"  ✅ {year} 年采集完成: {len(year_items)} 条")

        # 保存全量
        self._save_all_results()
        self._print_summary()
        return self.results

    def _save_year_results(self, year: int, items: list[dict]):
        """保存单年结果"""
        path = OUTPUT_DIR / f"projects_{year}.json"
        with open(path, "w", encoding="utf-8") as f:
            json.dump(items, f, ensure_ascii=False, indent=2)
        print(f"  💾 已保存: {path}")

    def _save_all_results(self):
        """保存全量结果"""
        path = OUTPUT_DIR / "projects_all.json"
        with open(path, "w", encoding="utf-8") as f:
            json.dump(self.results, f, ensure_ascii=False, indent=2)
        print(f"\n💾 全量数据已保存: {path}")

    def _print_summary(self):
        """打印统计摘要"""
        total = len(self.results)
        with_amount = sum(1 for r in self.results if r.get("amount"))
        with_papers = sum(1 for r in self.results if r.get("papers"))
        total_amount = sum(
            r.get("amount", 0) or 0 for r in self.results
        )

        print("\n" + "=" * 60)
        print("  📊 采集摘要")
        print(f"  总项目数：{total}")
        print(f"  有金额数据：{with_amount}")
        print(f"  有论文数据：{with_papers}")
        print(f"  总资助金额：{total_amount:.1f} 万元")
        print("=" * 60)

    def close(self):
        self.client.close()


# ---- CLI ----

async def main():
    test_mode = "--test" in sys.argv

    # 解析年份参数
    years = None
    for arg in sys.argv:
        if arg.startswith("--year="):
            years = [int(arg.split("=")[1])]

    scraper = ProjectScraper(test_mode=test_mode)
    try:
        await scraper.run(years=years)
    finally:
        scraper.close()


if __name__ == "__main__":
    asyncio.run(main())
