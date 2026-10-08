// src/services/IssueService.js

const { IssueResponse } = require('../models/IssueResponse');

class IssueService {
  /**
   * @param {import('@playwright/test').APIRequestContext} request
   */
  constructor(request) {
    this.request = request;
  }

  /**
   * Lista los issues de un repositorio.
   * @param {string} owner
   * @param {string} repo
   * @returns {Promise<{ status: number, body: IssueResponse[] | object }>}
   */
  async listIssues(owner, repo) {
    const response = await this.request.get(`/repos/${owner}/${repo}/issues`);
    const body = await response.json();
    return {
      status: response.status(),
      // Si la respuesta es un array se mapea a modelos; si es un error se devuelve tal cual
      body: Array.isArray(body) ? body.map((issue) => new IssueResponse(issue)) : body,
    };
  }

  /**
   * Crea un issue en un repositorio.
   * @param {string} owner
   * @param {string} repo
   * @param {import('../models/IssueRequest').IssueRequest} issueRequest
   * @returns {Promise<{ status: number, body: IssueResponse }>}
   */
  async createIssue(owner, repo, issueRequest) {
    const response = await this.request.post(`/repos/${owner}/${repo}/issues`, { data: issueRequest.toJSON() });
    const body = await response.json();
    return {
      status: response.status(),
      body: new IssueResponse(body),
    };
  }
}

module.exports = { IssueService };
