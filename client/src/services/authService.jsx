import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/auth/'; // Your backend auth URL

const register = (email, fullName, password) => {
  return axios.post(API_URL + 'register', {
    email,
    full_name: fullName,
    password,
  });
};

const login = (email, password) => {
  const params = new URLSearchParams();
  params.append('username', email); // FastAPI's OAuth2PasswordRequestForm expects 'username'
  params.append('password', password);

  return axios.post(API_URL + 'token', params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  }).then((response) => {
    if (response.data.access_token) {
      localStorage.setItem('user', JSON.stringify(response.data)); // Store token and type
    }
    return response.data;
  });
};

const logout = () => {
  localStorage.removeItem('user');
};

const getCurrentUserToken = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    return JSON.parse(userStr).access_token;
  }
  return null;
};

const authService = {
  register,
  login,
  logout,
  getCurrentUserToken,
};

export default authService;