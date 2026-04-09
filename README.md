# AI Customer Chatbot System

Full-stack MERN chatbot powered by OpenAI GPT-4o or Anthropic Claude.

## Stack
- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Node.js + Express
- **Database:** MongoDB Atlas
- **Auth:** JWT + bcrypt
- **AI:** OpenAI GPT-4o or Anthropic Claude API
- **Deploy:** Vercel (frontend) + Render (backend)

---

## Project Structure

```
chatbot/
├── src/                        # React frontend
│   ├── pages/
│   │   ├── LandingPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── ChatPage.jsx
│   │   └── AdminPage.jsx
│   ├── components/
│   │   ├── MessageBubble.jsx
│   │   └── TypingIndicator.jsx
│   ├── services/
│   │   └── api.js              # Axios instance
│   ├── store/
│   │   └── authStore.js        # Zustand auth state
│   ├── App.jsx
│   └── main.jsx
│
├── api/                        # Express backend
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── chatController.js
│   │   └── adminController.js
│   ├── models/
│   │   ├── User.js
│   │   └── Conversation.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── chat.js
│   │   └── admin.js
│   ├── middleware/
│   │   └── auth.js
│   ├── services/
│   │   ├── aiService.js
│   │   └── jwtService.js
│   ├── index.js
│   ├── package.json
│   └── .env.example
│
├── vercel.json
├── vite.config.js
└── package.json
```

---

## Local Setup

### 1. Clone and install

```bash
# Frontend dependencies (root)
npm install

# Backend dependencies
cd api && npm install
```

### 2. Configure environment

```bash
cd api
cp .env.example .env
# Edit .env with your values:
#   MONGO_URI       — MongoDB Atlas connection string
#   JWT_SECRET      — any long random string
#   OPENAI_API_KEY  — from platform.openai.com
#   AI_PROVIDER     — openai OR anthropic
```

### 3. Run locally

```bash
# Terminal 1 — Backend
cd api && npm run dev

# Terminal 2 — Frontend
npm run dev
```

Frontend: http://localhost:5173  
Backend:  http://localhost:5000

---

## Create Admin User

After registering normally, open MongoDB Atlas and set `role: "admin"` on your user document manually, or run:

```js
// In MongoDB Atlas → Collections → chatbot.users
// Update one document:
{ $set: { role: "admin" } }
```

---

## Deploy to Vercel + Render

### Frontend → Vercel
1. Push to GitHub
2. Import repo on vercel.com
3. Set environment variable: `VITE_API_URL` (if using separate backend)
4. Deploy

### Backend → Render
1. Create new Web Service on render.com
2. Point to `/api` folder
3. Set all `.env` variables in Render dashboard
4. Start command: `node index.js`

### Database → MongoDB Atlas
1. Create free M0 cluster at cloud.mongodb.com
2. Add database user
3. Whitelist `0.0.0.0/0` under Network Access
4. Copy connection string into `MONGO_URI`

---

## API Endpoints

| Method | Route                      | Auth    | Description             |
|--------|----------------------------|---------|-------------------------|
| POST   | /api/auth/register         | Public  | Register new user        |
| POST   | /api/auth/login            | Public  | Login, returns JWT       |
| GET    | /api/auth/me               | User    | Get current user         |
| POST   | /api/chat/message          | User    | Send message, get reply  |
| GET    | /api/chat/history          | User    | Load conversation        |
| DELETE | /api/chat/clear            | User    | Clear conversation       |
| GET    | /api/admin/users           | Admin   | List all users           |
| DELETE | /api/admin/users/:id       | Admin   | Delete a user            |
| GET    | /api/admin/stats           | Admin   | Usage statistics         |
| GET    | /api/admin/conversations   | Admin   | All conversations        |

---

## Switch AI Provider

In `api/.env`:

```bash
# Use OpenAI
AI_PROVIDER=openai
AI_MODEL=gpt-4o
OPENAI_API_KEY=sk-...

# OR use Anthropic Claude
AI_PROVIDER=anthropic
AI_MODEL=claude-sonnet-4-20250514
ANTHROPIC_API_KEY=sk-ant-...
```

No code changes needed — `aiService.js` handles both.
