# 物理掌中学 · Android App

WebView 壳 + 本地网页的初高中物理学习 App。含 16 章知识树、58 道分层练习题、离线 AI 答疑、错题与能力统计。桌面图标为蓝底白字"琴"。

## 目录结构

```
physics-app/
├── .github/workflows/build.yml     # 自动构建 APK
├── app/
│   ├── build.gradle               # ✅ 显式声明 assets.srcDirs
│   └── src/main/
│       ├── AndroidManifest.xml
│       ├── assets/www/            # ✅ 网页资源（必须在此路径）
│       │   ├── index.html
│       │   └── app.js
│       ├── java/com/physics/app/MainActivity.java
│       └── res/                   # ✅ 图标已随仓库提交
│           ├── mipmap-*/ic_launcher.png       (低版本图标)
│           ├── mipmap-*/ic_launcher_fg.png    (自适应前景)
│           ├── mipmap-anydpi-v26/             (Android 8.0+ 自适应)
│           └── values/  (colors / strings / styles)
├── build.gradle
├── settings.gradle
└── gradle.properties
```

## 构建 APK

### 方式一：GitHub Actions（推荐）
1. 把整个 `physics-app` 目录内容推到 GitHub 仓库 `main` 分支
2. 进入 Actions，等待约 3~5 分钟
3. 绿勾后下载 artifact `physics-web-apk`，解压得 `app-debug.apk`

流水线内含两道校验，任一失败会直接变红并说明原因：
- 打包**前**：检查 `assets/www/index.html`、`app.js` 是否存在
- 打包**后**：解压 APK 检查 `assets/www` 是否真的进了包

### 方式二：本地 Android Studio
导入本目录，等 Gradle 同步完成，Run 或 Build → Build APK。

## 常见问题

**Q：安装后打开提示"网页无法打开 ERR_FILE_NOT_FOUND"**
APK 里没有 `assets/www`。用解压软件打开 APK 确认是否存在 `assets/www/index.html`。
本工程已在 `app/build.gradle` 显式声明 `assets.srcDirs = ['src/main/assets']`，正常构建不会缺。

**Q：点八年级却显示高中的内容**
已修复。学段 Key 严格隔离（八年级 `c8` / 高一 `c10`），且 `routes.chapter` 会在进入章节时自动把 `store.stage` 对齐到该章节所属学段。

**Q：图标没更新 / 显示默认安卓图标**
`res/mipmap-*` 下的图标已随仓库提交，无需流水线生成。若仍是旧图标，卸载后重装（Android 有时缓存图标）。

**Q：AI 答疑能问任意问题吗**
不能。它是本地关键词匹配的 16 条物理知识库，离线可用但不联网。要接真大模型需改 `app.js` 的 `sendAI()` 为 API 调用。

## 修改内容

- 加章节：往 `CHAPTERS` 数组追加 `{id, s, t, k}`，`s` 填学段 Key
- 加题目：往 `QUESTIONS` 数组追加 `{id, cid, mod, tag, lv, q, opts, ans, exp}`，`cid` 对应章节 id
- 加 AI 条目：往 `AI_KB` 数组追加 `{keywords:[], title, body, formula, tip}`
- 改应用名：`res/values/strings.xml` 的 `app_name`
