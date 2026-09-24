// src/models/UserResponse.js

class UserResponse {
  /**
   * Deserializa el JSON de la API en un objeto manejable.
   * @param {object} data - El body del response
   */
  constructor(data) {
    this.login = data.login;
    this.id = data.id;
    this.avatarUrl = data.avatar_url;
    this.reposUrl = data.repos_url;
    this.type = data.type;
    this.message = data.message || null;
  }

  /**
   * Verifica que el login es un string no vacío.
   * @returns {boolean}
   */
  hasValidLogin() {
    return typeof this.login === 'string' && this.login.trim().length > 0;
  }

  /**
   * Verifica que el id es un número mayor a 0.
   * @returns {boolean}
   */
  hasValidId() {
    return typeof this.id === 'number' && this.id > 0;
  }

  /**
   * Verifica que avatar_url empieza con https://
   * @returns {boolean}
   */
  hasValidAvatarUrl() {
    return typeof this.avatarUrl === 'string' && this.avatarUrl.startsWith('https://');
  }

  /**
   * Verifica que repos_url es una URL válida.
   * @returns {boolean}
   */
  hasValidReposUrl() {
    try {
      new URL(this.reposUrl);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Verifica que type está presente.
   * @returns {boolean}
   */
  hasType() {
    return typeof this.type === 'string' && this.type.length > 0;
  }
}

module.exports = { UserResponse };
