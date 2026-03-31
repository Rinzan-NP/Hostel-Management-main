@echo off
REM Hostel Management System - Complete Setup Script for Windows
REM This script installs all dependencies for Backend and Frontend

setlocal enabledelayedexpansion

echo.
echo ========================================
echo Hostel Management System - Setup
echo ========================================
echo.

REM Check if we're in the correct directory
if not exist "Backend" (
    echo Error: Backend folder not found. Please run this script from the project root.
    pause
    exit /b 1
)

if not exist "Frontend" (
    echo Error: Frontend folder not found. Please run this script from the project root.
    pause
    exit /b 1
)

REM Backend Setup
echo [1/4] Checking Python installation...
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python is not installed or not in PATH.
    echo Please install Python 3.8+ from https://www.python.org/
    pause
    exit /b 1
)
echo Python found: 
python --version

echo.
echo [2/4] Installing Backend dependencies...
cd Backend
if exist venv (
    echo Virtual environment already exists. Activating...
    call venv\Scripts\activate.bat
) else (
    echo Creating virtual environment...
    python -m venv venv
    call venv\Scripts\activate.bat
)

echo Installing Python packages...
pip install --upgrade pip
if exist requirements.txt (
    pip install -r requirements.txt
    echo Backend dependencies installed successfully!
) else (
    echo Warning: requirements.txt not found. Creating with common dependencies...
    (
        echo Django==6.0.3
        echo djangorestframework
        echo django-cors-headers
        echo psycopg2-binary
    ) > requirements.txt
    pip install -r requirements.txt
)

cd ..

REM Frontend Setup
echo.
echo [3/4] Checking Node.js and npm installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo Error: Node.js is not installed or not in PATH.
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo Node.js found: 
node --version
npm --version

echo.
echo [4/4] Installing Frontend dependencies...
cd Frontend
echo Installing npm packages...
call npm install
echo Frontend dependencies installed successfully!

cd ..

echo.
echo ========================================
echo ✓ Setup Complete!
echo ========================================
echo.
echo Next steps:
echo.
echo Backend:
echo   1. cd Backend
echo   2. venv\Scripts\activate (activate virtual environment)
echo   3. python manage.py migrate (setup database)
echo   4. python manage.py runserver (start backend on port 8000)
echo.
echo Frontend (in another terminal):
echo   1. cd Frontend
echo   2. npm run dev (start frontend on port 5173)
echo.
echo Then open http://localhost:5173 in your browser
echo.
pause
