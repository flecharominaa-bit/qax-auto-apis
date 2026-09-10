class HomebankingService {
  constructor(request) {
    this.request = request;
    this.token = null;
  }

  authHeaders() {
    return this.token ? { Authorization: `Bearer ${this.token}` } : {};
  }

  async registrar({ username, password, name, email }) {
    const response = await this.request.post('/auth/registro', {
      data: { username, password, name, email },
    });
    const body = await response.json().catch(() => ({}));
    return { status: response.status(), body };
  }

  async login(username, password) {
    const response = await this.request.post('/auth/login', {
      data: { username, password },
    });
    const body = await response.json().catch(() => ({}));
    if (response.status() === 200 && body?.access_token) {
      this.token = body.access_token;
    }
    return { status: response.status(), body };
  }

  async resetearSistema() {
    const response = await this.request.post('/sistema/resetear', {
      headers: this.authHeaders(),
    });
    return { status: response.status() };
  }

  async getDashboard() {
    const response = await this.request.get('/cliente/dashboard', {
      headers: this.authHeaders(),
    });
    const body = await response.json().catch(() => ({}));
    return { status: response.status(), body };
  }

  async getCuentas() {
    const response = await this.request.get('/cuentas/', {
      headers: this.authHeaders(),
    });
    const body = await response.json().catch(() => ({}));
    return { status: response.status(), body };
  }

  async getTransacciones(limit = 10) {
    const response = await this.request.get('/transacciones/', {
      headers: this.authHeaders(),
      params: { limit },
    });
    const body = await response.json().catch(() => ({}));
    return { status: response.status(), body };
  }
}

module.exports = { HomebankingService };
