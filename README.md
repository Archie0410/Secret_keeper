# 🔐 Secret Keeper – Secure User Authentication App

Secret Keeper is a secure web application where users can register, log in, and share their secrets privately. Each user can only view their own secrets, ensuring privacy and security. The app uses JWT authentication and bcrypt password hashing, with data stored securely on MongoDB Atlas.

---

## 🚀 Live Demo

🌐 **Deployed on Render**: [Add your deployed URL here]

---

## 📌 Features

- User Registration with validation (name, email, password)
- Email format and password strength verification
- Password hashing with bcrypt for secure storage
- JWT-based authentication with HttpOnly cookies
- Protected routes ensuring only logged-in users can access secrets
- Users can view and submit their own secrets, hidden from others
- Responsive, clean UI built with EJS templates and CSS
- Data persistence on MongoDB Atlas
- Deployed on Render for seamless hosting

---

## 🏗️ Tech Stack

- Node.js, Express.js
- MongoDB Atlas with Mongoose
- EJS templating engine
- bcrypt for password hashing
- JSON Web Tokens (JWT) for authentication
- HttpOnly cookies for session security
- CSS for styling

---

## 📦 Installation and Setup

1. **Clone the repo**

```bash
git clone https://github.com/Archie0410/Secret_keeper.git
cd Secret_keeper
