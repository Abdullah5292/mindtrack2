import axios from 'axios';

const gamesClient = axios.create({
  baseURL: 'http://localhost:3002',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default gamesClient; 