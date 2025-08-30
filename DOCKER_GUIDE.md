# 🐳 Docker 開發環境指南

## 🎯 **為什麼使用 Docker？**

✅ **環境一致性** - 本地、Codespace、生產環境完全相同  
✅ **版本鎖定** - Node.js 18、Python 3.11、特定依賴版本  
✅ **快速設置** - 一鍵啟動完整開發環境  
✅ **隔離性** - 不污染本地系統  
✅ **可移植性** - 任何支援 Docker 的環境都能運行  

## 🚀 **快速開始**

### **本地開發:**
```bash
# 一鍵啟動完整開發環境
./scripts/docker-dev.sh up

# 查看運行狀態
./scripts/docker-dev.sh status

# 查看即時日誌
./scripts/docker-dev.sh logs

# 停止環境
./scripts/docker-dev.sh down
```

### **GitHub Codespace:**
創建 Codespace 後會自動使用 Docker 環境，無需額外配置！

## 📋 **可用命令**

### **環境管理:**
```bash
# 構建 Docker 映像
./scripts/docker-dev.sh build

# 啟動開發環境
./scripts/docker-dev.sh up

# 停止開發環境  
./scripts/docker-dev.sh down

# 重啟環境
./scripts/docker-dev.sh restart

# 清理 Docker 資源
./scripts/docker-dev.sh clean
```

### **開發工具:**
```bash
# 查看容器日誌
./scripts/docker-dev.sh logs

# 進入容器 Shell
./scripts/docker-dev.sh shell

# 查看容器狀態
./scripts/docker-dev.sh status
```

### **手動 Docker Compose:**
```bash
# 使用開發配置啟動
docker-compose -f docker-compose.dev.yml up -d

# 使用完整配置（含資料庫）
docker-compose up -d

# 啟動 PostgreSQL 資料庫
docker-compose --profile postgres up -d

# 啟動 Redis 快取
docker-compose --profile cache up -d
```

## 🌐 **服務端口**

| 服務 | 端口 | 用途 |
|------|------|------|
| React (Vite) | 5174 | 前端開發伺服器 |
| Django API | 8000 | 後端 API 伺服器 |
| PostgreSQL | 5432 | 資料庫（可選） |
| Redis | 6379 | 快取（可選） |

## 🔧 **環境配置**

### **Docker 映像包含:**
- **Node.js 18** - JavaScript 運行環境
- **Python 3.11** - Django 後端環境
- **Alpine Linux** - 輕量級基礎映像
- **Git** - 版本控制
- **Curl/Bash** - 常用工具

### **自動安裝依賴:**
- 所有 npm 套件（package.json）
- 所有 Python 套件（requirements.txt）
- Django 資料庫遷移
- Prisma 設置（如果使用）

### **熱重載支援:**
- React 檔案變更 → 自動重新載入
- Django 檔案變更 → 自動重啟伺服器
- CSS/樣式變更 → 即時更新

## 🔄 **開發工作流程**

### **1. 啟動環境:**
```bash
./scripts/docker-dev.sh up
```

### **2. 開發代碼:**
- 編輯本地檔案
- 變更會自動同步到容器
- 瀏覽器自動重新載入

### **3. 查看日誌:**
```bash
./scripts/docker-dev.sh logs
```

### **4. 進入容器調試:**
```bash
./scripts/docker-dev.sh shell
```

### **5. 停止環境:**
```bash
./scripts/docker-dev.sh down
```

## 🐛 **常見問題解決**

### **端口被佔用:**
```bash
# 停止所有相關容器
./scripts/docker-dev.sh down

# 清理 Docker 資源
./scripts/docker-dev.sh clean

# 重新啟動
./scripts/docker-dev.sh up
```

### **依賴項更新:**
```bash
# 重新構建映像
./scripts/docker-dev.sh build

# 重啟環境
./scripts/docker-dev.sh restart
```

### **資料庫問題:**
```bash
# 進入容器
./scripts/docker-dev.sh shell

# 手動運行遷移
cd server && source venv/bin/activate
python manage.py migrate
```

### **性能優化:**
```bash
# 使用 Docker BuildKit
export DOCKER_BUILDKIT=1

# 構建時使用快取
./scripts/docker-dev.sh build
```

## 📦 **生產部署**

### **構建生產映像:**
```bash
# 使用生產 Dockerfile
docker build -f Dockerfile.prod -t higgs-boson:latest .

# 或使用生產 Compose
docker-compose -f docker-compose.prod.yml up -d
```

### **環境變數:**
```bash
# .env.production
NODE_ENV=production
DJANGO_ENV=production
DATABASE_URL=postgresql://user:pass@db:5432/higgs_boson
```

## 🔗 **相關檔案**

- `Dockerfile` - 主要 Docker 映像定義
- `docker-compose.yml` - 生產環境配置
- `docker-compose.dev.yml` - 開發環境配置
- `.dockerignore` - Docker 忽略檔案
- `scripts/docker-dev.sh` - 開發工具腳本
- `scripts/docker-setup.sh` - Codespace 設置腳本

---

💡 **提示**: 第一次啟動會需要較長時間來下載和構建映像，後續啟動會很快！
