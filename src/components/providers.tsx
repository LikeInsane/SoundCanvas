"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { useEffect } from "react";
import { syncProgressWithServer } from "@/lib/progress";

/** 登录后自动同步习题进度（拉取后端并与本地合并） */
function ProgressSync() {
  const { status } = useSession();
  useEffect(() => {
    if (status === "authenticated") {
      void syncProgressWithServer();
    }
  }, [status]);
  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ProgressSync />
      {children}
    </SessionProvider>
  );
}
