/**
 * 音程歌曲表数据：每个音程配一首公知曲目作为记忆参照（仅用曲名，不含任何歌词或乐谱）。
 * 上行(ascending)与下行(descending)各给一个常被引用的记忆锚点。
 * 播放时播放的是音程本身（两个示范音），曲名仅作联想提示。
 */

export interface IntervalSong {
  semitones: number;
  short: string;
  zh: string;
  /** 上行记忆参照曲名 */
  ascending: string;
  /** 下行记忆参照曲名 */
  descending: string;
}

export const INTERVAL_SONGS: IntervalSong[] = [
  { semitones: 1, short: "m2", zh: "小二度", ascending: "电影《大白鲨》主题", descending: "《致爱丽丝》开头" },
  { semitones: 2, short: "M2", zh: "大二度", ascending: "《小星星》前两音", descending: "《欢乐颂》相邻级进" },
  { semitones: 3, short: "m3", zh: "小三度", ascending: "《绿袖子》动机", descending: "《这首歌》儿歌呼唤调" },
  { semitones: 4, short: "M3", zh: "大三度", ascending: "《欢乐颂》主题", descending: "《雪绒花》乐句落音" },
  { semitones: 5, short: "P4", zh: "纯四度", ascending: "《婚礼进行曲》起句", descending: "《义勇军进行曲》起句感" },
  { semitones: 6, short: "TT", zh: "三全音", ascending: "《辛普森一家》主题", descending: "《枫叶》爵士色彩" },
  { semitones: 7, short: "P5", zh: "纯五度", ascending: "《小星星》第一跳", descending: "《星球大战》主题落句" },
  { semitones: 8, short: "m6", zh: "小六度", ascending: "《爱的协奏曲》乐句", descending: "《回家》乐句感" },
  { semitones: 9, short: "M6", zh: "大六度", ascending: "《我的邦尼》起句", descending: "《音乐之声》落句" },
  { semitones: 10, short: "m7", zh: "小七度", ascending: "《西区故事》主题色彩", descending: "爵士属七的张力感" },
  { semitones: 11, short: "M7", zh: "大七度", ascending: "《心愿》宽广跳进", descending: "现代和声色彩" },
  { semitones: 12, short: "P8", zh: "纯八度", ascending: "《彩虹之上》开头跳进", descending: "同名音高低呼应" },
];
