# API Testing Guide

## 📋 Postman Collection

Dự án đã tạo sẵn Postman collection và environment để test API.

### Files:

- `postman-collection.json` - Collection chứa tất cả API endpoints
- `postman-environment.json` - Environment variables cho development

## 🚀 Import vào Postman

### 1. Import Collection:

1. Mở Postman
2. Click **Import**
3. Chọn file `postman-collection.json`
4. Click **Import**

### 2. Import Environment:

1. Click biểu tượng **Environment** (bánh răng) ở góc phải
2. Click **Import**
3. Chọn file `postman-environment.json`
4. Click **Import**
5. Chọn **Development Environment** làm active environment

## 📝 Test Flow - OTP Email Verification

### Bước 1: Đăng ký tài khoản

- **Endpoint**: `POST /accounts/register`
- **Body**:

```json
{
  "kind": 1,
  "username": "testuser",
  "email": "your-email@gmail.com",
  "password": "password123",
  "fullName": "Test User",
  "phone": "0123456789",
  "groupId": 1
}
```

- **Expected**: Nhận email chứa mã OTP 6 số

### Bước 2: Xác thực OTP

- **Endpoint**: `POST /accounts/verify-otp`
- **Body**:

```json
{
  "email": "your-email@gmail.com",
  "otpCode": "123456"
}
```

- **Expected**: Tài khoản được kích hoạt

### Bước 3: Đăng nhập

- **Endpoint**: `POST /accounts/login`
- **Body**:

```json
{
  "usernameOrEmail": "your-email@gmail.com",
  "password": "password123"
}
```

- **Expected**: Nhận access token (tự động lưu vào environment)

### Bước 4: Test các API khác

- Sử dụng token đã lưu để gọi các API cần authentication
- Token sẽ tự động được thêm vào header

## 🔧 Environment Variables

| Variable       | Description            | Example                                   |
| -------------- | ---------------------- | ----------------------------------------- |
| `baseUrl`      | API base URL           | `http://localhost:3000`                   |
| `accessToken`  | JWT token (auto-saved) | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `testEmail`    | Email for testing      | `test@example.com`                        |
| `testUsername` | Username for testing   | `testuser`                                |
| `testPassword` | Password for testing   | `password123`                             |
| `testOtp`      | OTP code placeholder   | `123456`                                  |

## 📧 Email Configuration

Để test OTP email, cần cấu hình SMTP trong file `.env`:

```env
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@yourapp.com
```

### Gmail Setup:

1. Bật 2-Factor Authentication
2. Tạo App Password: [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
3. Sử dụng App Password thay vì password thường

## 🚦 API Endpoints

### Authentication

- `POST /accounts/register` - Đăng ký + gửi OTP
- `POST /accounts/verify-otp` - Xác thực OTP
- `POST /accounts/resend-otp` - Gửi lại OTP
- `POST /accounts/login` - Đăng nhập

### Account Management

- `GET /accounts/list` - Danh sách tài khoản (cần auth)

### Groups & Permissions

- `GET /groups` - Danh sách nhóm
- `GET /permissions` - Danh sách quyền

### Documentation

- `GET /swagger-ui.html` - Swagger UI
- `GET /` - Health check

## 🐛 Troubleshooting

### Lỗi thường gặp:

1. **"Username or email already exists"**
   - Đổi username/email khác
   - Hoặc xóa tài khoản cũ trong database

2. **"Failed to send OTP email"**
   - Kiểm tra cấu hình SMTP trong `.env`
   - Kiểm tra kết nối internet
   - Kiểm tra Gmail App Password

3. **"Email not verified"** khi login
   - Phải verify OTP trước khi login
   - Kiểm tra email để lấy mã OTP

4. **"OTP has expired"**
   - OTP có hiệu lực 5 phút
   - Sử dụng endpoint resend-otp để lấy mã mới

5. **"Invalid OTP code"**
   - Kiểm tra mã OTP trong email
   - Đảm bảo nhập đúng 6 số

## 📊 Response Format

Tất cả API response đều có format:

```json
{
  "data": {}, // actual data
  "message": "Success message",
  "statusCode": 200,
  "timestamp": "2025-11-13T10:30:00.000Z"
}
```
