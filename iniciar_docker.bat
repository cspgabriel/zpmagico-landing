@echo off
title Iniciar Evolution API Docker
echo ----------------------------------------------------
echo Iniciando Evolution API via Docker Compose...
echo Certifique-se de que o Docker Desktop está aberto!
echo ----------------------------------------------------
cd docker
docker compose up -d
echo.
echo Evolution API iniciada na porta 8083!
echo.
pause
