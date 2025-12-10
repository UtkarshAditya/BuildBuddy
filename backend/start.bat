@echo off
echo ================================
echo BuildBuddy Backend - Quick Start
echo ================================
echo.

cd /d %~dp0

if not exist venv (
    echo [1/6] Creating virtual environment...
    python -m venv venv
) else (
    echo [1/6] Virtual environment already exists
)

echo [2/6] Activating virtual environment...
call venv\Scripts\activate

echo [3/6] Installing dependencies...
pip install -q -r requirements.txt

if not exist .env (
    echo [4/6] Creating .env file...
    copy .env.example .env > nul
) else (
    echo [4/6] .env file already exists
)

echo [5/6] Running database migrations...
python manage.py makemigrations
python manage.py migrate

echo [6/6] Starting development server...
echo.
echo ================================
echo Server starting at http://localhost:8000
echo API Docs: http://localhost:8000/api/docs
echo Admin Panel: http://localhost:8000/admin
echo ================================
echo.
echo Press Ctrl+C to stop the server
echo.

python manage.py runserver
