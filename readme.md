# 🔐 Node.js Auth Workflow

![Node.js](https://img.shields.io/badge/Node.js-22.x-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.x-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![License](https://img.shields.io/badge/License-ISC-blue)
![Status](https://img.shields.io/badge/Status-In%20Progress-orange)

A production-inspired **Authentication Workflow** built with **Node.js**, **Express.js 5**, **MongoDB Atlas**, and a **React** frontend.

This project demonstrates how modern authentication systems work using **JWT Authentication**, **Access & Refresh Tokens**, **HTTP-Only Cookies**, **Email Verification**, **Forgot Password**, **Password Reset**, **Session Management**, and **Secure Token Storage**.

It is built by extending my previous **E-Commerce REST API** project and focuses entirely on implementing a secure authentication architecture commonly used in production applications.

---

# 🌐 Live Demo

### 🚀 Frontend

https://react-node-user-workflow-front-end.netlify.app/

---

# ✨ Features

## 🔐 Authentication

- User Registration
- User Login
- Logout
- Email Verification
- Forgot Password
- Reset Password
- JWT Authentication
- Access Token
- Refresh Token
- HTTP-Only Cookie Authentication
- Signed Cookies

---

## 👤 User Management

- Email Verification Flow
- Account Verification Status
- Password Hashing
- Password Reset Tokens
- Session Persistence

---

## 📧 Email Services

- Verification Email
- Reset Password Email
- Ethereal Email Testing
- Nodemailer Integration

---

## 🍪 Session Management

- Refresh Token Persistence
- Token Database
- Existing Session Detection
- Device Tracking
- IP Tracking
- User-Agent Tracking
- Secure Logout

---

## 🗄️ Database Features

- MongoDB Atlas
- Mongoose Models
- Schema Validation
- Password Hashing (bcrypt)
- Token Relationships
- Middleware Hooks

---

## 🛡️ Security

- JWT Authentication
- Access & Refresh Token Strategy
- HTTP-Only Cookies
- Signed Cookies
- Helmet
- Rate Limiting
- CORS
- Input Validation
- Secure Random Token Generation
- Token Hashing

---

# 🛠️ Tech Stack

## Backend

- Node.js
- Express.js 5

## Frontend

- React 18
- React Router v5
- Axios
- Styled Components

## Database

- MongoDB Atlas
- Mongoose

## Authentication

- JSON Web Tokens (JWT)
- bcrypt

## Email

- Nodemailer
- Ethereal Email

## Security

- Helmet
- express-rate-limit
- cookie-parser
- CORS

## Logging

- Morgan

---

# 📂 Project Structure

```text
auth-workflow/
│
├── client/
│   ├── public/
│   ├── src/
│   └── package.json
│
├── server/
│   ├── controllers/
│   ├── db/
│   ├── errors/
│   ├── middleware/
│   ├── models/
│   ├── public/
│   ├── routes/
│   ├── utils/
│   ├── app.js
│   └── package.json
│
├── .gitignore
└── README.md
```

---

# 🔄 Authentication Workflow

## User Registration

- Register a new account
- Password is hashed using bcrypt
- First registered user becomes Admin
- Generate a secure verification token
- Send verification email

---

## Email Verification

- Verify email using secure token
- Activate account
- Store verification timestamp
- Remove verification token after successful verification

---

## Login

- Validate credentials
- Check email verification status
- Generate Access Token
- Generate Refresh Token
- Store Refresh Token in MongoDB
- Send HTTP-Only cookies

---

## Session Management

- Reuse existing valid refresh tokens
- Store session information
- Track device information
- Track IP Address
- Track User-Agent

---

## Logout

- Delete refresh token
- Clear authentication cookies
- Invalidate current session

---

## Forgot Password

- Generate secure password reset token
- Hash token before storing
- Send reset email
- Store token expiration

---

## Reset Password

- Validate reset token
- Verify expiration time
- Update password
- Remove reset token
- Clear expiration date

---

# 📦 Database Models

## User

```javascript
name
email
password
role

verificationToken
isVerified
verified

passwordToken
passwordTokenExpirationDate
```

---

## Token

```javascript
refreshToken
ip
userAgent
isValid
user

timestamps
```

---

# 📧 Email Utilities

```
utils/

nodemailerConfig.js
sendEmail.js
sendVerificationEmail.js
sendResetPasswordEmail.js
```

---

# 🔐 Security Features

- bcrypt Password Hashing
- JWT Authentication
- Access Token
- Refresh Token
- HTTP-Only Cookies
- Signed Cookies
- Helmet Security Headers
- Rate Limiting
- Secure Logout
- Email Verification
- Password Reset
- Token Hashing
- Secure Random Token Generation using Node Crypto

---

# 🔑 Token Hashing

Sensitive tokens are hashed before storing in MongoDB.

Example utility:

```javascript
import crypto from "crypto";

function hashString(string) {
  return crypto.createHash("md5").update(string).digest("hex");
}

export default hashString;
```

---

# ⚙️ Installation

## Clone the repository

```bash
git clone https://github.com/iamskyy666/nodejs-auth-workflow.git
```

```bash
cd nodejs-auth-workflow
```

---

## Install Backend Dependencies

```bash
cd server
npm install
```

---

## Install Frontend Dependencies

```bash
cd ../client
npm install
```

---

## Create `.env`

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_super_secret_key

JWT_LIFETIME=15m

REFRESH_TOKEN_LIFETIME=30d

NODE_ENV=development

SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
```

---

## Run Backend

```bash
cd server
npm run dev
```

---

## Run Frontend

```bash
cd client
npm start
```

---

# 🔗 Related Project

This authentication system builds upon my previous project:

**🛒 Node.js E-Commerce REST API**

https://github.com/iamskyy666/nodejs-ecommerce-api

The E-Commerce API focuses on products, reviews, orders, authorization, uploads, and Swagger documentation, while this project dives deeper into production-style authentication workflows.

---

# 🚀 Future Improvements

- Google OAuth
- GitHub OAuth
- Multi-Factor Authentication (MFA)
- Refresh Token Rotation
- Redis Session Store
- Docker Support
- Unit & Integration Testing
- GitHub Actions CI/CD
- Account Lockout Protection
- Login History
- Session Dashboard

---

# 📷 Screenshots

Screenshots of the application, authentication flow, MongoDB collections, email previews, and Postman API testing will be added soon.

---

# 👨‍💻 Author

**Soumadip Banerjee**

Backend Developer • MERN Stack Developer

GitHub:

https://github.com/iamskyy666

---

# ⭐ Support

If you found this project useful, consider giving it a **⭐ Star** on GitHub.

It helps others discover the project and motivates future improvements.

---

# 📄 License

This project is licensed under the **ISC License**.
