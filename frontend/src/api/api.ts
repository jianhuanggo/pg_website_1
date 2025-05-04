import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const stripeApi = {
  createPaymentIntent: async (amount: number, currency: string = 'usd', description?: string) => {
    try {
      const response = await api.post('/api/stripe/create-payment-intent', {
        amount,
        currency,
        description,
      });
      return response.data;
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  },
};

export const patreonApi = {
  getToken: async (code: string, redirectUri: string) => {
    try {
      const response = await api.post('/api/patreon/oauth/token', {
        code,
        redirect_uri: redirectUri,
      });
      return response.data;
    } catch (error) {
      console.error('Error getting Patreon token:', error);
      throw error;
    }
  },
  
  getUserInfo: async (accessToken: string) => {
    try {
      const response = await api.get('/api/patreon/user', {
        params: { access_token: accessToken },
      });
      return response.data;
    } catch (error) {
      console.error('Error getting Patreon user info:', error);
      throw error;
    }
  },
};

export const bmcApi = {
  getSupporters: async (accessToken: string) => {
    try {
      const response = await api.get('/api/buymeacoffee/supporters', {
        params: { access_token: accessToken },
      });
      return response.data;
    } catch (error) {
      console.error('Error getting BMC supporters:', error);
      throw error;
    }
  },
  
  getExtras: async (accessToken: string) => {
    try {
      const response = await api.get('/api/buymeacoffee/extras', {
        params: { access_token: accessToken },
      });
      return response.data;
    } catch (error) {
      console.error('Error getting BMC extras:', error);
      throw error;
    }
  },
};

export default api;
