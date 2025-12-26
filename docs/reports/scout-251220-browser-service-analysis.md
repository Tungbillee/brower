# Báo Cáo Phân Tích Codebase: Browser-Service

**Ngày tạo:** 20/12/2025  
**Mục đích:** Phân tích cấu trúc, kiến trúc và mục đích của dịch vụ Browser-Service

---

## 1. Thông Tin Dự Án

### Loại Dự Án
- **Loại:** Node.js Service (Backend)
- **Framework chính:** Express.js (Web framework)
- **Phiên bản:** v1.0.0
- **Mô tả:** Dịch vụ tự động hóa trình duyệt để lấy token và cookie từ các nền tảng khác nhau

### Mục Đích Chính
Browser-Service là một dịch vụ backend chuyên dụng cho:
- Tự động hóa trình duyệt bằng Puppeteer
- Lấy token xác thực (Bearer tokens) từ các trang web
- Lấy cookies từ các ứng dụng web
- Hỗ trợ proxy cho bypass giới hạn IP
- Cung cấp API REST cho các client khác

---

## 2. Cấu Trúc Thư Mục

```
browser-service/
├── app.js                      # File khởi động chính
├── package.json                # Phụ thuộc dự án
├── package-lock.json           # Lock file cho npm
├── .env.example                # Mẫu biến môi trường
├── .gitignore                  # Git ignore rules
├── chrome-data/                # Dữ liệu Chrome/Chromium
│   ├── tiktok/                 # Profile dành cho TikTok
│   ├── chrome-videos/          # Profile dành cho Olabx
│   └── opal/                   # Profile dành cho Opal
├── routes/                     # API Routes
│   ├── tiktok.js              # Route /api/tiktok
│   ├── olabx.js               # Route /api/olabx
│   ├── olabx-cookies.js       # Route /api/olabx-cookies
│   └── opal.js                # Route /api/opal
├── services/                   # Business logic (Browser automation)
│   ├── get_cookie_tiktok.js    # Lấy cookie TikTok
│   ├── open-olabx_token.js     # Lấy token Olabx
│   ├── open-olabx_cookies.js   # Lấy cookie Olabx
│   └── open-opal.js            # Lấy token Opal
├── node_modules/               # Dependencies (không commit)
└── .git/                        # Git repository

```

**Tổng dòng code:** 539 dòng JavaScript (không tính node_modules)

---

## 3. Dependencies (Phụ Thuộc)

### Dependencies Chính
| Package | Version | Mục Đích |
|---------|---------|---------|
| `express` | ^4.18.2 | Web framework chính |
| `puppeteer` | ^21.6.1 | Browser automation |
| `cors` | ^2.8.5 | Cross-Origin Resource Sharing |
| `dotenv` | ^16.3.1 | Quản lý biến môi trường |

### DevDependencies
| Package | Version | Mục Đích |
|---------|---------|---------|
| `nodemon` | ^3.0.2 | Auto-reload trong development |

### Phân Tích Dependencies
- **Puppeteer:** Core dependency cho browser automation (v21.6.1 - khá mới)
- **Express:** Lightweight web framework, tốt cho dịch vụ nhỏ
- **CORS:** Cho phép cross-origin requests từ các client khác nhau
- **Dotenv:** Quản lý config từ .env file

---

## 4. File Khởi Động (app.js)

### Cấu Trúc
- **Port mặc định:** 3050 (từ env PORT hoặc fallback)
- **Middleware:**
  - CORS enabled
  - JSON body parser
- **Routes đăng ký:**
  - `/api/tiktok` → TikTok services
  - `/api/olabx` → Olabx token services
  - `/api/olabx-cookies` → Olabx cookie services
  - `/api/opal` → Opal services
- **Health check:** `GET /health`
- **Error handler:** Global error middleware

### Logging
- Sử dụng console.log với emoji cho dễ theo dõi
- Log các endpoint khi server khởi động

---

## 5. API Routes (Endpoints)

### 1. TikTok Route (`routes/tiktok.js`)
```
POST /api/tiktok/get-cookie
```
- **Mục đích:** Lấy cookie của TikTok
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "device_id": "string",
      "cookie": "string"
    }
  }
  ```

### 2. Olabx Token Route (`routes/olabx.js`)
```
POST /api/olabx/get-token
```
- **Mục đích:** Lấy Bearer token từ Google Whisk/Olabx
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "success": true,
      "token": "Bearer_token_string"
    }
  }
  ```

### 3. Olabx Cookie Route (`routes/olabx-cookies.js`)
```
POST /api/olabx-cookies/get-cookie
```
- **Mục đích:** Lấy Set-Cookie header từ Olabx
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "success": true,
      "cookie": "string"
    }
  }
  ```

### 4. Opal Token Route (`routes/opal.js`)
```
POST /api/opal/get-token
```
- **Mục đích:** Lấy Bearer token từ Google Opal
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "success": true,
      "token": "Bearer_token_string",
      "type": "google-opal"
    }
  }
  ```

