// src/models/IssueResponse.js

class IssueResponse {
  /**
   * Deserializa el JSON de la API en un objeto manejable.
   * @param {object} data - El body del response
   */
  constructor(data) {
    this.id = data.id;
    this.number = data.number;
    this.title = data.title;
    this.body = data.body;
    this.state = data.state;
    this.userLogin = data.user ? data.user.login : null;
    this.labels = data.labels;
    this.createdAt = data.created_at;
    this.message = data.message || null;
  }

  /**
   * Verifica que id y number son números mayores a 0.
   * @returns {boolean}
   */
  hasValidNumber() {
    return typeof this.id === 'number' && this.id > 0
      && typeof this.number === 'number' && this.number > 0;
  }

  /**
   * Verifica que title es un string no vacío.
   * @returns {boolean}
   */
  hasValidTitle() {
    return typeof this.title === 'string' && this.title.trim().length > 0;
  }

  /**
   * Verifica que labels es un array.
   * @returns {boolean}
   */
  hasLabelsArray() {
    return Array.isArray(this.labels);
  }

  /**
   * Verifica que created_at es una fecha válida.
   * @returns {boolean}
   */
  hasValidCreatedAt() {
    return typeof this.createdAt === 'string' && !isNaN(Date.parse(this.createdAt));
  }
}

module.exports = { IssueResponse };
