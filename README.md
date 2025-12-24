<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# PDF Cropper Uploader - Ứng dụng cắt và tải PDF

Ứng dụng React cho phép người dùng cắt và xử lý file PDF với giao diện thân thiện.

Xem ứng dụng trên AI Studio: https://ai.studio/apps/drive/1jZpySX4KRBp1fg1PBOjIGz7ey9NqBBO7

---

## 🚀 Chạy ứng dụng trên Local

**Yêu cầu:** Node.js (phiên bản 16 trở lên)

### Các bước:

1. **Cài đặt dependencies:**
   ```bash
   npm install
   ```

2. **Cấu hình API key:**
   
   Tạo file `.env.local` (nếu chưa có) và thêm Gemini API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

3. **Chạy ứng dụng:**
   ```bash
   npm run dev
   ```

4. **Mở trình duyệt:** Truy cập `http://localhost:5173`

---

## 🌐 Deploy lên Web để người khác truy cập

Dưới đây là hướng dẫn deploy ứng dụng lên các nền tảng hosting miễn phí phổ biến.

### Phương pháp 1: Deploy lên Vercel (Khuyên dùng ⭐)

Vercel là lựa chọn tốt nhất cho React/Vite apps, dễ sử dụng và hoàn toàn miễn phí.

#### Bước 1: Chuẩn bị

1. Tạo tài khoản tại [vercel.com](https://vercel.com)
2. Push code lên GitHub (nếu chưa có):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/your-username/pdf-cropper-uploader.git
   git push -u origin main
   ```

#### Bước 2: Deploy trên Vercel

**Cách 1: Qua giao diện web**

1. Đăng nhập vào [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Chọn repository GitHub của bạn
4. Vercel sẽ tự động nhận diện Vite project
5. Thêm Environment Variable:
   - Key: `GEMINI_API_KEY`
   - Value: `your_gemini_api_key`
6. Click "Deploy"

**Cách 2: Qua CLI (Command Line)**

```bash
# Cài đặt Vercel CLI
npm install -g vercel

# Deploy
vercel

# Khi được hỏi, nhập thông tin:
# - Link to existing project? No
# - Project name: pdf-cropper-uploader
# - Directory: ./
# - Override settings? No

# Thêm environment variable
vercel env add GEMINI_API_KEY

# Deploy lên production
vercel --prod
```

✅ **Kết quả:** Bạn sẽ nhận được link dạng `https://pdf-cropper-uploader.vercel.app`

---

### Phương pháp 2: Deploy lên Netlify

Netlify cũng rất dễ sử dụng và có tính năng tự động deploy khi push code.

#### Bước 1: Tạo file cấu hình

Tạo file `netlify.toml` trong thư mục gốc của project:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### Bước 2: Deploy

**Cách 1: Qua giao diện web**

1. Đăng nhập vào [netlify.com](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Chọn repository GitHub
4. Cấu hình build:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Thêm Environment Variable:
   - Key: `GEMINI_API_KEY`
   - Value: `your_gemini_api_key`
6. Click "Deploy site"

**Cách 2: Qua CLI**

```bash
# Cài đặt Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy

# Khi được hỏi:
# - Create & configure a new site? Yes
# - Publish directory: dist

# Build trước khi deploy
npm run build

# Deploy lên production
netlify deploy --prod
```

✅ **Kết quả:** Link dạng `https://your-app-name.netlify.app`

---

### Phương pháp 3: Deploy lên GitHub Pages

Miễn phí và dễ dàng nếu bạn đã có GitHub repository.

#### Bước 1: Cài đặt gh-pages

```bash
npm install --save-dev gh-pages
```

#### Bước 2: Cập nhật package.json

Thêm vào file `package.json`:

```json
{
  "homepage": "https://your-username.github.io/pdf-cropper-uploader",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

#### Bước 3: Cập nhật vite.config.ts

Sửa file `vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/pdf-cropper-uploader/' // Tên repository của bạn
})
```

#### Bước 4: Deploy

```bash
npm run deploy
```

#### Bước 5: Cấu hình GitHub Pages

1. Vào repository trên GitHub
2. Settings → Pages
3. Source: chọn branch `gh-pages`
4. Save

> **⚠️ Lưu ý về API Key:**
> GitHub Pages không hỗ trợ environment variables server-side. Bạn cần:
> - Sử dụng API key tĩnh trong code (không an toàn cho production)
> - Hoặc chuyển sang Vercel/Netlify để bảo mật API key

✅ **Kết quả:** `https://your-username.github.io/pdf-cropper-uploader`

---

### Phương pháp 4: Deploy lên Render

Render cung cấp hosting miễn phí với nhiều tính năng.

#### Bước 1: Tạo file cấu hình

Tạo file `render.yaml`:

```yaml
services:
  - type: web
    name: pdf-cropper-uploader
    env: static
    buildCommand: npm install && npm run build
    staticPublishPath: dist
    envVars:
      - key: GEMINI_API_KEY
        sync: false
```

#### Bước 2: Deploy

1. Đăng nhập vào [render.com](https://render.com)
2. Click "New" → "Static Site"
3. Connect repository GitHub
4. Render sẽ tự động nhận diện cấu hình
5. Thêm Environment Variable
6. Deploy

✅ **Kết quả:** `https://pdf-cropper-uploader.onrender.com`

---

## 📋 So sánh các phương pháp

| Nền tảng | Độ dễ | Miễn phí | Tốc độ | Environment Variables | Khuyên dùng |
|----------|-------|----------|--------|----------------------|-------------|
| **Vercel** | ⭐⭐⭐⭐⭐ | ✅ | Rất nhanh | ✅ | ✅ Tốt nhất |
| **Netlify** | ⭐⭐⭐⭐⭐ | ✅ | Rất nhanh | ✅ | ✅ Tốt |
| **GitHub Pages** | ⭐⭐⭐⭐ | ✅ | Nhanh | ❌ | Chỉ demo |
| **Render** | ⭐⭐⭐⭐ | ✅ | Trung bình | ✅ | Tốt |

---

## 🔒 Bảo mật API Key

### ⚠️ Quan trọng:

- **KHÔNG BAO GIỜ** commit file `.env.local` lên Git
- Đảm bảo `.env.local` nằm trong `.gitignore`
- Sử dụng Environment Variables trên nền tảng hosting
- Với Vercel/Netlify: Thêm `GEMINI_API_KEY` trong dashboard

### Kiểm tra .gitignore

File `.gitignore` phải có:
```
.env.local
.env
```

---

## 🛠 Troubleshooting

### Lỗi "API key not found"
- Kiểm tra đã thêm `GEMINI_API_KEY` trong environment variables chưa
- Với Vercel/Netlify: Sau khi thêm env var, cần redeploy

### Build failed
```bash
# Xóa cache và build lại
rm -rf node_modules dist
npm install
npm run build
```

### Trang trắng sau khi deploy
- Kiểm tra `base` trong `vite.config.ts`
- Kiểm tra đường dẫn trong console browser (F12)

---

## 📞 Hỗ trợ

Nếu gặp vấn đề, hãy:
1. Kiểm tra logs trên nền tảng hosting
2. Chạy `npm run build` local để test
3. Xem console browser (F12) để debug

---

## 📝 License

MIT License - Tự do sử dụng cho mục đích cá nhân và thương mại.