### Health Check
```
GET /health
```
- **Response:**
  ```json
  {
    "status": "ok",
    "service": "browser-service"
  }
  ```

---

## 6. Business Logic (Services)

### 6.1 `services/get_cookie_tiktok.js`

**Chức năng:** Lấy cookie và device_id từ TikTok

**Quy trình:**
1. Khởi động Chrome browser với Puppeteer
2. Xác thực proxy (tnetpx.smitbox.com:18084)
3. Ẩn dấu hiệu automation
4. Enable request interception
5. Lắng nghe response từ URL chứa "tiktok/popup/dispatch/v1"
6. Trích xuất device_id từ query params
7. Trích xuất cookie từ request headers
8. Đóng browser và trả dữ liệu

**Timeout:** 60 giây

**Chrome data path:** `chrome-data/tiktok/`

### 6.2 `services/open-olabx_token.js`

**Chức năng:** Lấy Bearer token từ Google Whisk

**Quy trình:**
1. Khởi động Chrome browser
2. Xác thực proxy
3. Ẩn dấu hiệu automation
4. Lắng nghe request events để tìm Authorization header
5. Trích xuất Bearer token từ header
6. Truy cập URL: `https://labs.google/fx/vi/tools/whisk/library`
7. Đợi token (max 220 giây)
8. Đóng browser

**Timeout:** 220 giây (dài vì cần thời gian load trang)

**Chrome data path:** `chrome-data/chrome-videos/`

### 6.3 `services/open-olabx_cookies.js`

**Chức năng:** Lấy Set-Cookie header từ Olabx

**Quy trình:**
1. Khởi động Chrome browser
2. Xác thực proxy
3. Ẩn dấu hiệu automation
4. Lắng nghe response events
5. Trích xuất Set-Cookie header
6. Truy cập URL: `https://labs.google/fx/vi/tools/whisk/library`
7. Đợi cookie (max 30 giây)
8. Đóng browser

**Timeout:** 30 giây

**Chrome data path:** `chrome-data/chrome-videos/`

### 6.4 `services/open-opal.js`

**Chức năng:** Lấy Bearer token từ Google Opal

**Quy trình:**
1. Khởi động Chrome browser
2. Xác thực proxy
3. Ẩn dấu hiệu automation
4. Enable request interception
5. Lắng nghe request events để tìm Authorization header
6. Trích xuất Bearer token
7. Truy cập URL: `https://opal.google/`
8. Đợi token (max 60 giây)
9. Đóng browser

**Timeout:** 60 giây

**Chrome data path:** `chrome-data/opal/`

---

## 7. Biến Môi Trường (Configuration)

### File: `.env.example`

```env
# Server port
PORT=3050

# Chrome executable path
# macOS: /Applications/Google Chrome.app/Contents/MacOS/Google Chrome
# Linux: /usr/bin/google-chrome
# Windows: C:\Program Files\Google\Chrome\Application\chrome.exe
CHROME_PATH=/Applications/Google Chrome.app/Contents/MacOS/Google Chrome
```

### Cấu Hình Mặc Định Trong Code

**Proxy Server:**
- Host: `tnetpx.smitbox.com:18084`
- Username: `k23fjgdf56tg`
- Password: `dfjh3233498jfg67d9`

*(Lưu ý: Credentials này hardcoded trong services - nên di chuyển vào .env cho bảo mật)*

---

## 8. Kiến Trúc & Mẫu Thiết Kế

### Kiến Trúc Tổng Quan
```
Client Request
    ↓
Express Route Handler
    ↓
Service (Browser Automation)
    ↓
Puppeteer
    ↓
Chrome Browser
    ↓
Data Extraction (Token/Cookie)
    ↓
Response
```

### Mẫu Thiết Kế

1. **Route-Service Pattern:**
   - Routes xử lý HTTP requests
   - Services chứa business logic
   - Tách biệt concerns rõ ràng

2. **Async/Await Pattern:**
   - Tất cả services sử dụng async functions
   - Error handling với try-catch

3. **Promise-based Timeouts:**
   - Sử dụng polling loop để chờ data
   - setTimeout để delay
   - Max timeout để tránh hanging

4. **Browser Session Management:**
   - Mỗi request tạo một browser instance mới
   - Browser được đóng sau khi hoàn thành
   - Chrome data directory riêng cho mỗi service

---

## 9. Cơ Chế Hoạt Động Chi Tiết

### Browser Automation Flow

