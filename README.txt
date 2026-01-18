# API Rate Limit Management System

## 🚀 วิธีติดตั้งและรัน

```bash
# Install dependencies
npm install

# Run the dev
npm run dev

# Run the staging
npm run staging

# Run the production
npm run prod
```

Server จะรันที่ `http://localhost:3000`

## 📡 API Endpoints

### 1. สร้าง User ใหม่
```bash
POST /api/users
Content-Type: application/json

{
  "userId": "testuser",
  "tier": "free"  // หรือ "standard", "premium"
}
```

**Response:**
```json
{
    "success": true,
    "message": "User created successfully",
    "user": {
        "userId": "testuser",
        "tier": "free",
        "limits": {
            "hourly": 100,
            "daily": 1000
        }
    },
    "timestamp": "2026-01-17T07:00:13.685Z"
}
```

### 2. ดึง user
```bash
GET /api/users
Header: x-user-id: testuser
{
    "success": true,
    "user": {
        "userId": "testuser",
        "tier": "free",
        "limits": {
            "hourly": 100,
            "daily": 1000
        }
    }
}

### 3. ดึงข่าวสาร (มี Rate Limit)
```bash
GET /api/news
Header: x-user-id: user123
```
**Response:**
```json
{
    "success": true,
    "total": 20,
    "totalPages": 4,
    "currentPage": 1,
    "perPage": 5,
    "data": [
        {
            "id": 1,
            "title": "Breaking: AI Advances in 2025",
            "content": "Artificial Intelligence continues to evolve with new breakthroughs...",
            "publishedAt": "2025-01-01T08:00:00.000Z",
            "category": "Technology"
        },
        {
            "id": 2,
            "title": "Global Markets Update",
            "content": "Stock markets show positive trends across major indices...",
            "publishedAt": "2025-01-02T09:10:00.000Z",
            "category": "Finance"
        },
        {
            "id": 3,
            "title": "Climate Summit Concludes",
            "content": "World leaders agree on new climate initiatives...",
            "publishedAt": "2025-01-03T10:00:00.000Z",
            "category": "Environment"
        },
        {
            "id": 4,
            "title": "Tech Startup Raises $50M",
            "content": "Innovative startup secures major funding round...",
            "publishedAt": "2025-01-04T11:20:00.000Z",
            "category": "Business"
        },
        {
            "id": 5,
            "title": "Space Exploration Milestone",
            "content": "New discoveries in deep space exploration...",
            "publishedAt": "2025-01-05T12:00:00.000Z",
            "category": "Science"
        }
    ]
}
```

**เมื่อเกิน Rate Limit:**
```json
{
    "error": "Hourly rate limit exceeded",
    "limit": 100,
    "remaining": 0
}
```

### 3. ตรวจสอบ Quota ที่เหลือ
```bash
GET /api/quota
Header: x-user-id: user123
```

**Response:**
```json
{
    "success": true,
    "userId": "testuser",
    "tier": "free",
    "quota": {
        "hourly": {
            "limit": 100,
            "used": 0,
            "remaining": 100
        },
        "daily": {
            "limit": 1000,
            "used": 0,
            "remaining": 1000
        }
    },
    "timestamp": "2026-01-17T07:07:07.418Z"
}
```

## 🧪 ทดสอบด้วย cURL

```bash
# 1. สร้าง user
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"userId":"testuser","tier":"free"}'

# 2. ดึงข้อมูล user
curl -X GET http://localhost:3000/api/users \
  -H "x-user-id: testuser"

# 3. ดึงข่าว (มี Rate Limit)
curl -X GET http://localhost:3000/api/news \
  -H "x-user-id: testuser"

# 4. เช็ค quota
curl -X GET http://localhost:3000/api/quota \
  -H "x-user-id: testuser"
```


## 💾 Data Storage

ใช้ in-memory Map สำหรับเก็บข้อมูล (ข้อมูลจะหายเมื่อ restart server)

## ⚙️ การทำงานของ Rate Limit

- ระบบจะนับจำนวน request ต่อชั่วโมง และต่อวัน
- เมื่อข้ามชั่วโมงใหม่ → reset hourly counter
- เมื่อข้ามวันใหม่ → reset daily counter
- เมื่อเกิน limit → return HTTP 429

## 🔒 Error Codes

- `400` - Bad Request (ไม่มี x-user-id header)
- `404` - User Not Found
- `409` - User Already Exists
- `429` - Rate Limit Exceeded

