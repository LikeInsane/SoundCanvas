# SoundCanvas

音乐编曲学习网站：从节奏、和弦、旋律入门，在网页内用迷你编曲沙盒边学边做，产出可播放的编曲片段。

## 技术栈

- **框架**: Next.js 14 (App Router) + TypeScript
- **数据库**: Prisma + SQLite（开发）/ PostgreSQL（生产）
- **认证**: NextAuth.js（邮箱 + 密码）
- **样式**: Tailwind CSS
- **音频**: Web Audio API

## 功能模块

- **认证**: 注册 / 登录 / 登出
- **学习路径**: 节奏入门、和弦入门、旋律入门（图文 + 音频示例）
- **编曲沙盒**: 节奏轨 + 和弦轨 + 旋律轨，播放/暂停，保存到云端
- **我的作品**: 作品列表，打开/删除

## 本地开发

### 环境要求

- Node.js 18+
- pnpm / npm / yarn

### 安装依赖

```bash
npm install
```

### 配置环境变量

复制 `.env.example` 为 `.env` 并填写：

```bash
cp .env.example .env
```

必填项：

- `DATABASE_URL`: 数据库连接（开发默认 `file:./dev.db`）
- `NEXTAUTH_SECRET`: 随机字符串（用于 Session 加密）
- `NEXTAUTH_URL`: 本地开发填 `http://localhost:3000`

### 初始化数据库

```bash
npx prisma migrate dev
```

### 启动开发服务

```bash
npm run dev
```

浏览器访问 [http://localhost:3000](http://localhost:3000)。

## 脚本说明


| 命令              | 说明        |
| --------------- | --------- |
| `npm run dev`   | 启动开发服务器   |
| `npm run build` | 生产构建      |
| `npm run start` | 启动生产服务    |
| `npm run lint`  | 运行 ESLint |


## 项目结构（简要）

```
src/
├── app/                    # 页面与 API
│   ├── (auth)/             # 登录、注册
│   ├── learn/              # 节奏、和弦、旋律学习页
│   ├── sandbox/            # 编曲沙盒
│   ├── projects/           # 我的作品
│   └── api/                # API 路由
├── components/             # 公共组件
└── lib/                    # 工具与配置（Prisma、Auth、音频等）
prisma/
└── schema.prisma           # 数据模型
```

## License

见 [LICENSE](LICENSE)。