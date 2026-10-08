// src/models/IssueRequest.js

class IssueRequest {
  /**
   * @param {string} title - Título del issue
   * @param {string} body - Descripción del issue
   */
  constructor(title, body) {
    this.title = title;
    this.body = body;
  }

  /**
   * Serializa el objeto a un JSON listo para enviar en el body del request.
   * Si no hay título, no se envía el campo (para probar el caso negativo).
   * @returns {object}
   */
  toJSON() {
    const json = { body: this.body };
    if (this.title !== undefined) {
      json.title = this.title;
    }
    return json;
  }
}

module.exports = { IssueRequest };
