"use client";

/**
 * 全局错误边界：捕获根 layout 及以下的错误，必须自包含 html/body
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="zh-CN">
      <body style={{ margin: 0, padding: "2rem", fontFamily: "sans-serif", background: "#0A0A0F", color: "#F5F5F7" }}>
        <div style={{ maxWidth: "400px", margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>出错了</h2>
          <p style={{ color: "#8E8EA0", fontSize: "0.875rem", marginBottom: "1rem" }}>
            应用发生严重错误，请刷新页面重试
          </p>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              padding: "0.75rem 1.5rem",
              borderRadius: "9999px",
              background: "#0071E3",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              fontSize: "0.875rem",
              fontWeight: 500,
            }}
          >
            重试
          </button>
        </div>
      </body>
    </html>
  );
}
