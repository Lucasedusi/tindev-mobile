import axios from 'axios';

const localhost = '192.168.1.5'

const api = axios.create({
  baseURL: `http://${localhost}:3333`,
});

export default api;