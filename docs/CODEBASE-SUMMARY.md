# Browser-Service - Tóm Tắt Codebase

## Thông Tin Nhanh

| Thông Tin | Chi Tiết |
|-----------|----------|
| **Loại Dự Án** | Node.js Backend Service |
| **Framework** | Express.js v4.18.2 |
| **Core Lib** | Puppeteer v21.6.1 (Browser Automation) |
| **Port** | 3050 (mặc định) |
| **Dòng Code** | ~539 JS lines |
| **Phiên Bản** | v1.0.0 |

## Mục Đích Chính

Dịch vụ tự động hóa trình duyệt web để:
- Lấy tokens xác thực (Bearer tokens)
- Lấy cookies từ các trang web
- Hỗ trợ proxy cho bypass giới hạn IP
- Cung cấp API REST cho các client

## Cấu Trúc Cơ Bản

```
browser-service/
├── app.js              # Express server main
├── routes/             # 4 API route handlers
│   ├── tiktok.js
│   ├── olabx.js
│   ├── olabx-cookies.js
│   └── opal.js
├── services/           # 4 Browser automation services
│   ├── get_cookie_tiktok.js
│   ├── open-olabx_token.js
│   ├── open-olabx_cookies.js
│   └── open-opal.js
├── chrome-data/        # Browser profiles & cache
└── package.json        # Dependencies

```

## API Endpoints

| Endpoint | Method | Công Dụng |
|----------|--------|----------|
| `/health` | GET | Health check |
| `/api/tiktok/get-cookie` | POST | Lấy TikTok cookie & device_id |
| `/api/olabx/get-token` | POST | Lấy Olabx Bearer token |
| `/api/olabx-cookies/get-cookie` | POST | Lấy Olabx cookie |
| `/api/opal/get-token` | POST | Lấy Opal Bearer token |

## Key Technologies

- **Express.js** - Web framework
- **Puppeteer** - Browser automation
- **CORS** - Cross-origin requests
- **Dotenv** - Config management
- **Nodemon** - Dev auto-reload

## Dependencies

```json
{
  "express": "^4.18.2",
  "puppeteer": "^21.6.1",
  "cors": "^2.8.5",
  "dotenv": "^16.3.1",
  "nodemon": "^3.0.2" // devDependency
}
```

## Browser Automation Pattern

Mỗi service thực hiện:
1. Khởi động Chrome browser với Puppeteer
2. Xác thực proxy (tnetpx.smitbox.com:18084)
3. Ẩn dấu hiệu automation (disable webdriver detection)
4. Truy cập target URL
5. Lắng nghe & lấy dữ liệu (tokens/cookies)
6. Polling cho tới khi có dữ liệu (hoặc timeout)
7. Đóng browser & trả dữ liệu

## Timeouts

- TikTok: 60 giây
- Olabx Token: 220 giây
- Olabx Cookie: 30 giây
- Opal Token: 60 giây

## Configuration

### Environment Variables (.env)
```env
PORT=3050
CHROME_PATH=/Applications/Google Chrome.app/Contents/MacOS/Google Chrome
```

### Hardcoded Proxy
```
Server: tnetpx.smitbox.com:18084
Username: k23fjgdf56tg
Password: dfjh3233498jfg67d9
```

## Architecture Pattern

```
Client → Route Handler → Service → Puppeteer → Browser → Data Extraction → Response
```

- **Routes:** Handle HTTP requests, return JSON
- **Services:** Business logic, browser automation
- **Browser:** Chrome/Chromium controlled by Puppeteer

## Điểm Mạnh

✅ Cấu trúc đơn giản  
✅ Tách biệt routes vs services  
✅ Anti-bot detection  
✅ Timeout handling  
✅ Proxy support  

## Cần Cải Thiện

⚠️ Credentials hardcoded (nên di chuyển .env)  
⚠️ Không có logging library  
⚠️ Timeout values hardcoded  
⚠️ Không có retry logic  
⚠️ Browser pool inefficient (new instance per request)  
⚠️ Không có rate limiting  
⚠️ Không có API authentication  

## Lệnh

```bash
npm install          # Cài dependencies
npm start            # Production
npm run dev          # Development (auto-reload)
```

## Git Info

- **Repos:** Yes (.git folder)
- **.gitignore:** node_modules, .env, chrome-data, *.log
- **Recent commits:** sửa ip, updates, etc.

---

Báo cáo chi tiết: `/docs/reports/scout-251220-browser-service-analysis.md`

