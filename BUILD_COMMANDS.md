# 🔨 Build Commands - Install & Migrate

## Single Command - Complete Build

### Windows
```batch
build.bat
```

### Linux / macOS
```bash
chmod +x build.sh
./build.sh
```

---

## Backend Only - Single Command

### Install + Migrate (All-in-One)

**Windows (PowerShell):**
```powershell
cd Backend; python -m venv venv; .\venv\Scripts\activate; pip install Django==6.0.3 djangorestframework django-cors-headers psycopg2-binary python-decouple; python manage.py makemigrations; python manage.py migrate
```

**Windows (CMD):**
```batch
cd Backend
python -m venv venv
venv\Scripts\activate.bat
pip install Django==6.0.3 djangorestframework django-cors-headers psycopg2-binary python-decouple
python manage.py makemigrations
python manage.py migrate
```

**Linux / macOS:**
```bash
cd Backend
python3 -m venv venv
source venv/bin/activate
pip install Django==6.0.3 djangorestframework django-cors-headers psycopg2-binary python-decouple
python manage.py makemigrations
python manage.py migrate
```

---

## Frontend Only - Single Command

**Windows / Linux / macOS:**
```bash
cd Frontend && npm install
```

---

## Individual Commands

### Backend Installation Only
```bash
pip install Django==6.0.3 djangorestframework django-cors-headers psycopg2-binary python-decouple
```

### Backend Migration Only
```bash
python manage.py makemigrations
python manage.py migrate
```

### Create Superuser
```bash
python manage.py createsuperuser
```

### Frontend Installation Only
```bash
npm install
```

---

## Run Development Servers

### Backend Server
```bash
cd Backend
source venv/bin/activate  # Linux/macOS
venv\Scripts\activate     # Windows
python manage.py runserver
```

**Runs at:** `http://localhost:8000`

### Frontend Server (New Terminal)
```bash
cd Frontend
npm run dev
```

**Runs at:** `http://localhost:5173`

---

## Build for Production

### Backend Production Build
```bash
cd Backend
pip install gunicorn
python manage.py collectstatic
gunicorn core.wsgi:application --bind 0.0.0.0:8000
```

### Frontend Production Build
```bash
cd Frontend
npm run build
```

**Output:** `Frontend/dist/` folder ready for deployment

---

## Docker Commands (Optional)

### Build Docker Image
```bash
docker build -t hostel-management .
```

### Run Docker Container
```bash
docker run -p 8000:8000 -p 5173:5173 hostel-management
```

---

## Quick Reference

| Task | Command |
|------|---------|
| **Complete Setup** | `build.bat` (Windows) or `./build.sh` (Linux/Mac) |
| **Backend Install + Migrate** | `pip install ... && python manage.py migrate` |
| **Frontend Install** | `npm install` |
| **Start Backend** | `python manage.py runserver` |
| **Start Frontend** | `npm run dev` |
| **Create Admin** | `python manage.py createsuperuser` |
| **Make Migrations** | `python manage.py makemigrations` |
| **Apply Migrations** | `python manage.py migrate` |
| **Build Frontend** | `npm run build` |
| **Run Tests** | `python manage.py test` |
| **Lint Frontend** | `npm run lint` |

---

## Check Installation Status

### Verify Backend
```bash
cd Backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
python --version
django-admin --version
python -m django --version
```

### Verify Frontend
```bash
cd Frontend
node --version
npm --version
```

### Check API
```bash
curl http://localhost:8000/api/halls/
```

### Check Frontend
```
Open http://localhost:5173 in browser
```

---

## Environment Setup

### Backend .env File
Create `Backend/.env`:
```
DEBUG=True
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=sqlite:///db.sqlite3
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

### Frontend .env File
Create `Frontend/.env.local`:
```
VITE_API_URL=http://localhost:8000/api
```

---

**Last Updated:** March 31, 2026
