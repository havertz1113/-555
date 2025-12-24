# GitHub Pages 部署指南

## 步骤 1: 准备 GitHub 仓库

1. 在 GitHub 上创建一个新仓库，命名为 `arix-signature-christmas`
2. 将本地代码推送到仓库：

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/[你的用户名]/arix-signature-christmas.git
git push -u origin main
```

## 步骤 2: 启用 GitHub Pages

1. 进入你的 GitHub 仓库
2. 点击 "Settings" 标签
3. 在左侧菜单中找到 "Pages"
4. 在 "Source" 部分选择 "GitHub Actions"

## 步骤 3: 自动部署

一旦你推送代码到 `main` 分支，GitHub Actions 会自动：
- 安装依赖
- 构建项目
- 部署到 GitHub Pages

## 步骤 4: 访问网站

部署完成后，你的网站将在以下地址可用：
`https://[你的用户名].github.io/arix-signature-christmas/`

## 手动部署（可选）

如果你想手动部署，可以运行：

```bash
npm run deploy
```

这会构建项目并推送到 `gh-pages` 分支。

## 故障排除

### 如果部署失败：

1. 检查 GitHub Actions 日志
2. 确保仓库名称与 `vite.config.ts` 中的 `base` 路径匹配
3. 确保 GitHub Pages 设置正确

### 如果网站显示空白：

1. 检查浏览器控制台的错误信息
2. 确保所有资源路径正确
3. 检查 `base` 配置是否与仓库名称匹配

## 更新网站

要更新网站，只需：
1. 修改代码
2. 提交并推送到 `main` 分支
3. GitHub Actions 会自动重新部署