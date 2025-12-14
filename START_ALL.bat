@echo off
REM ProShop Business Dashboard - Complete Startup Script (Windows)
REM This script starts both Django backend and React frontend

echo.
echo 🚀 Starting ProShop Business Dashboard...
echo.

REM Kill any existing processes on ports 8000 and 3000
echo 🧹 Cleaning up old processes...
for /f "tokens=5" %%a in ('netstat -aon ^| find ":8000" ^| find "LISTENING"') do taskkill /PID %%a /F 2>nul
for /f "tokens=5" %%a in ('netstat -aon ^| find ":3000" ^| find "LISTENING"') do taskkill /PID %%a /F 2>nul
timeout /t 1 /nobreak

REM Start Backend (Django)
echo.
echo 📦 Starting Django Backend...
cd /d %~dp0
call venv\Scripts\activate.bat
start "Django Backend" cmd /k python manage.py runserver 0.0.0.0:8000
echo ✅ Backend started
echo    URL: http://localhost:8000
echo.

REM Wait for backend to start
timeout /t 2 /nobreak

REM Start Frontend (React)
echo ⚛️  Starting React Frontend...
cd /d %~dp0frontend
start "React Frontend" cmd /k npm start
echo ✅ Frontend started
echo    URL: http://localhost:3000
echo.

echo 🎉 ProShop Dashboard is running!
echo.
echo 📊 Backend:  http://localhost:8000
echo 🌐 Frontend: http://localhost:3000
echo.
echo Press Ctrl+C in each window to stop services
echo.
pause
