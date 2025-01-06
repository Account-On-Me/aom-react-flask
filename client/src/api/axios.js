import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8888/api',
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

export function GET(url, params = {}, config = {}) {
  const axiosConfig = {
    ...config,
    params: params
  };
  return new Promise((resolve, reject) => { 
    instance.get(url, axiosConfig)
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        reject(error);
      });
  });
}

export function POST(url, data = {}, config = {}) { 
  return new Promise((resolve, reject) => {
    instance.post(url, data, config)
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        reject(error);
      });
  });
}

export function DELETE(url, params = {}, config = {}) {
  const axiosConfig = {
    ...config,
    params: params
  };
  return new Promise((resolve, reject) => {
    instance.delete(url, axiosConfig)
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        reject(error);
      });
  });
}