@echo off
REM ngrok Tunnel Setup for ProShop Dashboard (Windows)

setlocal enabledelayedexpansion

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║         🌐 ngrok Tunnel Setup for ProShop Dashboard        ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

REM Check if ngrok is installed
where ngrok >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ ngrok is not installed!
    echo.
    echo Install ngrok:
    echo   1. Download from https://ngrok.com/download
    echo   2. Extract to a folder
    echo   3. Add folder to System PATH
    echo.
    echo Then authenticate:
    echo   ngrok config add-authtoken YOUR_AUTH_TOKEN
    echo.
    pause
    exit /b 1
)

echo ✅ ngrok is installed
echo.

echo ⚠️  Make sure Django and React are running:
echo   Terminal 1: python manage.py runserver
echo   Terminal 2: cd frontend ^&^& npm start
echo.

echo Starting ngrok tunnels...
echo.

REM Create logs directory
if not exist logs mkdir logs

REM Start backend tunnel
echo Starting backend tunnel (port 8000)...
start "ngrok Backend" cmd /k ngrok http 8000 --log=stdout > logs\ngrok_backend.log 2>&1

REM Wait for tunnel to initialize
timeout /t 4 /nobreak

REM Start frontend tunnel
echo Starting frontend tunnel (port 3000)...
start "ngrok Frontend" cmd /k ngrok http 3000 --log=stdout > logs\ngrok_frontend.log 2>&1

REM Wait for tunnels to fully initialize
timeout /t 4 /nobreak

echo.
echo Fetching tunnel URLs...
echo.

REM Try to get URLs from ngrok API
for /l %%i in (1,1,5) do (
    for /f "delims=" %%a in ('curl -s http://localhost:4040/api/tunnels 2^>nul') do (
        set "RESPONSE=%%a"
    )
    
    if not "!RESPONSE!"=="" (
        goto :found_urls
    )
    
    if %%i lss 5 (
        echo Waiting for tunnels to initialize... (%%i/5)
        timeout /t 2 /nobreak
    )
)

:found_urls
echo.
echo ════════════════════════════════════════════════════════════
echo ✅ ngrok Tunnels Started!
echo ════════════════════════════════════════════════════════════
echo.

echo 📡 Tunnel URLs:
echo   Check: http://localhost:4040/api/tunnels
echo.

echo 📝 Configuration Required:
echo.
echo 1. Update Django ALLOWED_HOSTS:
echo    Edit: config/settings.py
echo    Add your ngrok backend domain to ALLOWED_HOSTS
echo.
echo 2. Update Django CORS_ALLOWED_ORIGINS:
echo    Edit: config/settings.py
echo    Add your ngrok frontend URL to CORS_ALLOWED_ORIGINS
echo.
echo 3. Update React API_BASE_URL:
echo    Edit: frontend/src/config.js
echo    Set API_BASE_URL to your ngrok backend URL
echo.

echo 🚀 Next Steps:
echo    1. Update the configuration above
echo    2. Restart Django: python manage.py runserver
echo    3. Restart React: cd frontend ^&^& npm start
echo    4. Access your app at your ngrok frontend URL
echo.

echo 📊 Monitor Requests:
echo    Open: http://localhost:4040
echo.

echo 📱 Test on Mobile:
echo    Open ngrok frontend URL on your phone
echo    Login and test all features
echo.

echo ════════════════════════════════════════════════════════════
echo Press Ctrl+C in ngrok windows to stop tunnels
echo ════════════════════════════════════════════════════════════
echo.

pause
