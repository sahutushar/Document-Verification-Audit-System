@echo off
echo ========================================
echo Document Verification System Startup
echo ========================================
echo.

echo 1. Running diagnostics...
cd backend
call npm run diagnose
echo.

echo 2. Starting backend server...
start "Backend Server" cmd /k "npm run debug"
echo Backend server starting in new window...
echo.

echo 3. Waiting for backend to initialize...
timeout /t 5 /nobreak > nul
echo.

echo 4. Starting frontend...
cd ..\frontend
start "Frontend Server" cmd /k "npm start"
echo Frontend server starting in new window...
echo.

echo ========================================
echo System startup complete!
echo ========================================
echo.
echo Backend: http://localhost:5003
echo Frontend: http://localhost:3000
echo.
echo Press any key to exit...
pause > nul