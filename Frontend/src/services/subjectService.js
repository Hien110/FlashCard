import axios from "axios";

const API_URL = "http://localhost:3000/api/subject";

export const createSubject = async ( userId, name, description ) => {
  try {
    const response = await axios.post(`${API_URL}/create`, { userId, name, description });
    return response.data.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const getSubjects = async () => {
  try {
    const response = await axios.get(`${API_URL}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const getSubjectByUserId = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/list/${userId}`);
    return response.data.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const updateSubject = async (subjectId, name, description) => {
  try {
    const response = await axios.put(
      `${API_URL}/update/${subjectId}`,
      { name, description }
    );
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const deleteSubject = async (subjectId) => {
  try {
    const response = await axios.delete(`${API_URL}/delete/${subjectId}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const getSubjectById = async (subjectId) => {
  try {
    const response = await axios.get(`${API_URL}/get/${subjectId}`);
    return response.data.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};