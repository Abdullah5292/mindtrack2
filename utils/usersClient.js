import axios from 'axios';

const usersClient = axios.create({
  baseURL: 'http://localhost:3001/admin/users',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default usersClient;

export const getUsers = async (search) => {
  const response = await usersClient.get("/", { params: { search } });
  if (response.data?.status) return response.data.data;
  return false;
};

export const getUserById = async (id) => {
  const response = await usersClient.get(`/${id}`);
  if (response.data?.status) return response.data.data;
  return false;
};

export const createUser = async (userData) => {
  const response = await usersClient.post("/", userData);
  if (response.data?.status) return response.data.data;
  return false;
};

export const updateUser = async (id, userData) => {
  const response = await usersClient.put(`/${id}`, userData);
  if (response.data?.status) return response.data.data;
  return false;
};

export const deleteUser = async (id) => {
  const response = await usersClient.delete(`/${id}`);
  if (response.data?.status) return response.data.data;
  return false;
}; 