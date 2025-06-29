import axios from "axios";

const API_URL = "http://localhost:3000/api/question";

export const createQuestion = async ( questionText, subjectId, answer ) => {
  try {
    const response = await axios.post(`${API_URL}/create`, { questionText, subjectId, answer });
    return response.data.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const getQuestions = async () => {
  try {
    const response = await axios.get(`${API_URL}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};


export const updateQuestion = async (questionId, questionText, answer) => {
  try {
    const response = await axios.put(`${API_URL}/update/${questionId}`, { questionText, answer });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const deleteQuestion = async (questionId) => {
  try {
    const response = await axios.delete(`${API_URL}/delete/${questionId}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const getQuestionsBySubjectId = async (subjectId) => {
  try {
    const response = await axios.get(`${API_URL}/list/${subjectId}`);
    return response.data.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};