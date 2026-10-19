# 🧭 Site Hub — 作品集导航站

把我做过的网站、工具和常用 AI 助手都放在一起，一处浏览、随时更新。

## ✨ 功能特性

- **作品集展示**：卡片墙展示所有网站，含动态 Logo、在线状态、访问人数、标签、推荐标记
- **分类筛选**：按分类 / 推荐快速过滤
- **日夜主题**：白天 / 黑夜双主题，跟随系统或手动切换
- **精美动效**：动态渐变背景、光斑漂浮、卡片悬浮、Logo 旋转光环
- **留言板**：访客可反馈问题、建议新功能
- **后台管理**：隐蔽入口 + 密码登录，可增删改查网站、开关显示、置顶推荐、排序、删除留言、修改站点设置
- **数据同步**：所有数据存在 GitHub 仓库的 `data/*.json`，后台一改，全站实时生效

## 🛠 技术栈

- [Next.js 14](https://nextjs.org/)（App Router）+ TypeScript
- [Tailwind CSS](https://tailwindcss.com/) + [Framer Motion](https://www.framer.com/motion/)
- 数据存储：GitHub 仓库 JSON 文件（通过 GitHub API 读写）

## 🚀 本地运行

```bash
npm install
# 复制环境变量模板
copy .env.example .env        # Windows
# 或：cp .env.example .env     # macOS / Linux
# 编辑 .env，填入你自己的配置
npm run dev
```

打开 http://localhost:3000

## 🔐 环境变量

| 变量 | 必填 | 说明 |
| --- | --- | --- |
| `GITHUB_TOKEN` | ✅ | GitHub Personal Access Token（勾选 `repo` 权限），[点此创建](https://github.com/settings/tokens) |
| `GITHUB_OWNER` | ✅ | 你的 GitHub 用户名 |
| `GITHUB_REPO` | ✅ | 本仓库名 |
| `GITHUB_BRANCH` | 可选 | 默认 `main` |
| `ADMIN_PASSWORD` | ✅ | 后台登录密码（自己设一个强密码） |
| `ADMIN_SECRET` | 可选 | 会话签名密钥，不填会自动用密码派生 |

## 🌍 部署

### 1. 上传源代码到 GitHub

在 GitHub 新建仓库（例如 `site-hub`），把本项目 push 上去：

```bash
git init
git add .
git commit -m "init site hub"
git branch -M main
git remote add origin https://github.com/<你的用户名>/site-hub.git
git push -u origin main
```

### 2. 部署到 Vercel（国外访问）

1. 打开 [vercel.com](https://vercel.com)，用 GitHub 登录
2. **Add New → Project**，导入你的 `site-hub` 仓库
3. 框架自动识别为 Next.js，直接下一步
4. 在 **Environment Variables** 里填入上表的全部环境变量
5. 点击 **Deploy**，完成后即可获得 `https://xxx.vercel.app` 地址

### 3. 部署到腾讯云 CloudBase（国内访问）

使用 **云托管（Cloud Run）** 部署（本仓库已提供 `Dockerfile`）：

1. 登录 [腾讯云 CloudBase](https://cloud.tencent.com/product/tcb)，创建环境
2. 开通 **云托管** 服务
3. 新建服务，选择「代码构建」或「镜像构建」，使用本仓库的 `Dockerfile`
4. 在服务配置里填入上表的环境变量
5. 部署完成后绑定域名，即可获得国内访问地址

> 提示：需要真实时同步 + 留言板，必须部署为「云托管」这种带后端的形态；纯静态托管无法运行 API。

## 🔑 后台使用

- **入口 1（隐蔽）**：在首页底部「页脚文字」上**连续点击 5 次**
- **入口 2（直接）**：访问 `你的域名/admin`
- 输入 `ADMIN_PASSWORD` 登录后，即可管理：
  - **网站管理**：新增 / 编辑 / 删除、显示开关、⭐ 推荐开关、上下排序
  - **留言管理**：删除留言
  - **站点设置**：站点名、标语、介绍、GitHub、页脚、在线人数参数
  - **源码位置**：查看源代码仓库与部署说明
- 每次修改点「保存并同步到 GitHub」后，前台即刻更新（约几秒缓存）

## 📁 数据存储原理

```
data/
  sites.json      # 网站列表（后台增删改查）
  messages.json   # 留言板
  settings.json   # 站点设置
```

- 前台读取：`GET /api/data` → 从 GitHub 仓库实时读取（30 秒缓存），失败回退本地默认数据
- 后台写入：`POST /api/admin` → 通过 GitHub API 提交到仓库
- 留言写入：`POST /api/messages` → 通过 GitHub API 追加到 `messages.json`

## 📂 目录结构

```
src/
  app/
    page.tsx          # 首页
    guestbook/        # 留言板
    admin/            # 后台管理
    api/              # 数据读写接口
  components/         # 通用组件
  lib/                # 数据层（GitHub 读写、鉴权、类型）
data/                 # 默认数据
```
