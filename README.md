# microservicio-productos-nest

Microservicio de productos desarrollado con NestJS + TypeScript.

## 📄 Descripción

Este servicio gestiona la lógica relacionada con productos: creación, lectura, actualización, eliminación — ideal para un sistema de ecommerce o inventario.  
Está diseñado para ser parte de una arquitectura de microservicios, separado de otros servicios como autenticación o usuario.

## ⚙️ Requisitos

- Node.js 
- npm 
- Variables de entorno (.env) — copia `.env.example` como `.env` y configura según tu entorno  
- Docker / docker-compose para la BD.  

## 🚀 Instalación & Ejecución

# Instalar dependencias
```bash
npm install
```

# Para levantar la BD PostgreSQL
```bash
docker compose up -d
```

# Para parar la BD PostgreSQL
```bash
docker compose down
```

# Para desarrollo
```bash
npm run start:dev
```
