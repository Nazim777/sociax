# 🚀 Node.js + Express + TypeScript + MongoDB API Boilerplate

A production-ready backend starter built with **Node.js**, **Express 5**, **TypeScript**, and **MongoDB (Mongoose)**. This project follows modern backend **best practices**, clean architecture, and scalability patterns suitable for real-world applications (auth, uploads, validation, logging, etc.).

---

## ✨ Features

* ⚡ Express 5 with TypeScript
* 🧩 Modular & scalable project structure
* 🔐 Authentication with JWT & bcrypt
* 🧪 Request validation using Zod
* 🗂 MongoDB with Mongoose
* ☁️ File upload support (Multer + Cloudinary)
* 🍪 Cookie-based auth support
* 🌍 CORS & IP tracking
* 📜 Centralized error handling
* 🧠 Environment-based configuration
* 🧾 Logging with Morgan
* 🔁 Absolute imports using module-alias

---



## 🛠 Tech Stack

* **Runtime**: Node.js
* **Framework**: Express 5
* **Language**: TypeScript
* **Database**: MongoDB + Mongoose
* **Auth**: JWT, bcrypt
* **Validation**: Zod
* **Uploads**: Multer, Cloudinary
* **Logging**: Morgan

---

## 📦 Installation

```bash
# Clone the repo
git clone https://github.com/Nazim777/sociax.git

# Install dependencies
npm install
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
NODE_ENV=development
APP_NAME=Conexa
AUTHOR=MOHAMMADNAZIM
HOST=localhost
PORT=8080
SECRET=SUPERSECRET
MONGO_URI=

CLOUDINARY_CLOUD_NAME=djktvs2yq
CLOUDINARY_API_KEY=842923549173773
CLOUDINARY_API_SECRET=qYw3z_3LRbUS6QTFUzdwTxElKFc
ACCESS_TOKEN_EXPIRES=2h
REFRESH_TOKEN_EXPIRES=7d
```

---

## ▶️ Running the Project

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Production

```bash
npm start
```

---

## 📜 Scripts

```json
"scripts": {
  "dev": "nodemon --watch src --exec ts-node ./src/server.ts",
  "build": "tsc",
  "start": "node dist/server.js"
}
```

---

## 🔑 Best Practices Used

### ✅ Architecture

* Feature-based modular structure
* Separation of concerns (controller / service / route)
* Centralized error handling

### ✅ Security

* Password hashing with bcrypt
* JWT-based authentication
* Environment variables for secrets
* HTTP status codes via `http-status-codes`

### ✅ Type Safety

* Strict TypeScript configuration
* Zod schemas for runtime validation
* Global types for request extensions

### ✅ Code Quality

* Async error handler wrapper
* Clean response helpers
* Absolute imports using `@/` alias

---

## 📤 File Upload Flow

1. Multer handles multipart/form-data
2. Cloudinary stores the file
3. URL saved in MongoDB

```ts
upload.single("image")
```

---

## ❌ Error Handling Pattern

```ts
throw new AppError(StatusCodes.UNAUTHORIZED, "Invalid token");
```

Handled centrally in:

```ts
error.middleware.ts
```

---

## 📌 API Response Format

```json
{
  "success": true,
  "message": "Request successful",
  "data": {}
}
```

---

## 🚀 Future Improvements

* 🧪 Unit & integration testing (Jest)
* 📘 Swagger / OpenAPI docs
* 🐳 Docker support
* 🔄 Refresh token flow
* 🧠 Rate limiting

---

## 👨‍💻 Author

**Mohammad Nazim Hossain**
Full-Stack Developer

---

## ⭐ Support

If you find this project helpful, consider giving it a ⭐ on GitHub.

Happy coding! 🎉
