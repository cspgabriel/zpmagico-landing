@echo off
title Iniciar ZapMagico SaaS
echo ----------------------------------------------------
echo Iniciando ZapMagico SaaS (Next.js)...
echo Disponivel em: http://localhost:3001
echo ----------------------------------------------------
cd saas
set PORT=3001
npm run dev
pause
