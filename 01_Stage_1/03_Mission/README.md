# Mission #1: Automatización de APIs - Homebanking Mock API

¡Felicidades por llegar a tu primera misión oficial como Automation QA Ninja en QAXpert!
En esta misión vamos a explorar y certificar la API de un **[Sistema Bancario (Homebanking)](https://homebanking-demo.onrender.com/docs#/)** apoyándonos en su documentación Swagger (OAS 3.1).

## El Contexto del Negocio (Premisa)
Tu equipo de desarrollo acaba de entregar la versión Release Candidate del Homebanking. **El problema:** Solo tenemos **un Sprint (2 semanas)** para certificar la salida a Producción.
No tenemos tiempo para automatizar el 100% de los escenarios con pruebas exhaustivas. Debes ser **estratégico**. 

**Tu misión es realizar un análisis del Swagger**
- mapear los servicios para pruebas manuales 
- diseñar un **Smoke Test (Flujo Crítico)** automatizado que nos garantice que si el banco sale a producción hoy, los clientes no perderán su dinero y el negocio funcionará en su nivel más básico.

---

## Documentación de la API (Swagger)
A continuación, los endpoints disponibles en el sistema:

- **Sistema:** `POST /sistema/resetear` (Limpia la base de datos, ideal para iniciar pruebas).
- **Cliente:** `GET /cliente/dashboard` (Datos y resumen del cliente).
- **Cuentas:** `GET /cuentas/` (Saldos y cuentas bancarias).
- **Transacciones:** `GET /transacciones/` (Historial de movimientos).
- **Transferencias:** `POST /transferencias/` (Enviar dinero).
- **Pagos:** `POST /pagos/servicios` (Pagar impuestos).
- **Plazos Fijos:** `GET`, `POST`, `DELETE` en `/plazos-fijos/` (Inversiones).
- **Préstamos:** `GET`, `POST`, `DELETE` en `/prestamos/` (Créditos).
- **Tarjetas:** `GET`, `POST`, `DELETE` en `/tarjetas/` (Tarjetas de crédito/débito).

---

## Historias de Usuario y Criterios de Aceptación: Homebanking

Como Automation QA, tu trabajo no es solo probar "endpoints", es asegurar que **las reglas del negocio funcionen**.
A continuación, se presentan las Historias de Usuario a nivel de negocio. Tu misión como Ninja será leer la documentación de la API y descubrir qué endpoints, métodos y datos (JSON) necesitas para cumplir con estos criterios.

---

###  Módulo 1: Resumen de Cuentas y Movimientos

- **Historia de Usuario 1:**  
- **Como** cliente del banco,  
- **Quiero** consultar el resumen de mi perfil, mis cuentas bancarias y mis últimos movimientos,  
- **Para** llevar un control diario de mi dinero y mis finanzas personales.

#### **Criterios de Aceptación:**
*   **CA 1.1 - Vista de Perfil:** El sistema debe permitir al cliente visualizar su información personal y un saludo de bienvenida en su panel de control (dashboard).
*   **CA 1.2 - Consulta de Saldos:** El sistema debe listar todas las cuentas asociadas al cliente, mostrando claramente el saldo disponible y el tipo de moneda (ej. ARS, USD) de cada una.
*   **CA 1.3 - Historial de Transacciones:** El sistema debe proporcionar un listado del historial de movimientos del cliente, donde cada registro tenga una fecha válida, un monto y un concepto.

---

###  Módulo 2: Transferencias y Pago de Servicios

- **Historia de Usuario 2:**  
- **Como** cliente del banco,  
- **Quiero** transferir dinero a otras cuentas y pagar mis servicios desde la plataforma,  
- **Para** cumplir con mis obligaciones financieras sin tener que ir a una sucursal física.

#### **Criterios de Aceptación:**
*   **CA 2.1 - Transferencia Exitosa:** Si el cliente tiene saldo suficiente, el sistema debe permitirle enviar dinero a otra cuenta destino y devolver un comprobante de la operación exitosa.
*   **CA 2.2 - Fondos Insuficientes (Regla de Negocio):** Si el cliente intenta transferir un monto MAYOR al saldo disponible en su cuenta de origen, el sistema debe bloquear la operación e informar que no posee los fondos necesarios.
*   **CA 2.3 - Pago de Servicios:** El sistema debe permitir al cliente registrar el pago de un servicio o impuesto, descontando el monto correspondiente de su cuenta.

---

##  Módulo 3: Gestión de Productos Financieros

- **Historia de Usuario 3:**  
- **Como** cliente del banco,  
- **Quiero** gestionar mis tarjetas, solicitar préstamos personales y crear inversiones (plazos fijos),  
- **Para** administrar mis herramientas de crédito y hacer crecer mis ahorros.

#### **Criterios de Aceptación:**
*   **CA 3.1 - Solicitar Préstamo:** El sistema debe permitir al cliente solicitar un préstamo ingresando un monto válido. Al aprobarse, el préstamo debe quedar registrado en su portafolio con un identificador único.
*   **CA 3.2 - Alta de Inversiones:** El cliente debe poder constituir un nuevo Plazo Fijo. El sistema debe confirmar la creación de la inversión.
*   **CA 3.3 - Cancelación de Productos:** El sistema debe permitir al cliente cancelar ("desistir") un préstamo o dar de baja un plazo fijo que haya creado previamente, eliminándolo de sus productos activos.
*   **CA 3.4 - Emisión y Baja de Tarjetas:** El sistema debe listar las tarjetas actuales del cliente, permitirle generar nuevas tarjetas (físicas o virtuales) y darle la opción de eliminar/dar de baja una tarjeta específica.

---

##  Módulo 4: Administración del Sistema (Para QA)

- **Historia de Usuario 4:**  
- **Como** administrador del sistema (QA),  
- **Quiero** poder restablecer la base de datos a su estado original,  
- **Para** asegurar que mis pruebas diarias comiencen siempre con los mismos saldos y productos, evitando falsos errores por datos acumulados.

#### **Criterios de Aceptación:**
*   **CA 4.1 - Reset de Datos:** El sistema debe proveer un mecanismo que, al ejecutarse, restaure todas las cuentas, tarjetas y saldos a sus valores iniciales por defecto.


---
##  Instrucciones de la Misión:

### 1. Análisis y Diseño de Casos de Prueba (Gherkin)
Como no podemos automatizar todo, diseñaremos la estrategia completa en texto.
Escribe un mínimo de **20 casos de prueba manuales en formato Gherkin**.
- Deben cubrir la mayor cantidad de criterios de aceptación de las funcionalidades listadas.
- *Tip:* Incluye "Happy Paths" (Ej: Transferencia exitosa) y "Negative Testing" (Ej: Transferencia sin fondos suficientes, que debería dar un error 400).

### 2. Exploración y Pruebas Manuales (Postman)
Para conocer cómo "habla" la API, crea una **Colección en Postman**.
- Mapea **TODOS** los servicios del Swagger en esta colección.
- Ejecuta pruebas manuales para cada endpoint y guarda las respuestas como ejemplos en Postman. Esto te servirá para entender los JSON que devuelve el banco.

### 3. Automatización Estratégica: El Smoke Test (Playwright)
¡Hora del código! No vas a automatizar los 20 casos. Vas a automatizar **únicamente un flujo crítico End-to-End (Smoke Test)** usando **Playwright**.
- **Reto de Negocio:** Identifica cuál es el flujo de vida de un usuario bancario que *sí o sí* debe funcionar.

---

## Entrega
- Sube todo el código a la carpeta correspondiente en tu repositorio personal de GitHub.
  - Realiza un `README.md `detallando tu análisis, diseño de casos,  la lógica de tu Smoke Test y como ejecutarlo.
  - Agrega un `.gitignore` para evitar subir archivos innecesarios (node_modules, etc).
 - Menciona a tu mentor en un Pull Request para que pueda revisar tu código y darte feedback.

---

### 👈 Volver al [Stage 1](../README.md)