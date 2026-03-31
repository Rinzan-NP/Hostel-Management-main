#!/bin/bash

# Hostel Management System - Complete Setup Script for Linux/Mac
# This script installs all dependencies for Backend and Frontend

echo ""
echo "========================================"
echo "Hostel Management System - Setup"
echo "========================================"
echo ""

# Check if we're in the correct directory
if [ ! -d "Backend" ]; then
    echo "Error: Backend folder not found. Please run this script from the project root."
    exit 1
fi

if [ ! -d "Frontend" ]; then
    echo "Error: Frontend folder not found. Please run this script from the project root."
    exit 1
fi

# Backend Setup
echo "[1/4] Checking Python installation..."
if ! command -v python3 &> /dev/null; then
    echo "Error: Python 3 is not installed."
    echo "Please install Python 3.8+ from https://www.python.org/"
    exit 1
fi
echo "Python found: $(python3 --version)"

echo ""
echo "[2/4] Installing Backend dependencies..."
cd Backend

if [ -d "venv" ]; then
    echo "Virtual environment already exists. Activating..."
    source venv/bin/activate
else
    echo "Creating virtual environment..."
    python3 -m venv venv
    source venv/bin/activate
fi

echo "Installing Python packages..."
pip install --upgrade pip

if [ -f "requirements.txt" ]; then
    pip install -r requirements.txt
    echo "Backend dependencies installed successfully!"
else
    echo "Warning: requirements.txt not found. Creating with common dependencies..."
    cat > requirements.txt << EOF
Django==6.0.3
djangorestframework
django-cors-headers
psycopg2-binary
EOF
    pip install -r requirements.txt
fi

cd ..

# Frontend Setup
echo ""
echo "[3/4] Checking Node.js and npm installation..."
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed."
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi
echo "Node.js found: $(node --version)"
echo "npm found: $(npm --version)"

echo ""
echo "[4/4] Installing Frontend dependencies..."
cd Frontend
echo "Installing npm packages..."
npm install
echo "Frontend dependencies installed successfully!"

cd ..

echo ""
echo "========================================"
echo "✓ Setup Complete!"
echo "========================================"
echo ""
echo "Next steps:"
echo ""
echo "Backend:"
echo "  1. cd Backend"
echo "  2. source venv/bin/activate (activate virtual environment)"
echo "  3. python manage.py migrate (setup database)"
echo "  4. python manage.py runserver (start backend on port 8000)"
echo ""
echo "Frontend (in another terminal):"
echo "  1. cd Frontend"
echo "  2. npm run dev (start frontend on port 5173)"
echo ""
echo "Then open http://localhost:5173 in your browser"
echo ""
