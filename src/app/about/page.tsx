export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-10">
      {/* 页面标题 */}
      <div className="brutal-border brutal-shadow-lg bg-warning p-6">
        <h1 className="font-heading font-black text-3xl leading-tight">关于大地观察哨</h1>
        <p className="mt-3 text-sm font-medium leading-relaxed">
          大地观察哨是一个独立的公共资金使用效益观察项目，
          聚焦于哲学及人文社科领域的政府资助研究。
        </p>
        <p className="mt-2 text-sm font-bold">翻译成人话：我们盯着国家社科基金的钱花哪儿了。</p>
      </div>

      {/* 使命 */}
      <section className="brutal-border p-6 bg-white">
        <h2 className="font-heading font-black text-xl mb-4">使命</h2>
        <div className="space-y-3 text-sm leading-relaxed">
          <p>
            公共资金资助的学术研究应当服务于公共利益——这在任何国家都是常识。
            我们通过系统性地追踪和展示公开的基金项目数据，
            为公众提供关于科研经费使用效益的可验证信息。
          </p>
          <p className="font-bold">不写檄文，不喊口号。把数据摊开，让事实自己说话。</p>
        </div>
      </section>

      {/* 方法 */}
      <section className="brutal-border p-6 bg-white">
        <h2 className="font-heading font-black text-xl mb-4">方法</h2>
        <div className="space-y-3 text-sm leading-relaxed">
          <p>我们仅使用政府公开数据，包括但不限于：</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>国家社科基金项目数据库</li>
            <li>教育部人文社会科学项目公示</li>
            <li>各省市哲学社会科学规划项目公开信息</li>
            <li>知网、万方等公开学术数据库的题录信息</li>
          </ul>
          <p className="mt-4">对每笔项目经费，我们进行三项客观指标的计算：</p>

          {/* 三项指标 */}
          <div className="grid gap-3 mt-3">
            <div className="brutal-border bg-warning p-3">
              <span className="font-black">纳税人等值</span>
              <span className="mx-2 text-concrete">=</span>
              项目经费 ÷ 城镇职工年均缴税额 = <span className="font-black">相当于几个你</span>
            </div>
            <div className="brutal-border bg-warning p-3">
              <span className="font-black">学术引用成本</span>
              <span className="mx-2 text-concrete">=</span>
              项目经费 ÷ 论文总被引次数。<span className="font-black">引用为 0？那就是无穷大——学术界自己也没看过</span>
            </div>
            <div className="brutal-border bg-warning p-3">
              <span className="font-black">日均消耗</span>
              <span className="mx-2 text-concrete">=</span>
              项目经费 ÷ 研究周期 = <span className="font-black">课题组每天躺着也在消耗的公共资金</span>
            </div>
          </div>

          <p className="mt-4 font-bold">
            我们不评价学者的学术能力。我们只做数学。数学不需要立场。
          </p>
        </div>
      </section>

      {/* 边界 */}
      <section className="brutal-border brutal-shadow p-6 bg-black text-white">
        <h2 className="font-heading font-black text-xl mb-4 text-warning">边界</h2>
        <div className="space-y-2 text-sm leading-relaxed">
          <p className="font-bold">我们不做这些事：</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>不评价学者个人——我们甚至不需要知道他们是谁</li>
            <li>不讨论"学术有什么用"——那是哲学问题，不是数据问题</li>
            <li>不替学者辩护，不帮公众吵架</li>
            <li>不提供"有用/无用"的终极判断</li>
          </ul>
          <p className="mt-3 text-concrete">
            我们只是一个数据展示工具。把原本散落在各个政府公示页面的信息，
            整理成任何纳税人都能在 30 秒内看懂的账目。
          </p>
        </div>
      </section>

      {/* 透明 */}
      <section className="brutal-border p-6 bg-white">
        <h2 className="font-heading font-black text-xl mb-4">透明</h2>
        <div className="space-y-2 text-sm leading-relaxed">
          <p>本项目代码在 GitHub 以 MIT 协议开源。</p>
          <p>数据库定期导出为 CSV/JSON 格式，可供任何人下载、验证、镜像。</p>
          <p>AI 生成内容均标注"机器生成"。每一条数据都有来源链接。</p>
          <p className="font-bold mt-3">不服可以自己查。</p>
        </div>
      </section>

      {/* 名称 */}
      <section className="brutal-border p-6 bg-white">
        <h2 className="font-heading font-black text-xl mb-4">名称</h2>
        <div className="space-y-2 text-sm leading-relaxed">
          <p>"大地观察哨"——受"把论文写在祖国的大地上"启发。</p>
          <p>我们站在这里，看着公共资金的流向。</p>
          <p className="font-bold">不辩论。只展示。让断裂自己说话。</p>
        </div>
      </section>
    </div>
  );
}
