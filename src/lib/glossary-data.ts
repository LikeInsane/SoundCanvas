/**
 * 音乐术语词典数据：常见乐理术语的中文释义（原创编写）。
 * 按字母/拼音分组在页面端处理。
 */

export interface GlossaryTerm {
  term: string;
  /** 别名或英文 */
  alias?: string;
  category: "基础" | "节奏" | "和声" | "曲式" | "演奏" | "音色";
  definition: string;
}

export const GLOSSARY: GlossaryTerm[] = [
  { term: "音高", alias: "Pitch", category: "基础", definition: "声音的高低，由振动频率决定，频率越高音越高。" },
  { term: "音名", alias: "Note Name", category: "基础", definition: "用字母 C D E F G A B 标记的十二平均律基本音级。" },
  { term: "唱名", alias: "Solfège", category: "基础", definition: "Do Re Mi Fa Sol La Si，用于视唱的相对音高名称。" },
  { term: "八度", alias: "Octave", category: "基础", definition: "频率比为 2:1 的两个音之间的距离，听感上是同一个音的高低版本。" },
  { term: "半音", alias: "Semitone", category: "基础", definition: "十二平均律中最小的音程，相邻两个琴键之间的距离。" },
  { term: "全音", alias: "Whole Tone", category: "基础", definition: "两个半音的距离。" },
  { term: "变音记号", alias: "Accidental", category: "基础", definition: "升号(#)、降号(b)、还原号等改变音高的记号。" },
  { term: "拍子", alias: "Beat", category: "节奏", definition: "音乐中规律的时间脉动，是节奏的基本单位。" },
  { term: "拍号", alias: "Time Signature", category: "节奏", definition: "如 4/4，上方数字表示每小节拍数，下方表示以几分音符为一拍。" },
  { term: "速度", alias: "Tempo / BPM", category: "节奏", definition: "音乐快慢，以每分钟拍数(BPM)衡量。" },
  { term: "小节", alias: "Bar / Measure", category: "节奏", definition: "由小节线划分的、包含固定拍数的节奏单位。" },
  { term: "切分", alias: "Syncopation", category: "节奏", definition: "重音落在弱拍或弱位上，制造律动张力。" },
  { term: "附点", alias: "Dotted Note", category: "节奏", definition: "音符后加点，时值延长为原来的 1.5 倍。" },
  { term: "三连音", alias: "Triplet", category: "节奏", definition: "把一拍均分为三等份的节奏型。" },
  { term: "音程", alias: "Interval", category: "和声", definition: "两个音之间的音高距离，分大、小、纯、增、减等性质。" },
  { term: "和弦", alias: "Chord", category: "和声", definition: "三个或以上的音同时发声形成的音响组合。" },
  { term: "三和弦", alias: "Triad", category: "和声", definition: "由根音、三音、五音叠置而成的三音和弦。" },
  { term: "七和弦", alias: "Seventh Chord", category: "和声", definition: "在三和弦基础上再叠加一个七度音。" },
  { term: "转位", alias: "Inversion", category: "和声", definition: "和弦中非根音作为最低音时形成的排列形态。" },
  { term: "调式", alias: "Mode", category: "和声", definition: "以特定音程结构组织的音阶体系，如大调、小调、多利亚等。" },
  { term: "调号", alias: "Key Signature", category: "和声", definition: "写在谱号后的升降记号，指明乐曲所处的调。" },
  { term: "音阶", alias: "Scale", category: "和声", definition: "按高低顺序排列的一组音，构成调式的骨架。" },
  { term: "和声进行", alias: "Chord Progression", category: "和声", definition: "和弦按一定逻辑先后连接，构成音乐的纵向支撑。" },
  { term: "五度圈", alias: "Circle of Fifths", category: "和声", definition: "按纯五度关系排列各调的环形图，便于理解调号与转调。" },
  { term: "主音", alias: "Tonic", category: "和声", definition: "调式的中心音，给人稳定与归属感。" },
  { term: "属音", alias: "Dominant", category: "和声", definition: "主音上方纯五度的音(第五级)，倾向回归主音。" },
  { term: "动机", alias: "Motif", category: "曲式", definition: "最小的、可识别的旋律或节奏单元，是发展的种子。" },
  { term: "乐句", alias: "Phrase", category: "曲式", definition: "相对完整的旋律段落，类似语言中的一句话。" },
  { term: "曲式", alias: "Form", category: "曲式", definition: "乐曲整体结构布局，如 AABA、主歌-副歌等。" },
  { term: "力度", alias: "Dynamics", category: "演奏", definition: "音的强弱，如 p(弱)、f(强)、cresc.(渐强)。" },
  { term: "连奏", alias: "Legato", category: "演奏", definition: "音与音之间圆滑连贯地演奏。" },
  { term: "断奏", alias: "Staccato", category: "演奏", definition: "音短促分离地演奏。" },
  { term: "音色", alias: "Timbre", category: "音色", definition: "区分不同乐器或嗓音的声音特质。" },
  { term: "包络", alias: "Envelope / ADSR", category: "音色", definition: "声音随时间变化的轮廓：起音、衰减、延持、释放。" },
  { term: "泛音", alias: "Overtone", category: "音色", definition: "基频之上的整数倍频率成分，决定音色明暗。" },
];
