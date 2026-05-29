/**
 * 工具集共用布局：留出固定导航栏高度，统一容器宽度。
 */
export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen pt-16">
      <div className="max-w-5xl mx-auto px-6 py-10">{children}</div>
    </main>
  );
}
