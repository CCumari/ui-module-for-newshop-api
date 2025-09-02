const API_BASE_URL = 'http://127.0.0.1:3000/api/v1';

class ApiClient {
  private token: string | null;

  constructor() {
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
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
  async signup(userData: any) {
    return this.request('/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: { email: string; password: string }) {
    return this.request('/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  // Products
  async getProducts(params: Record<string, any> = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/products${query ? `?${query}` : ''}`);
  }

  async getProduct(id: number) {
    return this.request(`/products/${id}`);
  }

  async getCategories() {
    return this.request('/categories');
  }

  // User
  async getProfile() {
    return this.request('/users/profile');
  }

  async updateProfile(id: number, data: any) {
    return this.request(`/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // Cart
  async getCartItems(cartId: number) {
    return this.request(`/carts/${cartId}/cart_items`);
  }

  async addToCart(cartId: number, item: any) {
    return this.request(`/carts/${cartId}/cart_items`, {
      method: 'POST',
      body: JSON.stringify(item),
    });
  }

  async updateCartItem(cartId: number, itemId: number, data: any) {
    return this.request(`/carts/${cartId}/cart_items/${itemId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async removeFromCart(cartId: number, itemId: number) {
    return this.request(`/carts/${cartId}/cart_items/${itemId}`, {
      method: 'DELETE',
    });
  }

  // Wishlist
  async getWishlist(userId: number) {
    return this.request(`/users/${userId}/wishlist`);
  }

  async toggleWishlist(productId: number) {
    return this.request(`/products/${productId}/toggle_wishlist`, {
      method: 'POST',
    });
  }

  // Orders
  async getOrders() {
    return this.request('/orders');
  }

  async getOrder(id: number) {
    return this.request(`/orders/${id}`);
  }

  async createOrder(orderData: any) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async cancelOrder(id: number) {
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

  async getCheckoutSession(sessionId: string) {
    return this.request(`/checkout/session/${sessionId}`);
  }
}

export const apiClient = new ApiClient();
