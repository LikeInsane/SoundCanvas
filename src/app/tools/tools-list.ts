/**
 * 工具集目录：用于工具中心页渲染卡片与子页面回链。
 */

export interface ToolItem {
  slug: string;
  title: string;
  desc: string;
  group: "演奏与练习" | "查找与参考";
}

export const TOOLS: ToolItem[] = [
  { slug: "metronome", title: "节拍器", desc: "可调速度与拍号的节拍器，建立稳定的节奏感。", group: "演奏与练习" },
  { slug: "tuner", title: "调音器", desc: "通过麦克风检测音高，校准你的乐器。", group: "演奏与练习" },
  { slug: "chord-player", title: "和弦播放器", desc: "选择根音与和弦类型，即时聆听并查看五线谱。", group: "演奏与练习" },
  { slug: "circle-of-fifths", title: "五度圈", desc: "交互式五度圈，理解调号与调之间的关系。", group: "查找与参考" },
  { slug: "interval-finder", title: "音程查找", desc: "查看任意音程的半音数、名称与音响。", group: "查找与参考" },
  { slug: "chord-finder", title: "和弦查找", desc: "查询各类和弦的构成音、五线谱与发声。", group: "查找与参考" },
  { slug: "scale-finder", title: "音阶查找", desc: "查询大小调、五声、调式等音阶构成。", group: "查找与参考" },
  { slug: "interval-songs", title: "音程歌曲表", desc: "借助熟悉旋律记忆各音程的音响。", group: "查找与参考" },
  { slug: "note-names", title: "音名对照器", desc: "音名、唱名、键盘位置与频率对照表。", group: "查找与参考" },
  { slug: "glossary", title: "音乐术语", desc: "常用乐理术语的中文释义词典。", group: "查找与参考" },
  { slug: "blank-staff", title: "空白五线谱", desc: "生成可打印的空白五线谱纸。", group: "查找与参考" },
];

export function toolBySlug(slug: string): ToolItem | undefined {
  return TOOLS.find((t) => t.slug === slug);
}
