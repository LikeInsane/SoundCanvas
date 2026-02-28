"use client";

import { useEffect } from "react";

/**
 * 根级错误边界：捕获运行时错误并显示备用 UI
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center bg-brand-dark">
      <div className="text-center px-6">
        <h2 className="text-brand-heading text-lg font-semibold mb-2">出错了</h2>
        <p className="text-brand-muted text-sm mb-4">页面渲染时发生错误，请重试</p>
        <button
          type="button"
          onClick={() => reset()}
          className="btn-primary"
        >
          重试
        </button>
      </div>
    </div>
  );
}
