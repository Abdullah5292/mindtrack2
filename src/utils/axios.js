import axios from "axios";
import { NotificationManager } from "react-notifications";

import store from "src/redux";
import getConfig from "next/config";

const config = getConfig();

const baseConfig = {
  baseURL: config.publicRuntimeConfig.backend,
};

const onResponseSuccess = (response) => {
  if (String(response.config.method).toUpperCase() !== "GET") {
    if (response.data.status) NotificationManager.success(response.data.message);
    else NotificationManager.error(response.data.message);
  }
  return response;
};

const onResponseError = (response) => {
  if (String(response.config.method).toUpperCase() !== "GET") {
    if (response.response.data.status !== undefined)
      NotificationManager.error(response.response.data.message);
    else NotificationManager.error("Something went wrong");
  }
  return response;
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

unauthenticatedAxios.interceptors.response.use(onResponseSuccess, onResponseError);
authenticatedAxios.interceptors.response.use(onResponseSuccess, onResponseError);
