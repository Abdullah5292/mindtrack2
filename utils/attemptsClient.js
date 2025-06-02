import axios from 'axios';

const attemptsClient = axios.create({
  baseURL: 'http://localhost:3003',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default attemptsClient;

export const getAttempts = async (search) => {
  const response = await attemptsClient.get("/attempts/", { params: { search } });
  if (response.data?.status) return response.data.data;
  return false;
};

export const getAttemptById = async (id) => {
  const response = await attemptsClient.get(`/attempts/${id}`);
  if (response.data?.status) return response.data.data;
  return false;
};

export const createAttempt = async (attemptData) => {
  const response = await attemptsClient.post("/attempts/", attemptData);
  if (response.data?.status) return response.data.data;
  return false;
};

export const updateAttempt = async (id, attemptData) => {
  const response = await attemptsClient.put(`/attempts/${id}`, attemptData);
  if (response.data?.status) return response.data.data;
  return false;
};

export const deleteAttempt = async (id) => {
  const response = await attemptsClient.delete(`/attempts/${id}`);
  if (response.data?.status) return response.data.data;
  return false;
}; 