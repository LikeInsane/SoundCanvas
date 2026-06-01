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
    id: "staff",
    title: "五线谱",
    desc: "认识五条线与四个间，理解音符在谱表上的高低位置。",
    lessons: [
      {
        id: "lines-and-spaces",
        title: "线与间",
        summary: "五线谱由五条线和它们之间的四个间组成。",
        blocks: [
          {
            type: "text",
            body: "五线谱由五条平行横线构成，从下往上数为第一线到第五线；相邻两线之间的空白叫做“间”，从下往上为第一间到第四间。音符既可以写在线上，也可以写在间里，位置越高音越高。",
          },
          {
            type: "staff",
            caption: "高音谱号下，音符从低到高依次升高",
            notes: ["E4", "F4", "G4", "A4", "B4", "C5", "D5", "E5", "F5"],
          },
          {
            type: "tip",
            body: "高音谱号五条线上的音从下到上是 E、G、B、D、F；四个间从下到上是 F、A、C、E。",
          },
        ],
      },
      {
        id: "note-position",
        title: "音符的位置",
        summary: "线与间逐级排列，相邻位置相差一个音级。",
        blocks: [
          {
            type: "text",
            body: "从一条线到相邻的间、再到上一条线，每移动一格音名就向上走一个音级（如 E→F→G）。理解这一规律后，识谱就变成了沿着线与间数音名的过程。",
          },
          {
            type: "play",
            label: "听这串逐级上行的音",
            notes: ["E4", "F4", "G4", "A4", "B4", "C5"],
            mode: "sequence",
          },
          { type: "link", href: "/exercises/notes", label: "去做识谱习题" },
        ],
      },
    ],
  },
  {
    id: "clefs",
    title: "谱号",
    desc: "谱号确定五线谱上音符的具体音高范围。",
    lessons: [
      {
        id: "treble-bass",
        title: "高音谱号与低音谱号",
        summary: "最常用的两个谱号，覆盖人声与乐器的主要音域。",
        blocks: [
          {
            type: "text",
            body: "高音谱号（G 谱号）的螺旋圈住第二线，把它定为 G4，常用于较高音域；低音谱号（F 谱号）的两点夹住第四线，把它定为 F3，常用于较低音域。钢琴大谱表正是把两者上下叠放。",
          },
          {
            type: "staff",
            caption: "高音谱号上的中央 C 上方音组",
            notes: ["C4", "E4", "G4"],
            clef: "treble",
          },
          {
            type: "staff",
            caption: "低音谱号上的同名音（更低八度区域）",
            notes: ["C3", "E3", "G3"],
            clef: "bass",
          },
        ],
      },
      {
        id: "c-clefs",
        title: "中音与次中音谱号",
        summary: "C 谱号把中央 C 定在某一条线上。",
        blocks: [
          {
            type: "text",
            body: "C 谱号标记的那条线即为中央 C（C4）。当它落在第三线时为中音谱号，常用于中提琴；落在第四线时为次中音谱号，用于大提琴、大管的较高音区。使用合适的谱号可以减少附加线，使乐谱更易读。",
          },
          {
            type: "tip",
            body: "同一个音用不同谱号记写，线间位置会不同，但实际音高不变——谱号只是“坐标系”。",
          },
          { type: "link", href: "/exercises/notes", label: "练习不同谱号的识谱" },
        ],
      },
    ],
  },
  {
    id: "accidentals",
    title: "变音记号",
    desc: "升、降、还原等记号临时改变音的高低。",
    lessons: [
      {
        id: "sharp-flat",
        title: "升号与降号",
        summary: "升号升高半音，降号降低半音。",
        blocks: [
          {
            type: "text",
            body: "升号（#）把音升高一个半音，降号（b）把音降低一个半音。例如 F 升高半音得到 F#，对应钢琴上 F 右侧的黑键；B 降低半音得到 Bb，对应 B 左侧的黑键。",
          },
          {
            type: "play",
            label: "听 F 与 F#",
            notes: ["F4", "F#4"],
            mode: "sequence",
          },
          {
            type: "play",
            label: "听 B 与 Bb",
            notes: ["B4", "Bb4"],
            mode: "sequence",
          },
        ],
      },
      {
        id: "natural-double",
        title: "还原号与重升重降",
        summary: "还原号取消变音，重升重降改变两个半音。",
        blocks: [
          {
            type: "text",
            body: "还原号（♮）取消之前的升降，使音回到本位。重升号（x）把音升高两个半音，重降号（bb）把音降低两个半音，多见于复杂调性中为保持音级拼写的一致。同一个琴键有时可用不同名字记写，这叫等音异名（如 F# 与 Gb）。",
          },
          {
            type: "tip",
            body: "变音记号在一个小节内持续有效，到下一小节自动失效，除非被调号固定。",
          },
          { type: "link", href: "/exercises/notes", label: "练习带变音记号的识谱" },
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
    id: "chords",
    title: "和弦",
    desc: "多个音同时发声构成和弦，是和声色彩的基础。",
    lessons: [
      {
        id: "triad",
        title: "三和弦的构成",
        summary: "由根音叠加两个三度音组成的三个音。",
        blocks: [
          {
            type: "text",
            body: "三和弦是最基础的和弦，由根音、三音、五音三个音叠置而成——在根音上方先叠一个三度，再叠一个三度。以 C 为根音的三和弦是 C–E–G。",
          },
          {
            type: "staff",
            caption: "C 大三和弦：C–E–G 同时发声",
            notes: [["C4", "E4", "G4"]],
          },
          { type: "play", label: "听 C 大三和弦", notes: ["C4", "E4", "G4"], mode: "chord" },
          { type: "link", href: "/tools/chord-finder", label: "用和弦查找器探索更多" },
        ],
      },
      {
        id: "major-minor-chord",
        title: "大三和弦与小三和弦",
        summary: "三音的高低决定和弦的明暗色彩。",
        blocks: [
          {
            type: "text",
            body: "大三和弦的结构是“大三度 + 小三度”，听感明亮（如 C–E–G）；小三和弦是“小三度 + 大三度”，听感柔和忧郁（如 C–Eb–G）。二者只差中间那个三音半音的高低，却带来截然不同的情绪。",
          },
          { type: "play", label: "听 C 大三和弦", notes: ["C4", "E4", "G4"], mode: "chord" },
          { type: "play", label: "听 C 小三和弦", notes: ["C4", "Eb4", "G4"], mode: "chord" },
        ],
      },
      {
        id: "seventh-chord",
        title: "七和弦",
        summary: "在三和弦上再叠一个三度，色彩更丰富。",
        blocks: [
          {
            type: "text",
            body: "在三和弦的五音之上再叠一个三度，就得到包含四个音的七和弦。属七和弦（如 G–B–D–F）带有推动感，常用于推向主和弦；大七和弦（如 C–E–G–B）则柔和、富有色彩，是流行与爵士的常客。",
          },
          { type: "play", label: "听 G 属七和弦", notes: ["G3", "B3", "D4", "F4"], mode: "chord" },
          { type: "play", label: "听 C 大七和弦", notes: ["C4", "E4", "G4", "B4"], mode: "chord" },
          { type: "link", href: "/exercises/chords", label: "去做和弦听辨习题" },
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
