import axios from 'axios';
import { baseUrl } from "@crema/constants/AppConst.jsx";

const apiConfig = axios.create({
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
});
const jwtAxios = apiConfig?.create({
  baseURL: baseUrl, 
  headers: {
    'Content-Type': 'application/json',
  },
});

jwtAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // or use another method to get the token
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


// jwtAxios.interceptors.response.use(
//   (res) => res,
//   (err) => {
//     if (err.response && err.response.data.msg === 'Token is not valid') {
//       console.log('Need to logout user');
//       // store.dispatch({type: LOGOUT});
//     }
//     return Promise.reject(err);
//   },
// );
export const setAuthToken = (token) => {
  if (token) {
    jwtAxios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    localStorage.setItem('token', token);
  } else {
    delete jwtAxios.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
  }
};

export default jwtAxios;



