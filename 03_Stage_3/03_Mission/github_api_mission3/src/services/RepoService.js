// src/services/RepoService.js

const { RepoResponse } = require('../models/RepoResponse');

class RepoService {
  /**
   * @param {import('@playwright/test').APIRequestContext} request
   */
  constructor(request) {
    this.request = request;
  }

  /**
   * Crea un repositorio para el usuario autenticado.
   * @param {import('../models/RepoRequest').RepoRequest} repoRequest
   * @returns {Promise<{ status: number, body: RepoResponse }>}
   */
  async createRepo(repoRequest) {
    const response = await this.request.post('/user/repos', { data: repoRequest.toJSON() });
    const body = await response.json();
    return {
      status: response.status(),
      body: new RepoResponse(body),
    };
  }

  /**
   * Obtiene un repositorio.
   * @param {string} owner
   * @param {string} repo
   * @returns {Promise<{ status: number, body: RepoResponse }>}
   */
  async getRepo(owner, repo) {
    const response = await this.request.get(`/repos/${owner}/${repo}`);
    const body = await response.json();
    return {
      status: response.status(),
      body: new RepoResponse(body),
    };
  }

  /**
   * Actualiza parcialmente un repositorio.
   * @param {string} owner
   * @param {string} repo
   * @param {object} fields - Campos a actualizar (ej: { description })
   * @returns {Promise<{ status: number, body: RepoResponse }>}
   */
  async patchRepo(owner, repo, fields) {
    const response = await this.request.patch(`/repos/${owner}/${repo}`, { data: fields });
    const body = await response.json();
    return {
      status: response.status(),
      body: new RepoResponse(body),
    };
  }
}

module.exports = { RepoService };
