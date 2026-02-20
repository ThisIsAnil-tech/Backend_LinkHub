# ⚙️ LinkHub Backend

The backend of **LinkHub**, a lightweight full-stack link manager with authentication, file uploads, analytics tracking, and JSON-based storage.

Built with **Node.js + Express**, it provides APIs for managing admins, links, and uploaded assets.

---

## 🚀 Features

### 🔐 Authentication
- Admin registration API
- Secure login with JWT
- Password hashing with bcrypt
- Session validation middleware
- Update email/password endpoint

---

### 🔗 Link Management APIs
- Add link with logo upload
- Delete link
- Visibility support
- Category support
- Click tracking endpoint
- JSON-based persistence

---

### 🖼 File Handling
- Logo uploads using multer
- Stored locally on server
- Auto-deleted when link removed
- Static route for public access

---

### 📊 Analytics
- Click count stored per link
- Popular links tracking
- Backend sorting support

---

### 💾 Storage System
- JSON database for links
- JSON database for admins
- Safe read/write helpers
- Crash-safe fallback logic

---

## 🛠 Tech Stack

- Node.js
- Express.js
- Multer (uploads)
- bcryptjs (password hashing)
- jsonwebtoken (JWT)
- fs (file storage)

---