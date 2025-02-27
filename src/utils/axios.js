import axios from "axios";
import { NotificationManager } from "react-notifications";

import store from "src/redux";

const baseConfig = {
  baseURL: process.env.BACKEND || "http://localhost:3001/admin",
};

const onResponse = (response) => {
  if (String(response.config.method).toUpperCase() !== "GET") {
    if (response.data.status) NotificationManager.success(response.data.message);
    else NotificationManager.error(response.data.message);
  }
  return response
};

export const unauthenticatedAxios = axios.create(baseConfig);
export const authenticatedAxios = axios.create(baseConfig);

unauthenticatedAxios.interceptors.request.use((config) => {
  return config;
});

authenticatedAxios.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${store.getState().user?.token}`;
  return config;
});

unauthenticatedAxios.interceptors.response.use(onResponse)
authenticatedAxios.interceptors.response.use(onResponse)
