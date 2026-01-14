# Hướng dẫn Setup Supabase

## 📋 Bước 1: Lấy Database Credentials từ Supabase

### Cách 1: Lấy Connection String (Khuyến nghị)

1. Vào [Supabase Dashboard](https://app.supabase.com)
2. Chọn project của bạn
3. Vào **Settings** (biểu tượng ⚙️) → **Database**
4. Scroll xuống phần **Connection string**
5. Chọn tab **Connection pooling** (khuyến nghị cho production)
6. Copy connection string, nó sẽ có dạng:
   ```
   postgresql://postgres.[project-ref]:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
   ```

### Cách 2: Lấy từng thông tin riêng lẻ

Trong cùng trang **Settings** → **Database**, bạn sẽ thấy:
- **Host**: `db.xxxxx.supabase.co`
- **Database name**: `postgres`
- **Port**: `5432` (direct) hoặc `6543` (pooler)
- **User**: `postgres`
- **Password**: [Nhấn "Reset database password" nếu quên]

## 🔧 Bước 2: Cấu hình `.env`

### Option A: Dùng Connection String (Đơn giản nhất)

Tạo file `.env` từ `.env.example`:
```bash
cp .env.example .env
```

Mở `.env` và cập nhật:
```env
# Server Configuration
PORT=3001
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=*

# Supabase Database Connection
DATABASE_URL=postgresql://postgres.[project-ref]:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres

# SSL Configuration
SUPABASE_DB_SSL=true

# Connection Pool
DB_POOL_MIN=2
DB_POOL_MAX=10
```

### Option B: Dùng từng parameter riêng

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=*

# Supabase Database Configuration
SUPABASE_DB_HOST=db.xxxxx.supabase.co
SUPABASE_DB_PORT=6543
SUPABASE_DB_NAME=postgres
SUPABASE_DB_USER=postgres
SUPABASE_DB_PASSWORD=your-database-password
SUPABASE_DB_SSL=true

# Connection Pool
DB_POOL_MIN=2
DB_POOL_MAX=10
```

## ⚠️ Lưu ý quan trọng

### Project URL vs Database Connection

- **Project URL** (`https://xxxxx.supabase.co`): Dùng cho Supabase Client API (Auth, Storage, Realtime)
- **Database Connection**: Dùng để kết nối trực tiếp với PostgreSQL database (Knex, pg)

Hiện tại backend đang dùng **Knex** để kết nối database, nên cần **Database Connection**, không phải Project URL.

### API Keys

- **Anon/Public Key**: Dùng cho frontend, có thể public
- **Service Role Key**: Dùng cho backend, cần giữ bí mật
- **Database Password**: Dùng để kết nối database trực tiếp

### Port Selection

- **Port 5432**: Direct connection (có thể bị giới hạn số lượng connections)
- **Port 6543**: Connection pooling (khuyến nghị, xử lý nhiều connections tốt hơn)

## 🚀 Bước 3: Test Connection

Sau khi cấu hình xong, test kết nối:

```bash
npm run dev
```

Nếu thành công, bạn sẽ thấy:
```
Attempting database connection (1/3)...
✅ Database connected successfully
=================================
🚀 Server is running!
📍 Environment: development
🌐 Port: 3001
🔗 URL: http://localhost:3001
💚 Health: http://localhost:3001/health
📚 API: http://localhost:3001/api
=================================
```

Test health check:
```bash
curl http://localhost:3001/health
```

Response sẽ có database status:
```json
{
  "success": true,
  "status": "healthy",
  "services": {
    "api": { "status": "healthy" },
    "database": {
      "status": "connected",
      "responseTime": "25ms"
    }
  }
}
```

## 🔍 Troubleshooting

### Lỗi: "Connection timeout"

**Nguyên nhân**: IP của bạn chưa được whitelist

**Giải pháp**:
1. Vào Supabase Dashboard → **Settings** → **Database**
2. Scroll xuống **Connection pooling**
3. Thêm IP của bạn vào whitelist (hoặc chọn "Allow all IPs" cho development)

### Lỗi: "password authentication failed"

**Nguyên nhân**: Password không đúng

**Giải pháp**:
1. Vào Supabase Dashboard → **Settings** → **Database**
2. Nhấn **Reset database password**
3. Copy password mới và update vào `.env`

### Lỗi: "SSL connection error"

**Nguyên nhân**: SSL không được cấu hình đúng

**Giải pháp**: Đảm bảo `SUPABASE_DB_SSL=true` trong `.env`

## 📚 Tài liệu tham khảo

- [Supabase Database Documentation](https://supabase.com/docs/guides/database)
- [Knex.js Documentation](https://knexjs.org/)
- [PostgreSQL Connection Strings](https://www.postgresql.org/docs/current/libpq-connect.html#LIBPQ-CONNSTRING)
