import BackToStyles from "./BackToStyles";

/**
 * 风格路线子布局：子分支页顶部显示返回入口
 */
export default function StylesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <BackToStyles />
      {children}
    </div>
  );
}
