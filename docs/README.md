# Browser-Service Documentation

Tài liệu đầy đủ cho dịch vụ Browser-Service.

## Tài Liệu Có Sẵn

### 1. **CODEBASE-SUMMARY.md** - Tóm Tắt Nhanh
Phù hợp cho developers mới hoặc rapid onboarding.

**Nội dung:**
- Thông tin nhanh (framework, port, dependencies)
- Mục đích chính của dịch vụ
- Cấu trúc thư mục
- API endpoints overview
- Key technologies & dependencies
- Browser automation pattern
- Điểm mạnh & cần cải thiện
- Lệnh khởi động

**Thời gian đọc:** 5-10 phút

---

### 2. **API-REFERENCE.md** - API Documentation
Chi tiết tất cả endpoints và cách sử dụng.

**Nội dung:**
- Base URL
- GET /health - health check
- POST /api/tiktok/get-cookie
- POST /api/olabx/get-token
- POST /api/olabx-cookies/get-cookie
- POST /api/opal/get-token
- Error handling
- Usage examples (JavaScript, cURL, Python)
- Configuration
- Troubleshooting

**Dành cho:** API consumers, developers tích hợp service

**Thời gian đọc:** 10-15 phút

---

### 3. **reports/scout-251220-browser-service-analysis.md** - Báo Cáo Chi Tiết
Phân tích toàn diện codebase với 15 sections.

**Nội dung:**
1. Thông tin dự án
2. Cấu trúc thư mục
3. Dependencies (phụ thuộc)
4. File khởi động (app.js)
5. API Routes (endpoints)
6. Business Logic (services)
7. Biến môi trường (configuration)
8. Kiến trúc & mẫu thiết kế
9. Cơ chế hoạt động chi tiết
10. Cấu trúc Git & version control
11. Tính năng & đặc điểm
12. Mục đích & use cases
13. Lệnh & scripts
14. Endpoints tóm tắt
15. Khuyến nghị & cải thiện

**Dành cho:** Architecture review, code audit, documentation

**Thời gian đọc:** 20-30 phút

---

## Quick Navigation

### Tôi là Developer Mới
→ Đọc **CODEBASE-SUMMARY.md** trước

### Tôi muốn Tích Hợp API
→ Đọc **API-REFERENCE.md**

### Tôi muốn Architecture Review
→ Đọc **scout-251220-browser-service-analysis.md**

### Tôi muốn Tất Cả Chi Tiết
→ Đọc theo thứ tự:
1. CODEBASE-SUMMARY.md
2. API-REFERENCE.md
3. scout-251220-browser-service-analysis.md

---

## File Structure

```
browser-service/
├── docs/
│   ├── README.md                           # ← File này
│   ├── CODEBASE-SUMMARY.md                 # Tóm tắt nhanh
│   ├── API-REFERENCE.md                    # API documentation
│   └── reports/
│       └── scout-251220-browser-service-analysis.md  # Báo cáo chi tiết
├── app.js
├── routes/
├── services/
├── package.json
└── ...
```

---

## Key Information at a Glance

| Aspect | Details |
|--------|---------|
| **Type** | Node.js Backend Service |
| **Framework** | Express.js |
| **Core Library** | Puppeteer (Browser Automation) |
| **Port** | 3050 |
| **Main Purpose** | Extract tokens/cookies via browser automation |
| **Supported Platforms** | TikTok, Google Whisk (Olabx), Google Opal |
| **Lines of Code** | ~539 lines |

---

## API Endpoints Summary

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/health` | GET | Health check |
| `/api/tiktok/get-cookie` | POST | Get TikTok cookie & device_id |
| `/api/olabx/get-token` | POST | Get Olabx Bearer token |
| `/api/olabx-cookies/get-cookie` | POST | Get Olabx cookie |
| `/api/opal/get-token` | POST | Get Opal Bearer token |

---

## Getting Started

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

### Health Check
```bash
curl http://localhost:3050/health
```

---

## Key Technologies

- **Express.js** v4.18.2 - Web framework
- **Puppeteer** v21.6.1 - Browser automation
- **CORS** v2.8.5 - Cross-origin support
- **Dotenv** v16.3.1 - Environment config
- **Nodemon** v3.0.2 - Dev auto-reload

---

## Common Use Cases

1. **Automated data collection** - Lấy data từ web tự động
2. **Session management** - Quản lý tokens & cookies
3. **Web testing** - Test web applications
4. **API integration** - Cung cấp tokens cho upstream services

---

## Architecture at a Glance

```
Client Request
    ↓
Express Route
    ↓
Service Layer (Browser Automation)
    ↓
Puppeteer + Chrome
    ↓
Data Extraction
    ↓
JSON Response
```

---

## Configuration Files

### .env
```env
PORT=3050
CHROME_PATH=/Applications/Google Chrome.app/Contents/MacOS/Google Chrome
```

### Hardcoded Proxy
- Server: tnetpx.smitbox.com:18084
- ⚠️ Should move to .env for security

---

## Strengths

✅ Simple, maintainable structure  
✅ Route-Service separation  
✅ Anti-bot detection  
✅ Timeout handling  
✅ Proxy support  

---

## Areas for Improvement

⚠️ Credentials hardcoded → move to .env  
⚠️ No logging framework → add Winston/Pino  
⚠️ No retry logic → add exponential backoff  
⚠️ No rate limiting → add middleware  
⚠️ No authentication → add API keys/JWT  
⚠️ Inefficient browser pooling → implement pool  
⚠️ No caching → implement Redis caching  

---

## Documentation Metadata

| Item | Value |
|------|-------|
| **Created** | 2025-12-20 |
| **Format** | Markdown |
| **Language** | Vietnamese |
| **Last Updated** | 2025-12-20 |
| **Status** | Complete |

---

## Contact & Support

For questions or issues:
1. Check CODEBASE-SUMMARY.md
2. Check API-REFERENCE.md
3. Refer to scout-251220-browser-service-analysis.md
4. Check GitHub repository

---

**Happy coding!** 🚀

