@echo off
title Local Server Starter

echo =========================
echo Starting...
echo =========================

cd /d "%~dp0"

echo Current Directory:
echo %cd%

where node
where pnpm

pause

if not exist node_modules (
    echo Installing packages...
    call pnpm install
)

echo Opening browser...
start http://localhost:3000

echo Starting dev server...
call pnpm dev

pause