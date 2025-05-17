# 🔐 Secrets – Secure User Authentication App

Secrets is a secure web application where users can register, log in, and share their secrets. Each user can only view their own secrets. The app demonstrates modern authentication practices using JWT and password hashing, with persistent cloud data storage using MongoDB Atlas.

---

## 🚀 Live Demo

🌐 **Deployed on Render**: [Add your deployed URL here]  

---

## 📌 Features

- ✅ **User Registration** with name, email, and strong password
- 🔍 **Email Format Validation** (e.g., `example@mail.com`)
- 🔐 **Password Validation**
  - 6–8 characters
  - At least 1 uppercase letter
  - At least 1 lowercase letter
  - At least 1 number
- 🔑 **Password Hashing** using bcrypt
- 🔐 **JWT-based Authentication**
- 🛡 **HttpOnly Cookies** for session security
- 🔒 **Protected Routes** for secrets and user details
- 🙈 **Users only see their own secrets**
- 🎨 **Clean and Responsive UI** (EJS + CSS)
- ☁️ **MongoDB Atlas** for cloud data storage
- 🚀 **Deployed on Render**

---

## 🏗️ Tech Stack

- **Backend**: Node.js, Express.js
- **Frontend**: EJS Templates, CSS
- **Authentication**: JWT + bcrypt
- **Database**: MongoDB Atlas (via Mongoose)
- **Session Management**: HttpOnly Cookies
- **Deployment**: Render

---

## 📦 Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/secrets-app.git
   cd secrets-app
