# SoundCanvas 第一版实施计划

> **For Claude:** 实施时请按任务顺序执行，每完成一阶段可做一次检查点。

**Goal:** 实现零基础用户的音乐编曲学习网站第一版：Next.js 全栈 + 登录与云端保存 + 学习页（节奏/和弦/旋律）+ 迷你编曲沙盒（节奏轨+和弦轨+旋律轨+播放+保存/加载）。

**Architecture:** 单仓库 Next.js App Router；Prisma 管理 User/Project；NextAuth Credentials 邮箱密码；作品 JSON 存 Project.content；沙盒为单页 SPA 式编辑与 Web Audio 播放。

**Tech Stack:** Next.js 14+ (App Router), TypeScript, Prisma (SQLite/PostgreSQL), NextAuth.js, Tailwind CSS, Web Audio API。

**设计文档:** `docs/plans/2026-02-28-music-learning-sandbox-design.md`

---

## Phase 1: 项目初始化与认证

### Task 1: 初始化 Next.js 与基础依赖

**Files:**
- Create: 项目根目录通过 `npx create-next-app@latest` 生成
- Modify: `package.json`（确认 TypeScript、ESLint、Tailwind 等）

**Step 1:** 在仓库根目录执行

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --no-import-alias
```

（若提示目录非空，选 overwrite 或先建空子目录再初始化；保持现有 README/LICENSE 可先备份再覆盖）

**Step 2:** 确认 `src/app/layout.tsx`、`src/app/page.tsx` 存在，运行 `npm run dev` 能打开首页。

**Step 3:** 安装 Prisma、NextAuth

```bash
npm i prisma @prisma/client next-auth
npm i -D prisma
npx prisma init
```

**Step 4:** Commit

```bash
git add .
git commit -m "chore: init Next.js with TypeScript, Tailwind, Prisma, NextAuth"
```

---

### Task 2: Prisma 模型 User 与 Project

**Files:**
- Create/Modify: `prisma/schema.prisma`

**Step 1:** 在 `prisma/schema.prisma` 中定义 datasource（sqlite 或 postgres）、generator，以及：

```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  passwordHash  String
  name          String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  projects      Project[]
}

