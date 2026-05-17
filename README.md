# 🍽️ Bitefy - Restaurant Queue & Billing Management

A modern, full-stack B2B SaaS platform that revolutionizes restaurant operations by eliminating queues, enabling pre-ordering, and streamlining billing.

---

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- Node.js 16+
- PostgreSQL
- Git

### Backend Setup (Django)

```bash
# Navigate to project root
cd C:\Personal\Bitefy

# Create virtual environment
python -m venv venv

# Activate virtual environment
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser

# Start server
python manage.py runserver
```

Django runs on: `http://127.0.0.1:8000`

### Frontend Setup (React)

```bash
# Navigate to frontend
cd bitefy-frontend

# Install dependencies
npm install

# Start development server
npm start
```

React runs on: `http://localhost:3000`

---

## 📋 Features

### ✅ User Authentication
- Email/password signup and login
- JWT token-based authentication
- Secure password hashing
- Session management with localStorage

### ✅ Queue Management
- Real-time queue display
- Add/remove/complete orders
- Order status tracking
- Revenue calculation

### ✅ Menu Management
- Dynamic menu items
- Pricing management
- Add/remove menu items
- Real-time menu updates

### ✅ Billing System
- Automatic total calculation
- Revenue tracking
- Order history
- Completed orders view

---

## 🏗️ Architecture

### Tech Stack

**Backend:**
- Django 6.0
- Django REST Framework
- PostgreSQL
- JWT Authentication (simplejwt)
- CORS Support

**Frontend:**
- React 18
- React Router
- Fetch API
- LocalStorage

### Project Structure

```
Bitefy/
├── bitefy_backend/          # Django project settings
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
│
├── users/                   # User authentication app
│   ├── models.py
│   ├── serializers.py
│   ├── views.py            # SignupView, LoginView
│   └── urls.py
│
├── orders/                  # Order management app
│   ├── models.py           # Order model
│   ├── serializers.py      # OrderSerializer
│   ├── views.py            # OrderViewSet
│   └── urls.py
│
├── restaurants/            # Restaurant management app (future)
│
├── bitefy-frontend/        # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth.jsx         # Login/Signup
│   │   │   ├── Dashboard.jsx    # Main dashboard
│   │   │   ├── Navbar.jsx       # Header
│   │   │   ├── OrderList.jsx    # Queue management
│   │   │   └── Menu.jsx         # Menu management
│   │   ├── App.js               # Router setup
│   │   └── index.js
│   └── package.json
│
├── manage.py               # Django management
├── requirements.txt        # Python dependencies
├── .gitignore
└── README.md
```

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup/` - Register new user
- `POST /api/auth/login/` - Login user
- `POST /api/token/` - Get JWT token
- `POST /api/token/refresh/` - Refresh token

### Orders
- `GET /api/orders/` - List all orders
- `POST /api/orders/` - Create new order
- `DELETE /api/orders/{id}/` - Delete order
- `PUT /api/orders/{id}/` - Update order

---

## 🔐 Authentication Flow

```
User Signs Up
    ↓
POST /api/auth/signup/ (username, email, password)
    ↓
Django creates User + generates JWT tokens
    ↓
Returns: { user: {...}, access: token, refresh: token }
    ↓
React stores token in localStorage
    ↓
Token included in future API requests
    ↓
Dashboard accessible (protected route)
```

---

## 📱 Frontend Flow

### Auth Page (Login/Signup)
```
User enters credentials
    ↓
Form validates input
    ↓
POST request to Django
    ↓
Django returns user + token
    ↓
Token stored in localStorage
    ↓
Redirect to Dashboard
```

### Dashboard Page
```
Display Queue (OrderList)
    ↓
Display Menu (Menu)
    ↓
User selects items → creates order
    ↓
Order sent to Django API
    ↓
Order stored in database
    ↓
Real-time queue update
```

---

## 💾 Database Models

### User Model (Django Built-in)
```python
- id
- username (unique)
- email (unique)
- password (hashed)
- created_at
```

### Order Model
```python
- id
- name (customer name)
- items (JSON array)
- total (price in ₹)
- created_at
- is_completed (boolean)
```

---

## 🚀 Deployment

### Deploy Backend (Railway.app)
1. Create Railway account
2. Connect GitHub repo
3. Set environment variables
4. Deploy Django app

### Deploy Frontend (Vercel)
1. Create Vercel account
2. Connect GitHub repo
3. Set production API URL
4. Deploy React app

---

## 🛠️ Development Commands

### Django
```bash
# Create new app
python manage.py startapp appname

# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Access admin panel
# http://127.0.0.1:8000/admin/
```

### React
```bash
# Install packages
npm install

# Start dev server
npm start

# Build for production
npm run build
```

---

## 🤝 Team

**Founder & Developer:** Garvit Sharma
- IIT Bhilai Student
- Full Stack Developer
- Learning: Django, React, DevOps

---

## 📧 Contact

- Email: giantgarvit@gmail.com
- GitHub: @garvitshrma


---

## 🎓 Learning Path

This project was built to learn:
- Django REST Framework
- React hooks & state management
- JWT authentication
- API design
- Full-stack development
- Database design (PostgreSQL)
- Git & GitHub workflows

---

## 📚 Resources

### Backend
- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [SimpleJWT Auth](https://django-rest-framework-simplejwt.readthedocs.io/)

### Frontend
- [React Documentation](https://react.dev/)
- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [LocalStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

---

## 🎉 Built with ❤️


---

**Happy coding! 🚀**