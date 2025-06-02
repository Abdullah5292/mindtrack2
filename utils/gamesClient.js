import axios from 'axios';

const gamesClient = axios.create({
  baseURL: 'http://localhost:3002/games',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default gamesClient;

export const getGames = async (search) => {
  const response = await gamesClient.get("/", { params: { search } });
  if (response.data?.status) return response.data.data;
  return false;
};

export const getGameById = async (id) => {
  const response = await gamesClient.get(`/${id}`);
  if (response.data?.status) return response.data.data;
  return false;
};

export const createGame = async (gameData) => {
  const response = await gamesClient.post("/", gameData);
  if (response.data?.status) return response.data.data;
  return false;
};

export const updateGame = async (id, gameData) => {
  const response = await gamesClient.put(`/${id}`, gameData);
  if (response.data?.status) return response.data.data;
  return false;
};

export const deleteGame = async (id) => {
  const response = await gamesClient.delete(`/${id}`);
  if (response.data?.status) return response.data.data;
  return false;
}; 