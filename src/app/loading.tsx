/**
 * 根级 loading：导航时显示
 */
export default function Loading() {
  return (
    <div className="min-h-screen pt-16 flex items-center justify-center bg-brand-dark">
      <p className="text-brand-muted">加载中...</p>
    </div>
  );
}
