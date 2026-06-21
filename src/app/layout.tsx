import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "大地观察哨 · 公共资金资助效果民间观察",
  description:
    "用公开数据展示公共资金资助的哲学/文科研究产出与公众生活的断裂。不辩论，只展示。",
  keywords: ["公共资金", "科研经费", "基金项目", "破五唯", "学术形式主义"],
  openGraph: {
    title: "大地观察哨",
    description: "公共资金资助效果民间观察",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full">
      <body className="min-h-full flex flex-col bg-paper text-black">
        {/* 顶栏 — 话语盾牌 */}
        <header className="brutal-border border-t-0 border-x-0 bg-warning px-4 py-3">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <a href="/" className="flex items-center gap-3 hover:opacity-70 transition-opacity">
                <span className="text-2xl">🔭</span>
                <span className="font-heading font-black text-lg tracking-wide">
                  大地观察哨
                </span>
              </a>
              <a
                href="/about"
                className="brutal-border ml-3 px-3 py-0.5 text-xs font-bold hover:bg-black hover:text-warning transition-colors"
              >
                关于
              </a>
            </div>
            <p className="text-xs font-medium max-w-md leading-relaxed">
              破五唯 · 反学术形式主义 · 把论文写在祖国的大地上
              <span className="block opacity-60 mt-0.5">
                公共资金资助效果民间观察项目
              </span>
            </p>
          </div>
        </header>

        {/* 主内容 */}
        <main className="flex-1">{children}</main>

        {/* 底栏 */}
        <footer className="brutal-border border-b-0 border-x-0 bg-black text-concrete px-4 py-6 mt-16">
          <div className="max-w-5xl mx-auto text-xs leading-relaxed space-y-1">
            <p>
              数据来源：国家社科基金项目数据库、教育部人文社科项目公示、各高校科研处公开信息。
              所有数据均有公开来源链接。
            </p>
            <p>
              AI 生成内容均标注"机器生成"。本项目代码开源（MIT），数据定期导出。
            </p>
            <p className="text-warning font-medium mt-3">
              我们不生产观点，我们只展示断裂。
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
