/**
 * Initialize an API service with a backend URL.
 */

import axios from "axios";

export const API_BASE_URL = import.meta.env.PROD
  ? "/" // Or the correct backend URL
  : "http://localhost:8080";

// Create an Axios instance
const apiService = axios.create({
  baseURL: API_BASE_URL,
});

export default apiService;