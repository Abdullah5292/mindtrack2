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

export const createUser = async (userData) => {
  const response = await usersClient.post("/", userData);
  if (response.data?.status) return response.data.data;
  return false;
};

export const updateUser = async (id, userData) => {
  const response = await usersClient.put("/", userData);
  if (response.data?.status) return response.data.data;
  return false;
};

export const deleteUser = async (id) => {
  const response = await usersClient.delete("/");
  if (response.data?.status) return response.data.data;
  return false;
}; 