class AuthService {
  constructor(request) {
    this.request = request;
  }

  async login(email, password) {
    const response = await this.request.post('auth/login', {
      data: { email, password },
    });
    const body = await response.json().catch(() => ({}));
    return { status: response.status(), body };
  }

  async getProfile(token) {
    const response = await this.request.get('auth/profile', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await response.json().catch(() => ({}));
    return { status: response.status(), body };
  }
}

module.exports = { AuthService };
