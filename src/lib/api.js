const API_BASE_URL = 'http://127.0.0.1:3000/api/v1';

class ApiClient {
  constructor() {
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (response.status === 204) {
        return null;
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  // Authentication
  async signup(userData) {
    return this.request('/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials) {
    return this.request('/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  // Products
  async getProducts(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/products${query ? `?${query}` : ''}`);
  }

  async getProduct(id) {
    return this.request(`/products/${id}`);
  }

  async getCategories() {
    return this.request('/categories');
  }

  // User
  async getProfile() {
    return this.request('/users/profile');
  }

  async updateProfile(id, data) {
    return this.request(`/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // Cart
  async getCartItems(cartId) {
    return this.request(`/carts/${cartId}/cart_items`);
  }

  async addToCart(cartId, item) {
    return this.request(`/carts/${cartId}/cart_items`, {
      method: 'POST',
      body: JSON.stringify(item),
    });
  }

  async updateCartItem(cartId, itemId, data) {
    return this.request(`/carts/${cartId}/cart_items/${itemId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async removeFromCart(cartId, itemId) {
    return this.request(`/carts/${cartId}/cart_items/${itemId}`, {
      method: 'DELETE',
    });
  }

  // Wishlist
  async getWishlist(userId) {
    return this.request(`/users/${userId}/wishlist`);
  }

  async toggleWishlist(productId) {
    return this.request(`/products/${productId}/toggle_wishlist`, {
      method: 'POST',
    });
  }

  // Orders
  async getOrders() {
    return this.request('/orders');
  }

  async getOrder(id) {
    return this.request(`/orders/${id}`);
  }

  async createOrder(orderData) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async cancelOrder(id) {
    return this.request(`/orders/${id}/cancel`, {
      method: 'PATCH',
    });
  }

  // Checkout
  async createCheckoutSession() {
    return this.request('/checkout', {
      method: 'POST',
    });
  }

  async getCheckoutSession(sessionId) {
    return this.request(`/checkout/session/${sessionId}`);
  }
}

export const apiClient = new ApiClient();
