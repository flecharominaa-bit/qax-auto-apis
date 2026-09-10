# Mission 1 - Homebanking Mock API (Entrega parcial)

Mission #1 - Stage 1 | API Testing con Playwright

## 🎯 Objetivo

Certificar el flujo crítico (Smoke Test) del **Módulo 1: Resumen de Cuentas y Movimientos** de la Homebanking Mock API, siguiendo la premisa de la misión: con tiempo limitado, priorizar el escenario que garantiza que el sistema funciona en su nivel más básico.

> ⚠️ **Esta es una entrega parcial.** Cubre solo el Módulo 1. Quedan pendientes para la entrega final: Transferencias y Pago de Servicios, Plazos Fijos, Préstamos y Tarjetas.

## 📋 Casos de prueba cubiertos

| # | Endpoint | Caso de aceptación |
|---|----------|---------------------|
| - | `POST /auth/registro` | Alta de un cliente nuevo con datos únicos |
| - | `POST /auth/login` | Login devuelve un `access_token` |
| - | `POST /sistema/resetear` | Reset del simulador antes de validar el resto |
| CA 1.1 | `GET /cliente/dashboard` | El cliente ve su perfil y saludo de bienvenida |
| CA 1.2 | `GET /cuentas/` | Se listan las cuentas del cliente con su saldo |
| CA 1.3 | `GET /transacciones/` | Se obtiene el historial de movimientos |

## 🚀 Ejecución

```bash
npm install
npx playwright test
npx playwright show-report
```

## 📁 Estructura

```
├── src/
│   └── services/
│       └── HomebankingService.js   # Centraliza las llamadas HTTP (auth, cuentas, transacciones)
├── tests/
│   └── smoke.spec.js               # Smoke test en serie: registro → login → reset → dashboard → cuentas → transacciones
├── package.json
└── playwright.config.js
```

## ⚙️ Configuración

- **Base URL:** `https://homebanking-demo.onrender.com`
- **Usuario de prueba:** se genera un username/email único por corrida (sufijo aleatorio) para evitar colisiones al repetir la ejecución.
- **Autenticación:** Bearer token obtenido en el login, reutilizado en el resto de las llamadas.

---
*Nota: los tests fueron escritos contra la documentación Swagger de la API. Aún no se ejecutaron en un entorno con salida a internet completa — correr `npx playwright test` antes de enviar a revisión, por si algún nombre de campo de la respuesta difiere.*
