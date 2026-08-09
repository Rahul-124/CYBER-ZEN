# 🌌 Cyber-Zen | Quantum Task HUD

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Django](https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=green)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

Cyber-Zen is a modern, sci-fi-inspired productivity application. It bridges a high-performance React frontend (The HUD) with a robust Python/Django backend (The Quantum Core), featuring real-time Vedic astronomical calculations.

## 🚀 Core Features
* **Quantum Identity Auth:** Secure JWT-based user authentication.
* **Vedic Calendar Engine:** Real-time lunar phase (Tithi) calculations using `ephem`.
* **Cybernetic UI:** Glassmorphism and Framer Motion animations for a 2050 aesthetic.
* **Encrypted Recovery:** SMTP-based secure email password reset protocols.

## ⚙️ Local Installation
```bash
# Clone the repository
git clone [https://github.com/YourUsername/cyber-zen.git](https://github.com/YourUsername/cyber-zen.git)

# Install Core (Backend)
cd quantum_core
python -m venv venv
source venv/Scripts/activate
pip install -r requirements.txt
python manage.py runserver

# Install HUD (Frontend)
cd cyber-hud
npm install
npm run dev
