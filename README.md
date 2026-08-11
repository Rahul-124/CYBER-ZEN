# 🌌 Cyber-Zen | Quantum Task HUD

**🟢 LIVE DEMO:**  (cyber-zen-nine.vercel.app)

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Django](https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

Cyber-Zen is a full-stack, sci-fi-inspired productivity web application deployed on a cloud architecture. It bridges a high-performance React frontend with a robust Python/Django backend, featuring a live PostgreSQL database and real-time astronomical calculations.

## 🚀 Technical Architecture
* **Frontend (Vercel):** Built with React, Vite, and Tailwind CSS. Features advanced state management and Framer Motion for a fluid, cybernetic UI.
* **Backend (Render):** Engineered using Python, Django, and Django REST Framework (DRF) to construct a secure, scalable API.
* **Database (Neon):** Fully integrated PostgreSQL database handling persistent user data and task matrices.
* **Security:** JWT-based user authentication (SimpleJWT) alongside encrypted SMTP email recovery protocols.
* **Vedic Engine:** Integrates the Python `ephem` library to calculate real-time celestial alignments and lunar phases based on ecliptic longitudes.

## ⚙️ Local Installation
```bash
# Clone the repository
git clone [https://github.com/Rahul-124/CYBER-ZEN.git]

# Set up the Python Core
cd quantum_core
python -m venv venv
source venv/Scripts/activate
pip install -r requirements.txt
python manage.py runserver

# Set up the React HUD
cd cyber-hud
npm install
npm run dev
