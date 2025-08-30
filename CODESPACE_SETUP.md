# Codespace Quick Setup Guide

## 🚀 快速啟動 GitHub Codespaces

### 方法 1: GitHub CLI (推薦)
```bash
# 列出現有的 Codespaces
gh codespace list

# 創建新的 Codespace
gh codespace create --repo henryyeung/Higgs-Boson-React

# 在瀏覽器中開啟 Codespace
gh codespace ssh --web

# 在 VS Code 中開啟 Codespace  
gh codespace code
```

### 方法 2: 瀏覽器直接創建
1. 前往 GitHub 儲存庫: `https://github.com/henryyeung/Higgs-Boson-React`
2. 點擊綠色 "Code" 按鈕
3. 選擇 "Codespaces" 分頁
4. 點擊 "Create codespace on main"

### 方法 3: VS Code 擴展
1. 安裝 GitHub Codespaces 擴展
2. 按 `Ctrl/Cmd + Shift + P`
3. 輸入 "Codespaces: Create New Codespace"
4. 選擇儲存庫

## ⚙️ 自動化設置功能

創建 Codespace 後會自動執行:
- ✅ 安裝 Node.js 依賴項
- ✅ 設置 Python 虛擬環境  
- ✅ 配置資料庫遷移
- ✅ 啟動開發伺服器 (React + Django)
- ✅ 安裝 GitHub Copilot 擴展

## 🔧 開發工具設置

### 自動安裝的 VS Code 擴展:
- GitHub Copilot & Copilot Chat
- Python 開發工具
- TypeScript 支援
- Tailwind CSS IntelliSense
- Prettier 代碼格式化

### 端口轉發:
- `5174` - React 開發伺服器
- `8000` - Django API 伺服器  
- `3000` - 備用開發伺服器

## 🤖 Copilot 自動化工作流程

### GitHub Actions 工作流程:
```yaml
# 觸發方式:
1. 帶有 'copilot-update' 標籤的 Issue
2. 每週日晚上 2:00 自動執行
3. 手動觸發 (workflow_dispatch)

# 自動化功能:
- 代碼更新和優化
- 依賴項升級
- 測試執行和報告
- 自動 Pull Request 創建
```

### 使用 Copilot 命令:
```bash
# 在終端中使用 Copilot
gh copilot suggest "如何優化 React 組件性能"
gh copilot explain "解釋這段 Django 代碼"

# 在 VS Code 中:
# Ctrl/Cmd + I - 內嵌建議
# Ctrl/Cmd + Shift + I - Copilot Chat
```

## 📝 常用命令

### 開發伺服器:
```bash
# 啟動 React 開發伺服器
npm run dev

# 啟動 Django API 伺服器  
cd server && python manage.py runserver

# 停止所有伺服器
./stop-servers.sh
```

### 資料庫操作:
```bash
# Django 遷移
cd server && python manage.py migrate

# Prisma 同步
npx prisma db push
npx prisma generate
```

### 測試執行:
```bash
# 運行所有測試
npm test

# 運行快速測試
./scripts/quick-test.sh
```

## 🌟 最佳實踐

1. **自動保存**: 文件會在 1 秒後自動保存
2. **Copilot 建議**: 在任何文件中輸入註釋，Copilot 會提供代碼建議
3. **Issues 自動化**: 創建帶有 `copilot-update` 標籤的 Issue 來觸發自動代碼更新
4. **中文語言支援**: Copilot Chat 已設置為繁體中文界面

## 🔗 有用連結

- [GitHub Codespaces 文檔](https://docs.github.com/codespaces)
- [GitHub Copilot 指南](https://docs.github.com/copilot)
- [項目 README](./README.md)
- [快速開始指南](./QUICKSTART.md)

---

💡 **提示**: 如果遇到問題，可以重新運行 `./scripts/auto-setup.sh` 來重置環境。
