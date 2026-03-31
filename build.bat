@echo off
REM Hostel Management System - Build and Setup Script for Windows
REM This script handles installation and migration in one go

setlocal enabledelayedexpansion

echo.
echo ========================================
echo Hostel Management System - Build
echo ========================================
echo.

REM Backend Setup
echo [*] Backend Setup
echo.

cd Backend

REM Create virtual environment if it doesn't exist
if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Install dependencies
echo Installing backend dependencies...
pip install --upgrade pip
pip install Django==6.0.3 djangorestframework django-cors-headers psycopg2-binary python-decouple

REM Run migrations
echo.
echo Running database migrations...
python manage.py makemigrations
python manage.py migrate

REM Create superuser (optional)
echo.
echo Backend setup complete!
echo.
echo Create admin account? (y/n)
set /p create_admin="Enter choice: "
if /i "%create_admin%"=="y" (
    echo Creating superuser...
    python manage.py createsuperuser
)

cd ..

REM Frontend Setup
echo.
echo [*] Frontend Setup
echo.

cd Frontend

echo Installing frontend dependencies...
call npm install

echo.
echo Frontend setup complete!

cd ..

echo.
echo ========================================
echo ✓ Build Complete!
echo ========================================
echo.
echo Ready to start:
echo.
echo Backend (Terminal 1):
echo   cd Backend
echo   venv\Scripts\activate
echo   python manage.py runserver
echo.
echo Frontend (Terminal 2):
echo   cd Frontend
echo   npm run dev
echo.
pause
