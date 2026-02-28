import { redirect } from "next/navigation";

/**
 * /learn 根路径默认跳转到节奏入门页
 */
export default function LearnPage() {
  redirect("/learn/rhythm");
}
