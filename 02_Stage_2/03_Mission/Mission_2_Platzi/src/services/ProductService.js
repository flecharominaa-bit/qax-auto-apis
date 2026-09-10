class ProductService {
  constructor(request) {
    this.request = request;
  }

  async getProducts(params = {}) {
    const response = await this.request.get('products', { params });
    const body = await response.json().catch(() => ({}));
    return { status: response.status(), body };
  }

  async getProductById(id) {
    const response = await this.request.get(`products/${id}`);
    const body = await response.json().catch(() => ({}));
    return { status: response.status(), body };
  }
}

module.exports = { ProductService };
