# 🚀 Complete Setup Instructions

This document provides multiple ways to install all dependencies for the Hostel Management System.

## Quick Start (Automated)

### Windows
```batch
setup.bat
```
Simply run the batch file and it will:
- ✓ Check Python installation
- ✓ Create virtual environment
- ✓ Install all backend dependencies
- ✓ Check Node.js installation
- ✓ Install all frontend dependencies

### Linux / macOS
```bash
chmod +x setup.sh
./setup.sh
```

---

## Manual Setup (Step-by-Step)

### Backend Installation

**1. Navigate to Backend folder:**
```bash
cd Backend
```

**2. Create virtual environment:**

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**Linux/macOS:**
```bash
python3 -m venv venv
source venv/bin/activate
```

**3. Install dependencies:**
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

**Expected output:**
```
Successfully installed Django-6.0.3 djangorestframework django-cors-headers psycopg2-binary
```

**4. Setup database:**
```bash
python manage.py migrate
```

**5. Create admin user (optional):**
```bash
python manage.py createsuperuser
```

**6. Start backend server:**
```bash
python manage.py runserver
```

Backend is now running at: **http://localhost:8000**

### Frontend Installation

**1. Navigate to Frontend folder (in a new terminal):**
```bash
cd Frontend
```

**2. Install dependencies:**
```bash
npm install
```

**Expected output:**
```
added 200+ packages in X seconds
```

**3. Start development server:**
```bash
npm run dev
```

Frontend is now running at: **http://localhost:5173**

---

## Verify Installation

### Backend ✓
```bash
# Check if backend is running
curl http://localhost:8000/api/halls/

# Visit admin
http://localhost:8000/admin
```

### Frontend ✓
```bash
# Frontend should open automatically
http://localhost:5173
```

---

## Common Issues & Solutions

### Issue: Python not found
```
Error: 'python' is not recognized
```
**Solution:** 
- Install Python from https://www.python.org/
- Make sure to check "Add Python to PATH" during installation

### Issue: pip command not found
**Solution:**
```bash
python -m pip install --upgrade pip
```

### Issue: Node.js not found
```
Error: 'npm' is not recognized
```
**Solution:**
- Install Node.js from https://nodejs.org/
- Restart terminal after installation

### Issue: Port 8000 already in use
**Solution:**
```bash
python manage.py runserver 8001  # Use different port
```

### Issue: Port 5173 already in use
**Solution:**
```bash
npm run dev -- --port 5174  # Use different port
```

### Issue: Virtual environment activation fails
**Solution:** Delete venv folder and recreate
```bash
rm -rf venv          # Linux/macOS
rmdir /s venv        # Windows

python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/macOS
```

---

## Requirements Files

### Backend Requirements
Create `Backend/requirements.txt`:
```
Django==6.0.3
djangorestframework==3.14.0
django-cors-headers==4.0.0
psycopg2-binary==2.9.0
python-decouple==3.8
```

### Frontend Requirements
Automatically installed via `npm install` from `Frontend/package.json`

```json
{
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "axios": "^1.7.7",
    "lucide-react": "^0.453.0",
    "framer-motion": "^11.11.10"
  }
}
```

---

## Environment Configuration

### Backend (Django)

Create `Backend/.env` file (for development):
```
DEBUG=True
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=sqlite:///db.sqlite3
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

### Frontend

Ensure `Frontend/src/api.js` has correct backend URL:
```javascript
const API_URL = 'http://localhost:8000/api';
```

---

## Next Steps After Installation

### 1. Create Initial Data
```bash
python manage.py shell
```

Then in the shell:
```python
from hostel.models import Hall, Room

# Create a hall
hall = Hall.objects.create(
    name="North Hostel A",
    location="Campus North",
    description="Main hostel"
)

# Create rooms (beds auto-create)
room = Room.objects.create(
    hall=hall,
    room_number="101",
    capacity=2,
    room_type="AC",
    rent_price=5000
)

print("Data created successfully!")
```

### 2. Access Applications

| Application | URL | Purpose |
|-------------|-----|---------|
| Frontend UI | http://localhost:5173 | Student/Admin interface |
| Django Admin | http://localhost:8000/admin | Database management |
| API Docs | http://localhost:8000/api/ | API exploration |

### 3. Test API

```bash
# Get all halls
curl http://localhost:8000/api/halls/

# Get all students
curl http://localhost:8000/api/students/

# Get all rooms
curl http://localhost:8000/api/rooms/
```

---

## Production Setup

### Backend Production

**1. Install Gunicorn:**
```bash
pip install gunicorn
```

**2. Collect static files:**
```bash
python manage.py collectstatic
```

**3. Run with Gunicorn:**
```bash
gunicorn core.wsgi:application --bind 0.0.0.0:8000
```

### Frontend Production

**1. Build for production:**
```bash
npm run build
```

**2. Output folder:** `Frontend/dist/`

**3. Deploy to web server (Nginx/Apache)**

---

## Troubleshooting Checklist

- [ ] Python 3.8+ installed
- [ ] Node.js LTS installed
- [ ] Virtual environment created and activated
- [ ] Backend dependencies installed (`pip install -r requirements.txt`)
- [ ] Frontend dependencies installed (`npm install`)
- [ ] Database migrations applied (`python manage.py migrate`)
- [ ] Backend running on port 8000
- [ ] Frontend running on port 5173
- [ ] CORS configured in Django settings
- [ ] Can access http://localhost:5173

---

## Getting Help

| Issue | Resource |
|-------|----------|
| Django Documentation | https://docs.djangoproject.com/ |
| React Documentation | https://react.dev |
| Django REST Framework | https://www.django-rest-framework.org/ |
| Vite Documentation | https://vitejs.dev |
| npm Help | https://docs.npmjs.com/ |

---

**Last Updated:** March 31, 2026  
**Version:** 1.0
