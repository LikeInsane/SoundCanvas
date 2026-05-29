import Link from "next/link";

/**
 * 学习页共用布局：标题与子导航（概览、乐理、节奏、和弦、旋律、风格）
 */
export default function LearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navItems = [
    { href: "/learn", label: "概览" },
    { href: "/learn/theory", label: "乐理" },
    { href: "/learn/rhythm", label: "节奏" },
    { href: "/learn/chords", label: "和弦" },
    { href: "/learn/melody", label: "旋律" },
    { href: "/learn/styles", label: "风格" },
  ];

  return (
    <main className="min-h-screen pt-16">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-brand-heading">音乐学习</h1>
          <p className="mt-1 text-sm text-brand-muted">
            从乐理基础到编曲实战，系统地理解音乐
          </p>
        </div>

        <nav className="flex flex-wrap gap-4 mb-10 border-b border-brand-border pb-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-brand-muted hover:text-brand-text transition-colors cursor-pointer"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {children}
      </div>
    </main>
  );
}