model Project {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  title     String
  content   String   // JSON 字符串，见设计文档 4.3
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([userId])
}
```

**Step 2:** 执行 `npx prisma migrate dev --name init`，确认生成迁移与 SQLite/Postgres 表。

**Step 3:** 在 `src/lib/prisma.ts` 中创建单例 PrismaClient（避免 dev 热重载多实例），并导出。

**Step 4:** Commit

```bash
git add prisma src/lib/prisma.ts
git commit -m "feat: add User and Project models with Prisma"
```

---

### Task 3: NextAuth 配置与 Credentials 注册/登录

**Files:**
- Create: `src/lib/auth.ts`（NextAuth options、Credentials provider）
- Create: `src/app/api/auth/[...nextauth]/route.ts`
- Create: `src/app/api/auth/register/route.ts`（注册 API：校验邮箱密码、bcrypt 哈希、创建 User）

**Step 1:** 安装 bcrypt 与类型：`npm i bcrypt && npm i -D @types/bcrypt`

**Step 2:** 实现 `src/app/api/auth/register/route.ts`：POST body 含 email、password、name（可选）；校验邮箱格式与密码长度；查重 email；bcrypt.hash 后写入 User；返回 201 或 400 错误信息。

**Step 3:** 实现 `src/lib/auth.ts`：NextAuthOptions，Credentials provider，从 body 取 email/password，用 Prisma 查 User、bcrypt.compare；通过则返回 user 对象（含 id、email、name）。Session strategy 用 jwt，callbacks 中把 user.id 放入 token/session。

**Step 4:** 实现 `src/app/api/auth/[...nextauth]/route.ts` 为 GET/POST 转发到 NextAuth(authOptions)。

**Step 5:** 在 `.env.local` 中设置 `NEXTAUTH_SECRET`、`DATABASE_URL`（Prisma 用）。

**Step 6:** 用 Postman 或 curl 测试：POST /api/auth/register，再 POST /api/auth/callback/credentials（或前端 form 提交到 signIn），确认能拿到 session。

**Step 7:** Commit

```bash
git add src/lib/auth.ts src/app/api/auth src
git commit -m "feat: add NextAuth Credentials and register API"
```

---

### Task 4: 登录页与注册页

**Files:**
- Create: `src/app/(auth)/login/page.tsx`
- Create: `src/app/(auth)/register/page.tsx`
- Create: `src/components/ui/` 下简单表单组件（可选，或直接在 page 内写）

**Step 1:** 登录页：表单 email + password，onSubmit 调用 `signIn("credentials", { email, password, redirect: false })`，失败显示错误，成功 `router.push("/")` 或目标页。

**Step 2:** 注册页：表单 email、password、name（可选），onSubmit POST `/api/auth/register`，成功则跳转登录或直接 signIn，失败显示错误。

**Step 3:** 在 layout 或首页提供「登录」「注册」链接指向 `/login`、`/register`。

**Step 4:** 手动测试：注册新用户、登录、确认跳转。

**Step 5:** Commit

```bash
git add src/app/\(auth\) src/components
git commit -m "feat: add login and register pages"
```

---

## Phase 2: 首页、学习页与作品列表

### Task 5: 首页与导航

**Files:**
- Modify: `src/app/page.tsx`
- Create/Modify: `src/app/layout.tsx`（导航栏：首页、学习、编曲、我的作品、登录/登出）

**Step 1:** 首页：简短站点介绍 + 入口按钮/链接：「去学习」→ `/learn`，「去编曲」→ `/sandbox`，「我的作品」→ `/projects`，「登录」→ `/login`（未登录时显示登录/注册，已登录显示登出）。

**Step 2:** 在 layout 或公共组件中根据 `getServerSession` 或客户端 `useSession` 显示不同导航状态；未登录访问 `/sandbox`、`/projects` 时重定向到 `/login`（可在 middleware 或页面内判断）。

**Step 3:** Commit

```bash
git add src/app/page.tsx src/app/layout.tsx
git commit -m "feat: add home page and nav with auth state"
```

---

### Task 6: 学习页（节奏、和弦、旋律）静态内容

**Files:**
- Create: `src/app/learn/rhythm/page.tsx`
- Create: `src/app/learn/chords/page.tsx`
- Create: `src/app/learn/melody/page.tsx`
- Create: `src/app/learn/layout.tsx`（可选，共用标题与子导航）

**Step 1:** 节奏入门页：标题 + 简短文字介绍「拍子、小节、强拍弱拍」+ 若有示例音频可放 `<audio>` 或占位说明「示例音频待接入」。

**Step 2:** 和弦入门页：简短介绍「什么是和弦、C/Am/F/G 等」+ 示例占位。

**Step 3:** 旋律入门页：简短介绍「音高、单音与旋律」+ 示例占位。

**Step 4:** 学习目录/导航：在 `/learn` 或 layout 中提供三个子页链接。

**Step 5:** Commit

```bash
git add src/app/learn
git commit -m "feat: add learn pages for rhythm, chords, melody"
```

---

### Task 7: 作品 API（CRUD + 鉴权）

**Files:**
- Create: `src/app/api/projects/route.ts`（GET 列表、POST 新建）
- Create: `src/app/api/projects/[id]/route.ts`（GET 单条、PUT 更新、DELETE 删除）

**Step 1:** GET /api/projects：用 getServerSession 取当前用户；未登录返回 401；Prisma 查 Project  where userId = session.user.id，按 updatedAt 倒序，返回 id、title、createdAt、updatedAt（不必须带 content）。

**Step 2:** POST /api/projects：body 含 title、content（JSON 字符串）；校验必填与 content 可解析；未登录 401；创建 Project 关联当前 userId；返回 201 及 id。

**Step 3:** GET /api/projects/[id]：鉴权为本人；返回单条含 content。

**Step 4:** PUT /api/projects/[id]：鉴权为本人；更新 title/content；返回 200。

**Step 5:** DELETE /api/projects/[id]：鉴权为本人；删除；返回 204。

**Step 6:** 用 API 工具测试各端点（带 Cookie 或 Authorization）。

**Step 7:** Commit

```bash
git add src/app/api/projects
git commit -m "feat: add projects API with auth"
```

---

### Task 8: 我的作品列表页

**Files:**
- Create: `src/app/projects/page.tsx`

**Step 1:** 服务端或客户端取 session；未登录重定向到 `/login`。

**Step 2:** 请求 GET /api/projects，展示列表：标题、创建/更新时间；每条可点击「打开」跳转 `/sandbox?id=xxx`，可选「删除」调用 DELETE 后刷新列表。

**Step 3:** 提供「新建作品」入口：跳转 `/sandbox`（无 id 即新建，保存时 POST）。

**Step 4:** Commit

```bash
git add src/app/projects
git commit -m "feat: add projects list page"
```

---

## Phase 3: 编曲沙盒

### Task 9: 沙盒页面骨架与状态

**Files:**
- Create: `src/app/sandbox/page.tsx`
- Create: `src/lib/sandbox-types.ts`（TypeScript 类型：ProjectContent、RhythmEvent、ChordEvent、MelodyEvent 等，与设计文档 4.3 一致）

**Step 1:** 定义 `ProjectContent` 及内部类型（bpm, timeSignature, bars, rhythm.pattern[], chords[], melody[]），导出。

**Step 2:** 沙盒页：从 query 取 `id`（可选）；若未登录重定向 `/login`；用 useState 存 content（默认空或符合设计文档的初始 JSON）、title、projectId；若存在 id 则 useEffect 请求 GET /api/projects/[id] 填充 state。

**Step 3:** 页面布局：顶部标题输入、BPM 输入、播放控制（播放/暂停/停止）、保存/另存为按钮；下方预留三块区域（节奏轨、和弦轨、旋律轨）。

**Step 4:** Commit

```bash
git add src/lib/sandbox-types.ts src/app/sandbox
git commit -m "feat: sandbox page skeleton and content state"
```

---

### Task 10: 节奏轨 UI 与交互

**Files:**
- Create: `src/components/sandbox/RhythmTrack.tsx`
- Modify: `src/app/sandbox/page.tsx`（引入 RhythmTrack，传入 content.rhythm 与更新回调）

**Step 1:** 节奏轨：按 bars 与 timeSignature（如 4/4）渲染格子（每拍一格或每小节 4 格）；每格可点击切换「有/无」，类型可选 kick/snare（第一版可固定两种）；状态提升到父组件，更新 content.rhythm.pattern。

**Step 2:** 与 content 同步：父组件将 content.rhythm 传入，RhythmTrack 受控；onChange 时父组件 setContent 更新 rhythm 部分。

**Step 3:** Commit

```bash
git add src/components/sandbox/RhythmTrack.tsx src/app/sandbox/page.tsx
git commit -m "feat: rhythm track UI and state"
```

---

### Task 11: 和弦轨 UI 与交互

**Files:**
- Create: `src/components/sandbox/ChordsTrack.tsx`
- Modify: `src/app/sandbox/page.tsx`

**Step 1:** 和弦轨：按 bars 渲染每小节一格；每格下拉或按钮选和弦（C, Am, F, G, Dm 等，第一版自然大调即可）；onChange 更新 content.chords（按 barIndex + chord）。

**Step 2:** 与 content 同步，受控组件。

**Step 3:** Commit

```bash
git add src/components/sandbox/ChordsTrack.tsx src/app/sandbox/page.tsx
git commit -m "feat: chords track UI and state"
```

---

### Task 12: 旋律轨 UI 与交互

**Files:**
- Create: `src/components/sandbox/MelodyTrack.tsx`
- Modify: `src/app/sandbox/page.tsx`

**Step 1:** 旋律轨：时间轴与节奏/和弦对齐；纵轴为音高（如 C4～C5 或更多）；格子点击添加/删除音符，单音对应 note + beat + barIndex + duration；与 content.melody 同步。

**Step 2:** 可选：简单钢琴键 + 点击时间格输入音高，或直接网格点选。

**Step 3:** Commit

```bash
git add src/components/sandbox/MelodyTrack.tsx src/app/sandbox/page.tsx
git commit -m "feat: melody track UI and state"
```

---

### Task 13: Web Audio 播放引擎

**Files:**
- Create: `src/lib/audio-engine.ts`（或 `playback.ts`）

**Step 1:** 实现「根据 content + 当前播放时间」在对应 beat 触发：节奏（kick/snare 采样或合成）、和弦（按 chord 名生成音高并播放）、旋律（按 note + duration 播放）。使用 AudioContext、OscillatorNode、GainNode 或 AudioBufferSourceNode；BPM 换算为秒。

**Step 2:** 提供 start()、stop()、pause()、seek(time) 等接口；播放头推进可用 requestAnimationFrame 或 setInterval 按 BPM 计算当前 beat/bar。

**Step 3:** 在沙盒页「播放」按钮中调用该引擎，传入当前 content；暂停/停止时停止引擎。

**Step 4:** 手动测试：编辑简单节奏+和弦+旋律，点击播放能听到对应声音。

**Step 5:** Commit

```bash
git add src/lib/audio-engine.ts src/app/sandbox/page.tsx
git commit -m "feat: Web Audio playback for rhythm, chords, melody"
```

---

### Task 14: 沙盒保存与加载

**Files:**
- Modify: `src/app/sandbox/page.tsx`

**Step 1:** 保存：校验 content（合法 JSON、bars 等范围）；若有 projectId 则 PUT /api/projects/[id]，否则 POST /api/projects；成功后更新 projectId 或跳转/提示。

**Step 2:** 另存为：同 POST，title 可弹窗输入或复制当前 title 加后缀。

**Step 3:** 加载：已在 Task 9 中通过 id 请求 GET 并填充 state；确认从「我的作品」打开能正确带 id 并加载。

**Step 4:** Commit

```bash
git add src/app/sandbox/page.tsx
git commit -m "feat: sandbox save and load from API"
```

---

## Phase 4: 收尾与错误处理

### Task 15: 鉴权与路由保护

**Files:**
- Create: `src/middleware.ts`（可选）或在各页/布局中校验
- Modify: `src/app/sandbox/page.tsx`, `src/app/projects/page.tsx`

**Step 1:** 对 `/sandbox`、`/projects` 做登录校验：服务端 getServerSession 或客户端 useSession；未登录则 redirect 到 `/login` 并 return。

**Step 2:** 若使用 middleware：matcher 包含 `/sandbox`、`/projects`，在 middleware 中 getToken 判断，无 token 则 NextResponse.redirect 到 `/login`。

**Step 3:** Commit

```bash
git add src/middleware.ts src/app/sandbox src/app/projects
git commit -m "feat: protect sandbox and projects routes"
```

---

### Task 16: API 错误处理与 content 校验

**Files:**
- Modify: `src/app/api/projects/route.ts`
- Modify: `src/app/api/projects/[id]/route.ts`

**Step 1:** POST/PUT 中对 content 做 JSON.parse 与基本校验（bars 范围、必填字段存在）；不合规返回 400 与简短中文错误信息。

**Step 2:** 统一 401/403/404 返回格式（如 { error: "未登录" }）；前端根据 status 提示用户。

**Step 3:** Commit

```bash
git add src/app/api/projects
git commit -m "feat: API validation and error messages"
```

---

### Task 17: 基础样式与可用性

**Files:**
- 各页与组件：确保 Tailwind 或现有样式使导航、表单、沙盒轨道清晰可点；移动端可简单适配（可选）。

**Step 1:** 检查首页、登录/注册、学习页、作品列表、沙盒各轨可读可操作；按钮与链接有明确反馈。

**Step 2:** Commit

```bash
git add src
git commit -m "style: basic styling and usability pass"
```

---

## 完成检查清单

- [ ] 用户可注册、登录、登出
- [ ] 未登录无法进入沙盒与我的作品；访问会跳转登录
- [ ] 首页、学习页（节奏/和弦/旋律）可访问
- [ ] 沙盒可编辑节奏、和弦、旋律三轨，并播放
- [ ] 可保存作品到云端、在「我的作品」中打开与删除
- [ ] 作品 API 仅允许操作本人数据；content 不合规时返回 400

---

**执行建议：** 按 Phase 1 → 2 → 3 → 4 顺序执行；每完成一个 Task 做一次 commit。若需由 Agent 按任务执行，可使用 executing-plans 或 subagent-driven-development 技能。
