// src/models/RepoRequest.js

class RepoRequest {
  /**
   * @param {string} name - Nombre del repositorio
   * @param {string} description - Descripción del repositorio
   * @param {boolean} isPrivate - Si el repositorio es privado
   */
  constructor(name, description, isPrivate = true) {
    this.name = name;
    this.description = description;
    this.isPrivate = isPrivate;
  }

  /**
   * Serializa el objeto a un JSON listo para enviar en el body del request.
   * @returns {object}
   */
  toJSON() {
    return {
      name: this.name,
      description: this.description,
      private: this.isPrivate,
    };
  }
}

module.exports = { RepoRequest };
