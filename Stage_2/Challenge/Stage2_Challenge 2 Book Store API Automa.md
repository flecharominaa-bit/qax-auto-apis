# Challenge 2: Book Store API Automation

Este documento detalla los escenarios de prueba para la API de Book Store utilizando sintaxis Gherkin.

```gherkin
# lenguaje: es
@BookStore
Feature: Gestión de cuenta y libros en Book Store
  Como usuario de la API de Book Store
  Quiero registrarme y autenticarme
  Para poder gestionar mi colección de libros de forma segura

  Background:
    Given que tengo acceso a la API en "[https://demoqa.com](https://demoqa.com)"

  @negative
  Scenario: Intentar crear un usuario con datos inválidos
    When envío una petición POST a "/Account/v1/User" con un userName vacío
    Then la API debe responder con un status code 400
    And el cuerpo de la respuesta debe contener un mensaje de error

  @negative
  Scenario: Intentar generar un token con credenciales incorrectas
    When envío una petición POST a "/Account/v1/GenerateToken" con credenciales inválidas
    Then la API debe responder con un status code 200
    And el mensaje de respuesta debe ser "User authorization failed."

  @security
  Scenario: Intentar acceder a un perfil sin token de autorización
    When envío una petición GET a "/Account/v1/User/{userId}" sin header de Authorization
    Then la API debe responder con un status code 401
    And el mensaje de error debe ser "User not authorized!"

  @smoke @e2e
  Scenario: Flujo completo - Registrar usuario, obtener libros y agregar a colección
    Given un nuevo usuario registrado con datos aleatorios
    And un token de autenticación (Bearer Token) generado exitosamente
    When consulto el perfil del usuario para validar el registro
    And obtengo la lista de libros disponibles para extraer el primer ISBN
    And agrego ese libro a la colección del usuario usando el Token
    Then la API debe responder con un status code 201
    And el libro debe aparecer en la colección del usuario
