"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { ToolHeader } from "@/components/tools/ToolHeader";
import { GLOSSARY } from "@/lib/glossary-data";

/**
 * 音乐术语词典：支持关键字搜索与分类筛选。
 */
const CATEGORIES = ["全部", "基础", "节奏", "和声", "曲式", "演奏", "音色"] as const;

export default function GlossaryPage() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>("全部");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return GLOSSARY.filter((t) => {
      const matchCat = cat === "全部" || t.category === cat;
      const matchQuery =
        !q ||
        t.term.toLowerCase().includes(q) ||
        (t.alias?.toLowerCase().includes(q) ?? false) ||
        t.definition.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  }, [query, cat]);

  return (
    <div>
      <ToolHeader title="音乐术语" desc="常用乐理术语的中文释义，支持搜索与分类。" />

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜索术语、英文或释义"
          className="input-field pl-9"
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              cat === c
                ? "bg-brand-cta text-white"
                : "bg-brand-card border border-brand-border text-brand-muted hover:text-brand-text"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {filtered.map((t) => (
          <div key={t.term} className="glass-card p-4">
            <div className="flex items-baseline justify-between">
              <h3 className="text-sm font-semibold text-brand-heading">{t.term}</h3>
              {t.alias && <span className="text-xs text-brand-muted">{t.alias}</span>}
            </div>
            <p className="mt-2 text-xs text-brand-text leading-relaxed">{t.definition}</p>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-brand-muted col-span-full text-center py-10">未找到匹配的术语。</p>
        )}
      </div>
    </div>
  );
}
