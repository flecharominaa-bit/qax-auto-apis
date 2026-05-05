 Gestión de perfil y seguridad de usuario

  Scenario: Consultar perfil de usuario autenticado
    Given que el usuario está logueado y tiene un token válido
    When realiza una petición GET a "/users/profile" con el header "x-auth-token"
    Then el código de respuesta debe ser 200
    And la respuesta debe contener id, name y email

  Scenario: Cambiar contraseña correctamente
    Given que el usuario está autenticado
    When realiza una petición POST a "/users/change-password" con contraseña actual y nueva
    Then el código de respuesta debe ser 200
    And la respuesta debe confirmar que la contraseña fue actualizada

  Scenario: Solicitar recuperación de contraseña
    Given que el usuario existe en el sistema
    When realiza una petición POST a "/users/forgot-password" con su email
    Then el código de respuesta debe ser 200
    And la respuesta debe indicar que se envió el enlace

  Scenario: Verificar token de recuperación
    	Given que el usuario tiene un token de recuperación inválido o expirado
	When realiza una petición POST a "/users/verify-reset-password-token"
	Then el código de respuesta debe ser 401
	And la respuesta debe indicar que el token es inválido o expirado

  Scenario: Resetear contraseña y hacer login-token invalido 
	Given que el usuario tiene un token inválido o expirado
	When realiza una petición POST a "/users/reset-password"
	Then el código de respuesta debe ser 401
	And la respuesta debe indicar que el token es inválido o expirado

Nota:

Durante las pruebas no fue posible obtener un token válido de recuperación de contraseña desde la API.
Por este motivo, no se pudo completar el flujo positivo de reset de contraseña
Se validaron escenarios negativos utilizando tokens inválidos o expirados para verificar el comportamiento del sistema

    
