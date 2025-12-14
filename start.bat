@echo off
REM ProShop - Start both backend and frontend servers (Windows)

echo 🚀 Starting ProShop Business Dashboard...
echo.

REM Check if venv exists
if not exist "venv" (
    echo 📦 Creating virtual environment...
    python -m venv venv
)

REM Activate venv
call venv\Scripts\activate.bat

REM Install backend dependencies
echo 📦 Installing backend dependencies...
pip install -q -r requirements.txt

REM Run migrations
echo 🗄️ Running database migrations...
python manage.py migrate --noinput

REM Start Django server in background
echo 🔧 Starting Django backend server...
start python manage.py runserver

REM Wait a moment for Django to start
timeout /t 3 /nobreak

REM Start React frontend
echo ⚛️ Starting React frontend server...
cd frontend
call npm install --silent
call npm start

echo.
echo ✅ ProShop is starting!
echo.
echo 📍 Frontend: http://localhost:3000
echo 📍 Backend:  http://localhost:8000
echo.
echo Close this window to stop the servers
echo.
pause
