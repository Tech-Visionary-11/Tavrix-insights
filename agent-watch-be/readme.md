# 🧠 Agent Watch

A FastAPI backend service for tracking AI agents, LLM prompt usage, token consumption, and agent workflow steps — designed for devs and no-code users alike.

---

## ✨ Features

- 📦 Track prompt & response logs from agents
- 📊 Store token usage, model type, and cost
- 📍 Track agent name, session ID, and step-by-step status
- 🔁 Compatible with both code (SDK) and no-code tools (like n8n, Flowise)
- 📁 Easy to extend for analytics dashboards and billing

---

## 🛠 Tech Stack

- **FastAPI** - Python web framework
- **SQLAlchemy** - ORM for database
- **SQLite** (dev) / **PostgreSQL** (prod ready)
- **Uvicorn** - ASGI server

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/ai-agent-tracker.git
cd ai-agent-tracker

```bash
python -m uvicorn app.main:app --reload