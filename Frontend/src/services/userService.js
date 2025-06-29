import axios from "axios";

const API_URL = "http://localhost:3000/api/user";

export const registerUser = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/register`, { username, password });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
}

export const loginUser = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { username, password });
    // Store the user data in localStorage or sessionStorage
    localStorage.setItem('user', JSON.stringify(response.data.data));
    
    return response.data.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
}