# 将本地 acting-ai 推送到 GitHub

仓库地址：https://github.com/bigMH/acting-ai.git

请在**本文件夹（acting-ai，即包含 index.html 的目录）**下打开终端，按顺序执行以下命令。

## 1. 初始化并关联远程

```bash
git init
git remote add origin https://github.com/bigMH/acting-ai.git
```

## 2. 添加并提交所有文件

```bash
git add .
git status
git commit -m "更新：科普文章、下拉菜单、样式与脚本优化"
```

## 3. 推送到 GitHub

若远程仓库**已有提交**（例如之前用网页创建过文件），先拉取再推送：

```bash
git branch -M main
git pull origin main --allow-unrelated-histories
# 若有冲突，解决后执行：git add . && git commit -m "合并远程"
git push -u origin main
```

若远程仓库**基本是空的**或你确定要覆盖：

```bash
git branch -M main
git push -u origin main
```

若推送时提示「拒绝合并不相关历史」，使用上面的 `git pull origin main --allow-unrelated-histories` 再 `git push`。

## 4. 首次推送若要求登录

- 使用 **HTTPS** 时，会提示输入 GitHub 用户名和密码；密码处需使用 **Personal Access Token**（在 GitHub → Settings → Developer settings → Personal access tokens 创建）。
- 或改用 **SSH**：  
  `git remote set-url origin git@github.com:bigMH/acting-ai.git`  
  再执行 `git push -u origin main`（需已配置 SSH 密钥）。

---

完成后可在 https://github.com/bigMH/acting-ai 查看并开启 GitHub Pages 部署静态站。