**Bước 1: Khởi động Browser**
```javascript
browser = await puppeteer.launch({
  executablePath: CHROME_PATH,
  headless: false,  // Hiển thị UI
  defaultViewport: null,
  args: [
    "--start-maximized",
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--disable-blink-features=AutomationControlled",  // Ẩn dấu bot
    `--proxy-server=http://${PROXY_SERVER}`
  ],
  userDataDir: chromeDataPath  // Lưu session data
});
```

**Bước 2: Proxy Authentication**
```javascript
await page.authenticate({
  username: PROXY_USERNAME,
  password: PROXY_PASSWORD
});
```

**Bước 3: Anti-Bot Detection**
```javascript
await page.evaluateOnNewDocument(() => {
  Object.defineProperty(navigator, "webdriver", {
    get: () => false
  });
});
```

**Bước 4: Data Interception**
- TikTok: Lắng nghe response từ URL pattern
- Token services: Lắng nghe request headers cho "Bearer"
- Cookie services: Lắng nghe response headers cho "set-cookie"

**Bước 5: Page Navigation & Waiting**
```javascript
await page.goto(TARGET_URL, { waitUntil: "networkidle2" });
```

**Bước 6: Polling for Data**
```javascript
while (!dataFound && Date.now() - startTime < maxWaitTime) {
  await new Promise(resolve => setTimeout(resolve, 1000));
}
```

**Bước 7: Cleanup**
```javascript
await browser.close();
```

---

## 10. Cấu Trúc Git & Version Control

### Repository Info
- **Được khởi tạo:** Yes (.git folder exists)
- **Commit gần đây:**
  - `6c39a53` - sửa ip
  - `925bc92` - a
  - `833e553` - a
  - `bc331c2` - a
  - `109199b` - update header true

### .gitignore Rules
```
node_modules/
.env
chrome-data/
*.log
```

---

## 11. Tính Năng & Đặc Điểm

### Điểm Mạnh
✅ Cấu trúc đơn giản, dễ hiểu  
✅ Tách biệt routes và services  
✅ Hỗ trợ proxy cho vượt IP  
✅ Anti-bot detection techniques  
✅ Có timeout để tránh hanging  
✅ Lưu Chrome profiles riêng  
✅ Error handling cơ bản  

### Điểm Yếu / Cần Cải Thiện
⚠️ Credentials (proxy) hardcoded → Nên di chuyển vào .env  
⚠️ Không có logging system → Nên dùng logger library  
⚠️ Timeout values hardcoded → Nên move vào config  
⚠️ Không có retry logic → Nên thêm retry mechanism  
⚠️ Browser instance per request → Có thể reuse browser pool  
⚠️ Polling không hiệu quả → Nên dùng event-based approach  
⚠️ Không có rate limiting  
⚠️ Không có authentication/authorization  

---

## 12. Mục Đích & Use Case

### Nền Tảng Hỗ Trợ
1. **TikTok** - Lấy cookies và device IDs
2. **Google Whisk/Olabx** - Lấy Bearer tokens & cookies
3. **Google Opal** - Lấy Bearer tokens

### Use Cases
- Tự động hóa thu thập dữ liệu
- Lấy session tokens cho API calls
- Automation testing
- Web scraping

---

## 13. Lệnh & Scripts

### Khởi động
```bash
# Development (auto-reload)
npm run dev

# Production
npm start
```

### Dependencies
```bash
npm install
```

---

## 14. Endpoints Tóm Tắt

| Endpoint | Method | Mục Đích |
|----------|--------|---------|
| `/health` | GET | Health check |
| `/api/tiktok/get-cookie` | POST | Lấy TikTok cookie |
| `/api/olabx/get-token` | POST | Lấy Olabx token |
| `/api/olabx-cookies/get-cookie` | POST | Lấy Olabx cookie |
| `/api/opal/get-token` | POST | Lấy Opal token |

---

## 15. Khuyến Nghị & Cải Thiện

### Bảo Mật
1. Di chuyển tất cả credentials vào .env
2. Thêm API key authentication
3. Rate limiting
4. HTTPS enforcement

### Hiệu Năng
1. Implement browser pool thay vì tạo mới mỗi request
2. Cache tokens với TTL
3. Async queue processing

### Logging & Monitoring
1. Thêm proper logging library
2. Request/Response logging
3. Performance metrics
4. Error tracking (Sentry, etc.)

### Code Quality
1. TypeScript migration
2. Unit tests
3. Integration tests
4. ESLint + Prettier

### Scalability
1. Load balancing
2. Queue system (Bull, RabbitMQ)
3. Rate limiting
4. Connection pooling

---

## Kết Luận

Browser-Service là một dịch vụ Node.js/Express được thiết kế để tự động hóa trình duyệt và lấy tokens/cookies từ các nền tảng web khác nhau. Nó sử dụng Puppeteer cho browser automation, hỗ trợ proxy, và có basic anti-bot detection. Cấu trúc đơn giản nhưng có nhiều cơ hội để cải thiện về bảo mật, hiệu năng, và khả năng bảo trì.

