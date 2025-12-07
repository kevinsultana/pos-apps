import axios from 'axios';

const BaseApi = axios.create({
  baseURL: 'https://posapi.kevinsultana.online',
  // baseURL: 'http://192.168.0.200:8080',
});

export default BaseApi;
