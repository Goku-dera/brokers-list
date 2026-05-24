# Woxa — Broker CRUD Platform

ระบบจัดการ Broker (NestJS + Next.js + PostgreSQL + Redis)

## สิ่งที่ต้องมี

- [Docker Desktop](https://www.docker.com/products/docker-desktop)

## รันทั้งโปรเจกต์ (แนะนำ)

จากโฟลเดอร์ root ของโปรเจกต์:

```bash
docker compose up --build
```

รอจน container ขึ้นครบ แล้วเปิด:

| บริการ | URL |
|--------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:3001 |
| PostgreSQL (จากเครื่อง host) | `localhost:5433` |
| Redis (จากเครื่อง host) | `localhost:6379` |

หยุดระบบ:

```bash
docker compose down
```

ลบ volume ข้อมูล DB ด้วย (ระวังข้อมูลหาย):

```bash
docker compose down -v
```

---

## โครงสร้าง Docker

```
postgres  → ฐานข้อมูล (port 5433 บน host)
redis     → แคชรายการ brokers (port 6379)
backend   → API NestJS (port 3001)
frontend  → Next.js (port 3000)
```

Backend รอ `postgres` และ `redis` healthy ก่อนจึง start

---

## Redis Cache (รายการ Brokers)

ใช้แคชเฉพาะ `GET /api/brokers` (รวม search / filter)

| สถานการณ์ | พฤติกรรม |
|-----------|----------|
| มี cache | ตอบจาก Redis ไม่ query DB |
| ไม่มี cache | query DB แล้วเก็บ cache |
| Redis ล่ม / ต่อไม่ได้ | query DB ตามปกติ (ไม่ error) |
| สร้าง / แก้ / ลบ broker | ลบ cache ทั้งหมด แล้ว warm cache รายการหลักใหม่ |

---

## รัน Dev บนเครื่อง (ไม่ใช้ Docker สำหรับ app)

### 1. เปิด DB + Redis ด้วย Docker

```bash
docker compose up postgres redis -d
```

### 2. Backend

```bash
cd crud-backend
cp .env.example .env   # ถ้ายังไม่มี .env
npm install
npm run migration:run
npm run start:dev
```

ค่าใน `crud-backend/.env` สำหรับ dev:

```env
DB_HOST=localhost
DB_PORT=5433
REDIS_HOST=localhost
REDIS_PORT=6379
```

### 3. Frontend

```bash
cd crud-frontend
npm install
npm run dev
```

เปิด http://localhost:3000

---

## หน้าเว็บหลัก

| หน้า | URL | หมายเหตุ |
|------|-----|----------|
| รายการ Broker | `/brokers` | ค้นหา + filter (ยิง API พร้อม debounce) |
| รายละเอียด | `/brokers/[slug]` | ดูได้โดยไม่ต้อง login |
| Login | `/login` | login แล้วเข้า `/login` จะไป dashboard |
| Register | `/register` | สมัครสมาชิก |
| Dashboard | `/dashboard` | ต้อง login |
| เพิ่ม Broker | `/brokers/add` | ต้อง login |
| แก้ Broker | `/brokers/[slug]/edit` | ต้อง login |

---

## API หลัก

| Method | Path | Auth |
|--------|------|------|
| GET | `/api/brokers?search=&type=` | ไม่ต้อง |
| GET | `/api/brokers/:slug` | ไม่ต้อง |
| POST | `/api/brokers` | JWT |
| PUT | `/api/brokers/:slug` | JWT |
| DELETE | `/api/brokers/:slug` | JWT |
| POST | `/api/login` | ไม่ต้อง |
| POST | `/api/register` | ไม่ต้อง |

---

## โครงสร้างโปรเจกต์

```
woxa/
├── docker-compose.yml
├── crud-backend/          # NestJS API
│   ├── .env               # config ตอน dev
│   └── src/
│       ├── brokers/
│       └── redis/
└── crud-frontend/         # Next.js
    └── app/
```

---

## แก้ปัญหาเบื้องต้น

**Frontend ต่อ Backend ไม่ได้**  
- Docker: ใช้ `http://localhost:3001`  
- ตรวจว่า container `woxa_backend` รันอยู่

**Migration ไม่รัน**  
```bash
cd crud-backend
npm run migration:run
```

**Redis ไม่ทำงาน**  
- API ยังใช้ได้ (อ่านจาก DB)  
- ตรวจ `docker compose ps` ว่า `woxa_redis` healthy
