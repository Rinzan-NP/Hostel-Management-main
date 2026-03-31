#!/bin/bash

# Hostel Management System - Build and Setup Script for Linux/Mac
# This script handles installation and migration in one go

echo ""
echo "========================================"
echo "Hostel Management System - Build"
echo "========================================"
echo ""

# Backend Setup
echo "[*] Backend Setup"
echo ""

cd Backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "Installing backend dependencies..."
pip install --upgrade pip
pip install Django==6.0.3 djangorestframework django-cors-headers psycopg2-binary python-decouple

# Run migrations
echo ""
echo "Running database migrations..."
python manage.py makemigrations
python manage.py migrate

# Create superuser (optional)
echo ""
echo "Backend setup complete!"
echo ""
read -p "Create admin account? (y/n): " create_admin
if [[ "$create_admin" == "y" || "$create_admin" == "Y" ]]; then
    echo "Creating superuser..."
    python manage.py createsuperuser
fi

cd ..

# Frontend Setup
echo ""
echo "[*] Frontend Setup"
echo ""

cd Frontend

echo "Installing frontend dependencies..."
npm install

echo ""
echo "Frontend setup complete!"

cd ..

echo ""
echo "========================================"
echo "✓ Build Complete!"
echo "========================================"
echo ""
echo "Ready to start:"
echo ""
echo "Backend (Terminal 1):"
echo "  cd Backend"
echo "  source venv/bin/activate"
echo "  python manage.py runserver"
echo ""
echo "Frontend (Terminal 2):"
echo "  cd Frontend"
echo "  npm run dev"
echo ""
