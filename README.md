# 📧 MailGen AI

**MailGen AI** is an advanced, full-stack AI cold email generator. Built to help job seekers, recruiters, and sales professionals generate high-converting outreach messages (Emails, LinkedIn DMs, and follow-ups) in seconds using the power of LLaMA 3 via the Groq API.

🚀 **Live Demo:** [https://a-i-cold-email-generator.vercel.app/](https://a-i-cold-email-generator.vercel.app/)

---

## ✨ Features

- **🧠 Advanced AI Generation**: Powered by Groq's insanely fast inference and LLaMA 3 to generate structured cold emails, follow-ups, and LinkedIn DMs.
- **🎛️ Tone & Framework Controls**: Guide the AI to use specific sales frameworks (AIDA, PAS, BAB) and tones (Professional, Humorous, Urgent, etc.).
- **🔒 Secure Authentication**: Email/Password login, OTP-based email verification, and a complete forgot-password flow with secure JWT sessions.
- **📊 Dashboard Analytics**: Track your generation activity with beautiful, interactive Recharts (activity charts, tone distributions, and framework usage).
- **🌗 Dark Mode**: A sleek, fully responsive UI with seamless light/dark mode toggling.
- **📱 Progressive Web App (PWA)**: Installable on mobile and desktop devices natively.
- **📥 Export Options**: Export your generated emails directly to PDF or TXT formats with one click.
- **🛡️ Rate Limiting**: Built-in protection to prevent spam and API abuse.

---

## 🛠️ Tech Stack

**Frontend:**
- React 19 + Vite
- Tailwind CSS (v4)
- React Router DOM
- Recharts (for Analytics)
- Heroicons & React Hot Toast

**Backend:**
- Node.js & Express
- MongoDB & Mongoose
- JSON Web Tokens (JWT) & bcryptjs
- Nodemailer (for OTP & password reset emails)
- Groq API (for AI inference)
- Express Rate Limit

---

## 🚀 Local Setup & Installation

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed and a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster running. You'll also need an API key from [Groq](https://console.groq.com/).

### 1. Clone the Repository
```bash
git clone https://github.com/Shivam-agarawal/A.I.-Cold-Email-Generator.git
cd A.I.-Cold-Email-Generator
```

### 2. Backend Setup
Navigate to the `server` directory and install dependencies:
```bash
cd server
npm install
```

Create a `.env` file in the `server` directory and add the following variables:
```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key

# Nodemailer setup (e.g., Gmail App Password)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_specific_password

# Groq AI Key
GROQ_API_KEY=your_groq_api_key
```

Start the backend server:
```bash
node server.js
```

### 3. Frontend Setup
Open a new terminal window, navigate to the frontend directory, and install dependencies:
```bash
cd client/"A.I Cold Email Generator"
npm install
```

Create a `.env` file in the frontend root and add:
```env
VITE_API_URL=http://localhost:3000/api
```

Start the Vite development server:
```bash
npm run dev
```

The app will now be running on `http://localhost:5173`.

---

## 🌐 API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register a new user and send OTP.
- `POST /login` - Authenticate user and return JWT.
- `POST /verify-otp` - Verify email using the OTP.
- `POST /forgot-password` - Send password reset OTP.
- `POST /reset-password` - Reset password using OTP.

### AI Generation & History (`/api/ai`)
- `POST /generate-email` - Generate an email based on prompt, tone, and framework.
- `GET /history` - Retrieve the user's past generations.
- `GET /stats` - Fetch aggregated analytics data for the dashboard.

---

## 💡 Usage

1. Create an account and verify your email via the OTP sent to your inbox.
2. Navigate to the **Dashboard**.
3. Select your desired Tone and Framework.
4. Enter a brief prompt (e.g., *"Software Engineer looking for a backend role at a scaling startup"*).
5. Hit **Generate Output** and watch the AI instantly craft your outreach templates.
6. Copy the results or export them to PDF/TXT.

---

## 📝 License
This project is open-source and available under the MIT License.
