// src/models/RepoResponse.js

class RepoResponse {
  /**
   * Deserializa el JSON de la API en un objeto manejable.
   * @param {object} data - El body del response
   */
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.fullName = data.full_name;
    this.description = data.description;
    this.isPrivate = data.private;
    this.ownerLogin = data.owner ? data.owner.login : null;
    this.htmlUrl = data.html_url;
    this.message = data.message || null;
  }

  /**
   * Verifica que el id es un número mayor a 0.
   * @returns {boolean}
   */
  hasValidId() {
    return typeof this.id === 'number' && this.id > 0;
  }

  /**
   * Verifica que full_name tiene el formato {owner}/{repo}.
   * @param {string} owner
   * @param {string} repo
   * @returns {boolean}
   */
  hasFullName(owner, repo) {
    return typeof this.fullName === 'string'
      && this.fullName.toLowerCase() === `${owner}/${repo}`.toLowerCase();
  }

  /**
   * Verifica que html_url empieza con https://
   * @returns {boolean}
   */
  hasValidHtmlUrl() {
    return typeof this.htmlUrl === 'string' && this.htmlUrl.startsWith('https://');
  }
}

module.exports = { RepoResponse };
