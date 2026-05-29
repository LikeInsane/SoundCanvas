import Link from "next/link";
import { TOOLS } from "./tools-list";

/**
 * 工具中心：按分组展示所有乐理工具卡片。
 */
export default function ToolsHubPage() {
  const groups = ["演奏与练习", "查找与参考"] as const;

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-2xl font-semibold text-brand-heading">音乐工具</h1>
        <p className="mt-1 text-sm text-brand-muted">
          一组用于练习与查阅的乐理小工具，随用随开。
        </p>
      </div>

      {groups.map((group) => (
        <section key={group} className="mb-10">
          <h2 className="text-sm font-semibold text-brand-muted mb-4">{group}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TOOLS.filter((t) => t.group === group).map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="glass-card p-5 group cursor-pointer transition-all duration-300 hover:border-brand-accent/30 hover:-translate-y-1"
              >
                <h3 className="text-base font-semibold text-brand-heading group-hover:text-brand-text transition-colors">
                  {tool.title}
                </h3>
                <p className="mt-2 text-xs text-brand-muted leading-relaxed">{tool.desc}</p>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
