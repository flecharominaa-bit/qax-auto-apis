# Casos de prueba — GitHub REST API (Mission 3)

## Historia de Usuario 1 — Consultar información de un usuario

```gherkin
Feature: Consultar información de un usuario de GitHub
  Como analista QA
  Quiero consultar información de un usuario de GitHub
  Para validar estructura, tipos y reglas básicas del endpoint

  @smoke
  Scenario: Consultar un usuario existente
    Given que tengo un username válido de GitHub
    When envío un GET a "/users/{username}"
    Then el status code es 200
    And el campo "login" es un string no vacío
    And el campo "id" es un número mayor a 0
    And el campo "avatar_url" empieza con "https://"
    And el campo "repos_url" es una URL válida
    And el campo "type" está presente

  @regression
  Scenario: Consultar un usuario inexistente
    Given que tengo un username que no existe en GitHub
    When envío un GET a "/users/{username}"
    Then el status code es 404
    And el campo "message" es "Not Found"
```

## Historia de Usuario 2 — Repositorios: crear, consultar y actualizar

```gherkin
Feature: Ciclo de vida de un repositorio
  Como analista QA
  Quiero crear un repositorio, consultarlo y actualizarlo parcialmente
  Para validar el ciclo de vida completo del recurso

  Background:
    Given que estoy autenticado con un token válido de GitHub

  @smoke
  Scenario: Crear un repositorio nuevo
    Given que tengo un nombre de repositorio único
    When envío un POST a "/user/repos" con el nombre y una descripción
    Then el status code es 201
    And el campo "id" es un número mayor a 0
    And el campo "name" coincide con el enviado
    And el campo "owner.login" coincide con mi username

  @smoke
  Scenario: Consultar el repositorio creado
    Given que creé un repositorio
    When envío un GET a "/repos/{owner}/{repo}"
    Then el status code es 200
    And el campo "id" coincide con el id del repositorio creado
    And el campo "full_name" es "{owner}/{repo}"

  @regression
  Scenario: Actualizar parcialmente la descripción del repositorio
    Given que creé un repositorio
    When envío un PATCH a "/repos/{owner}/{repo}" con una nueva descripción
    Then el status code es 200
    And el campo "description" es la nueva descripción
    And el campo "name" no cambió

  @regression
  Scenario: Crear un repositorio sin autenticación
    Given que no envío token de autenticación
    When envío un POST a "/user/repos" con un nombre
    Then el status code es 401

  @regression
  Scenario: Crear un repositorio con un nombre ya existente
    Given que ya existe un repositorio con el nombre "{repo}"
    When envío un POST a "/user/repos" con el mismo nombre
    Then el status code es 422

  @regression
  Scenario: Consultar un repositorio inexistente
    When envío un GET a "/repos/{owner}/repo-que-no-existe-999"
    Then el status code es 404
```

## Historia de Usuario 3 — Issues: listar y crear

```gherkin
Feature: Issues de un repositorio
  Como analista QA
  Quiero listar y crear issues en un repositorio
  Para validar la estructura y comportamiento del endpoint

  Background:
    Given que estoy autenticado con un token válido de GitHub
    And que existe un repositorio "{owner}/{repo}"

  @smoke
  Scenario: Crear un issue
    When envío un POST a "/repos/{owner}/{repo}/issues" con un título y un body
    Then el status code es 201
    And el campo "number" es un número mayor a 0
    And el campo "title" coincide con el enviado
    And el campo "state" es "open"
    And el campo "user.login" coincide con mi username

  @smoke
  Scenario: Listar los issues del repositorio
    Given que creé un issue en el repositorio
    When envío un GET a "/repos/{owner}/{repo}/issues"
    Then el status code es 200
    And la respuesta es un array
    And el array contiene el issue creado

  @regression
  Scenario: Crear un issue sin título
    When envío un POST a "/repos/{owner}/{repo}/issues" sin el campo "title"
    Then el status code es 422

  @regression
  Scenario: Listar issues de un repositorio inexistente
    When envío un GET a "/repos/{owner}/repo-que-no-existe-999/issues"
    Then el status code es 404
```
