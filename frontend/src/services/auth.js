import api from './api';

export const authService = {
  async login(email, password) {
    try {
      console.log('Login attempt:', { email }); // Debug log
      const response = await api.post('/auth/signin', { email, password });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify({
          id: response.data._id,
          name: response.data.name,
          email: response.data.email
        }));
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  async register(userData) {
    try {
      console.log('Register attempt:', { 
        name: `${userData.firstName} ${userData.lastName}`,
        email: userData.email 
      }); // Debug log

      const response = await api.post('/auth/signup', {
        name: `${userData.firstName} ${userData.lastName}`,
        email: userData.email,
        password: userData.password
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify({
          id: response.data._id,
          name: response.data.name,
          email: response.data.email
        }));
      }
      return response.data;
    } catch (error) {
      console.error('Register error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated() {
    return !!localStorage.getItem('token');
  }
}; 