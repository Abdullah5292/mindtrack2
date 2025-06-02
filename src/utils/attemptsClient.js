import axios from 'axios';

const attemptsClient = axios.create({
  baseURL: 'http://localhost:3003',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default attemptsClient; 