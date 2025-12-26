# Browser-Service API Reference

## Base URL
```
http://localhost:3050
```

## Health Check

### GET /health

Kiểm tra trạng thái dịch vụ.

**Response:**
```json
{
  "status": "ok",
  "service": "browser-service"
}
```

**Status Code:** 200 OK

---

## TikTok API

### POST /api/tiktok/get-cookie

Lấy TikTok cookie và device_id thông qua browser automation.

**Description:**
- Khởi động Chrome browser
- Điều hướng tới https://www.tiktok.com/
- Lắng nghe response từ API tiktok/popup/dispatch/v1
- Trích xuất device_id từ query params
- Trích xuất cookie từ request headers

**Request Body:**
```json
{}
```

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "device_id": "7380123456789012345",
    "cookie": "sessionid=abc123def456..."
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Timeout: Could not find cookie data after 60 seconds"
}
```

**Timeout:** 60 seconds  
**Status Code:** 200 OK or 500 Error

---

## Olabx API

### POST /api/olabx/get-token

Lấy Bearer token từ Google Whisk (Olabx).

**Description:**
- Khởi động Chrome browser
- Điều hướng tới https://labs.google/fx/vi/tools/whisk/library
- Lắng nghe request events
- Trích xuất Bearer token từ Authorization header

**Request Body:**
```json
{}
```

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "success": true,
    "token": "ya29.a0AfH6SMB1234567890..."
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Timeout: Could not get token after 220 seconds"
}
```

**Timeout:** 220 seconds  
**Status Code:** 200 OK or 500 Error

---

### POST /api/olabx-cookies/get-cookie

Lấy Set-Cookie header từ Olabx.

**Description:**
- Khởi động Chrome browser
- Điều hướng tới https://labs.google/fx/vi/tools/whisk/library
- Lắng nghe response events
- Trích xuất Set-Cookie header

**Request Body:**
```json
{}
```

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "success": true,
    "cookie": "__Secure-abc=def; Path=/; Secure; HttpOnly"
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Timeout: Could not get cookie after 30 seconds"
}
```

**Timeout:** 30 seconds  
**Status Code:** 200 OK or 500 Error

---

## Opal API

### POST /api/opal/get-token

Lấy Bearer token từ Google Opal.

**Description:**
- Khởi động Chrome browser
- Điều hướng tới https://opal.google/
- Lắng nghe request events
- Trích xuất Bearer token từ Authorization header

**Request Body:**
```json
{}
```

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "success": true,
    "token": "ya29.a0AfH6SMB9876543210...",
    "type": "google-opal"
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Timeout: Could not get token after 60 seconds"
}
```

**Timeout:** 60 seconds  
**Status Code:** 200 OK or 500 Error

---

## Error Handling

Tất cả errors trả về với status code 500 và message:

```json
{
  "success": false,
  "error": "Error message here"
}
```

**Common Errors:**
- `Timeout: Could not find cookie data after 60 seconds` - TikTok timeout
- `Timeout: Could not get token after 220 seconds` - Olabx token timeout
- `Timeout: Could not get cookie after 30 seconds` - Olabx cookie timeout
- `Timeout: Could not get token after 60 seconds` - Opal timeout
- Network errors (proxy issues, connectivity)
- Browser launch failures

---

## Usage Examples

### JavaScript/Fetch

```javascript
// Get TikTok Cookie
const response = await fetch('http://localhost:3050/api/tiktok/get-cookie', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
console.log(data.data.cookie);
```

### cURL

```bash
# Health check
curl http://localhost:3050/health

# Get TikTok Cookie
curl -X POST http://localhost:3050/api/tiktok/get-cookie \
  -H "Content-Type: application/json"

# Get Olabx Token
curl -X POST http://localhost:3050/api/olabx/get-token \
  -H "Content-Type: application/json"
```

### Python

```python
import requests

# Get TikTok Cookie
response = requests.post('http://localhost:3050/api/tiktok/get-cookie')
data = response.json()
print(data['data']['cookie'])
```

---

## Configuration

### Environment Variables

Set in `.env` file:

```env
PORT=3050
CHROME_PATH=/Applications/Google Chrome.app/Contents/MacOS/Google Chrome
```

### Proxy Configuration

Hardcoded in services (cần move to .env):
- Server: `tnetpx.smitbox.com:18084`
- Username: `k23fjgdf56tg`
- Password: `dfjh3233498jfg67d9`

---

## Performance Notes

- Mỗi request tạo một Chrome browser instance mới
- Browser automation có độ trễ cao (30-220 giây tùy service)
- Nên implement caching nếu tokens không thay đổi thường xuyên
- Rate limiting khuyến nghị để tránh quá tải server

---

## Troubleshooting

### Service không khởi động
- Kiểm tra Chrome path trong .env
- Kiểm tra port 3050 có bị chiếm không
- Kiểm tra logs: `npm run dev`

### Timeout errors
- Kiểm tra internet connection
- Kiểm tra proxy credentials
- Kiểm tra target website có accessible không
- Tăng timeout nếu cần

### Chrome crash
- Kiểm tra system resources (RAM, disk)
- Kiểm tra Chrome executable path
- Xóa `chrome-data/` directory và restart

---

## Latest Updates

- v1.0.0: Initial release
- Support for TikTok, Olabx, Opal
- Proxy support
- Anti-bot detection

