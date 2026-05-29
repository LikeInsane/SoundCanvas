/**
 * 系统化乐理课程数据（配置驱动，原创编写）。
 * 课程由若干区块组成，区块在 LessonView 中按类型渲染（文字、五线谱、试听、提示、链接）。
 * 音高统一用音名字符串（如 "C4"），渲染时转换为 MIDI。
 */

export type LessonBlock =
  | { type: "text"; title?: string; body: string }
  | {
      type: "staff";
      caption?: string;
      /** 一维：逐个单音；二维：每组同时发声（和弦/音程） */
      notes: string[] | string[][];
      clef?: "treble" | "bass";
      keySignature?: string;
    }
  | { type: "play"; label: string; notes: string[]; mode: "chord" | "sequence" }
  | { type: "tip"; body: string }
  | { type: "link"; href: string; label: string };

export interface Lesson {
  id: string;
  title: string;
  summary: string;
  blocks: LessonBlock[];
}

export interface Topic {
  id: string;
  title: string;
  desc: string;
  lessons: Lesson[];
}

export const THEORY_TOPICS: Topic[] = [
  {
    id: "notes",
    title: "音与键盘",
    desc: "认识音名、八度、半音与变音记号，建立音高的基本坐标。",
    lessons: [
      {
        id: "note-names",
        title: "音名与键盘",
        summary: "七个基本音名如何对应钢琴上的白键。",
        blocks: [
          {
            type: "text",
            body: "音乐使用七个基本音名：C、D、E、F、G、A、B，循环往复。在钢琴上，它们对应一组组重复出现的白键。找到两个黑键左边的白键就是 C，由此向右依次数过去即可。",
          },
          {
            type: "staff",
            caption: "C 大调音阶中的七个基本音（C4 到 B4）",
            notes: ["C4", "D4", "E4", "F4", "G4", "A4", "B4"],
          },
          {
            type: "play",
            label: "顺序听一遍",
            notes: ["C4", "D4", "E4", "F4", "G4", "A4", "B4"],
            mode: "sequence",
          },
          {
            type: "tip",
            body: "中央 C（C4）位于钢琴正中位置，是很多教材的参考起点。",
          },
          { type: "link", href: "/tools/note-names", label: "打开音名对照器" },
        ],
      },
      {
        id: "octave",
        title: "八度",
        summary: "相同音名、不同高低的两个音构成八度。",
        blocks: [
          {
            type: "text",
            body: "当一个音的频率是另一个音的两倍时，二者听起来像同一个音的高低版本，这个距离就是八度。例如 C4 与 C5 是一个八度关系。",
          },
          {
            type: "play",
            label: "听 C4 与 C5",
            notes: ["C4", "C5"],
            mode: "sequence",
          },
          {
            type: "staff",
            caption: "C4 与高八度的 C5",
            notes: ["C4", "C5"],
          },
        ],
      },
      {
        id: "semitone",
        title: "半音、全音与变音记号",
        summary: "最小的音高间距，以及升降记号的作用。",
        blocks: [
          {
            type: "text",
            body: "相邻两个琴键（含黑键）之间的距离是半音，两个半音构成一个全音。升号(#)把音升高半音，降号(b)把音降低半音。因此 C# 与 Db 在钢琴上是同一个键，称为等音。",
          },
          {
            type: "play",
            label: "半音：C4 → C#4",
            notes: ["C4", "C#4"],
            mode: "sequence",
          },
          {
            type: "play",
            label: "全音：C4 → D4",
            notes: ["C4", "D4"],
            mode: "sequence",
          },
          { type: "link", href: "/piano", label: "去虚拟钢琴上试一试" },
        ],
      },
    ],
  },
  {
    id: "intervals",
    title: "音程",
    desc: "两个音之间的距离，是和声与旋律的基本砖块。",
    lessons: [
      {
        id: "what-is-interval",
        title: "什么是音程",
        summary: "用度数与性质描述两个音的距离。",
        blocks: [
          {
            type: "text",
            body: "音程是两个音之间的高度差，用度数表示（如三度、五度），并带有大、小、纯、增、减等性质。同时发声称为和声音程，先后发声称为旋律音程。",
          },
          {
            type: "staff",
            caption: "纯五度：C4 与 G4 同时发声",
            notes: [["C4", "G4"]],
          },
          { type: "play", label: "同时听", notes: ["C4", "G4"], mode: "chord" },
          { type: "play", label: "先后听", notes: ["C4", "G4"], mode: "sequence" },
        ],
      },
      {
        id: "major-minor",
        title: "大音程与小音程",
        summary: "二、三、六、七度有大小之分。",
        blocks: [
          {
            type: "text",
            body: "二度、三度、六度、七度可以是大或小，二者相差半音。例如大三度（C–E，4 个半音）明亮，小三度（C–Eb，3 个半音）则更柔和忧郁，这正是大小和弦色彩差异的来源。",
          },
          { type: "play", label: "大三度 C–E", notes: ["C4", "E4"], mode: "chord" },
          { type: "play", label: "小三度 C–Eb", notes: ["C4", "Eb4"], mode: "chord" },
          { type: "link", href: "/tools/interval-finder", label: "用音程查找器探索更多" },
        ],
      },
      {
        id: "perfect",
        title: "纯音程",
        summary: "一、四、五、八度是稳定的纯音程。",
        blocks: [
          {
            type: "text",
            body: "一度、四度、五度、八度被称为纯音程，听感稳定、协和。纯五度（7 个半音）是和弦根基；纯八度（12 个半音）则是同名音的高低关系。",
          },
          {
            type: "staff",
            caption: "纯四度 C–F 与纯五度 C–G",
            notes: [["C4", "F4"], ["C4", "G4"]],
          },
        ],
      },
    ],
  },
  {
    id: "scales",
    title: "音阶",
    desc: "按特定音程结构排列的一组音，决定旋律的色彩。",
    lessons: [
      {
        id: "major-scale",
        title: "大调音阶",
        summary: "全全半全全全半的明亮音阶。",
        blocks: [
          {
            type: "text",
            body: "大调音阶由“全全半全全全半”的音程结构构成。以 C 为主音时，正好是全部白键 C D E F G A B C，听感明亮、积极，是流行与古典音乐最常用的基础。",
          },
          {
            type: "staff",
            caption: "C 大调音阶",
            notes: ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"],
          },
          {
            type: "play",
            label: "听 C 大调音阶",
            notes: ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"],
            mode: "sequence",
          },
          { type: "link", href: "/tools/scale-finder", label: "在音阶查找器查看其他调" },
        ],
      },
      {
        id: "minor-scale",
        title: "自然小调音阶",
        summary: "更内敛忧郁的小调色彩。",
        blocks: [
          {
            type: "text",
            body: "自然小调结构为“全半全全半全全”。A 自然小调用的也是全部白键，但以 A 为主音：A B C D E F G A，色彩比大调更内敛、忧郁。它与 C 大调互为关系大小调。",
          },
          {
            type: "play",
            label: "听 A 自然小调",
            notes: ["A3", "B3", "C4", "D4", "E4", "F4", "G4", "A4"],
            mode: "sequence",
          },
        ],
      },
      {
        id: "pentatonic",
        title: "五声音阶",
        summary: "五个音构成的国风与流行常用音阶。",
        blocks: [
          {
            type: "text",
            body: "五声音阶只用五个音，去掉了容易产生紧张的半音，因而非常顺耳。大调五声（如 C D E G A）广泛用于民族音乐与流行旋律，几乎怎么弹都不会“错”。",
          },
          {
            type: "play",
            label: "听 C 大调五声",
            notes: ["C4", "D4", "E4", "G4", "A4", "C5"],
            mode: "sequence",
          },
          { type: "link", href: "/learn/styles/guofeng", label: "了解国风风格中的五声运用" },
        ],
      },
    ],
  },
  {
    id: "keys",
    title: "调号与调",
    desc: "用调号标明乐曲所处的调，并借助五度圈理解调间关系。",
    lessons: [
      {
        id: "key-signature",
        title: "什么是调号",
        summary: "写在谱号后的升降记号决定全曲的调。",
        blocks: [
          {
            type: "text",
            body: "除了 C 大调，其他调都需要固定地升高或降低某些音，这些记号集中写在谱号之后，称为调号。例如 G 大调有一个升号 F#，使音阶保持“全全半全全全半”的大调结构。",
          },
          {
            type: "staff",
            caption: "G 大调音阶（调号一个升号）",
            notes: ["G4", "A4", "B4", "C5", "D5", "E5", "F#5", "G5"],
            keySignature: "G",
          },
          {
            type: "play",
            label: "听 G 大调音阶",
            notes: ["G4", "A4", "B4", "C5", "D5", "E5", "F#5", "G5"],
            mode: "sequence",
          },
        ],
      },
      {
        id: "circle",
        title: "五度圈与调的关系",
        summary: "每升一个纯五度，调号就多一个升号。",
        blocks: [
          {
            type: "text",
            body: "把各调按纯五度首尾相连排成一圈，就是五度圈。顺时针每走一步多一个升号（C→G→D→A...），逆时针每走一步多一个降号（C→F→Bb→Eb...）。相邻的调共享大量音级，转调最自然。",
          },
          { type: "link", href: "/tools/circle-of-fifths", label: "打开交互式五度圈" },
        ],
      },
    ],
  },
];

export function topicById(id: string): Topic | undefined {
  return THEORY_TOPICS.find((t) => t.id === id);
}
