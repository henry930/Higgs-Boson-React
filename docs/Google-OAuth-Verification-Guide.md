# Google OAuth 應用程式驗證問題解決指南

## 問題描述
當嘗試連接Google Calendar時，看到警告："這個應用程式要求存取您 Google 帳戶中的機密資訊。在開發人員向 Google 驗證這個應用程式之前，請勿使用這個應用程式。"

## 解決方案

### 方法1: 添加測試用戶 (推薦)

1. **前往 Google Cloud Console**
   - 訪問: https://console.cloud.google.com/
   - 選擇你的專案

2. **配置 OAuth 同意畫面**
   - 導航到 "APIs & Services" → "OAuth consent screen"
   - 確保選擇 "External" 用戶類型

3. **添加測試用戶**
   - 滾動到 "Test users" 部分
   - 點擊 "+ ADD USERS"
   - 添加你的郵箱: henry930@gmail.com
   - 點擊 "Save"

4. **驗證應用程式狀態**
   - 確保應用程式狀態顯示為 "Testing"
   - 測試用戶列表中應該包含你的郵箱

### 方法2: 發布應用程式

1. **發布到生產環境**
   - 在 OAuth consent screen 頁面
   - 點擊 "PUBLISH APP"
   - 確認發布
   - 注意：發布後需要Google審核

### 方法3: 繞過警告繼續測試

1. **繼續測試流程**
   - 當看到警告頁面時
   - 點擊左下角 "Advanced" (進階)
   - 點擊 "Go to [App Name] (unsafe)" 
   - 繼續授權流程

## 詳細配置檢查清單

### OAuth 同意畫面配置:
- [ ] 應用程式名稱: "Higgs Boson Consultancy"
- [ ] 用戶支援郵箱: henry930@gmail.com
- [ ] 開發者聯絡資訊: henry930@gmail.com
- [ ] 應用程式域名 (可選): 你的網域
- [ ] 應用程式隱私政策連結 (可選)

### OAuth 2.0 客戶端設定:
- [ ] 應用程式類型: Web application
- [ ] 授權的 JavaScript 來源: http://localhost:5174
- [ ] 授權的重新導向 URI: http://localhost:5174

### API 啟用:
- [ ] Google Calendar API 已啟用
- [ ] API 金鑰已建立並正確設定

### 測試用戶:
- [ ] henry930@gmail.com 已添加為測試用戶
- [ ] 測試用戶狀態為 "Active"

## 常見問題

### Q: 為什麼會出現這個警告？
A: Google 要求所有存取用戶資料的應用程式都需要經過驗證，或者將用戶添加為測試用戶。

### Q: 發布應用程式需要多長時間？
A: Google 審核通常需要幾天到幾週時間。

### Q: 我可以在沒有驗證的情況下測試嗎？
A: 可以，通過添加測試用戶或在警告頁面選擇繼續。

### Q: 測試用戶有什麼限制？
A: 測試模式下最多可以添加100個測試用戶，適合開發和測試使用。

## 推薦的開發流程

1. **開發階段**: 使用測試用戶模式
2. **內部測試**: 添加更多測試用戶
3. **公開發布**: 提交 Google 審核並發布

## 快速修復

如果你急於測試功能：

1. 添加 henry930@gmail.com 為測試用戶
2. 等待5-10分鐘讓設定生效
3. 清除瀏覽器快取
4. 重新嘗試 Google Calendar 連接

這樣應該能夠繞過驗證警告，正常使用 Google Calendar 整合功能。
