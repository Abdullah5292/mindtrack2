import axios from "axios";
import { NotificationManager } from "react-notifications";

import store from "src/redux";
import getConfig from "next/config";
import { setLoading } from "src/redux/reducers/settings";

const config = getConfig();

// const baseConfig = {
//   baseURL: config.publicRuntimeConfig.backend,
// };

const onResponseSuccess = (response) => {
  store.dispatch(setLoading(false));
  if (String(response.config.method).toUpperCase() !== "GET") {
    if (response.data.status) NotificationManager.success(response.data.message);
    else NotificationManager.error(response.data.message);
  }
  return response;
};

const onResponseError = (response) => {
  store.dispatch(setLoading(false));
  if (String(response.config.method).toUpperCase() !== "GET") {
    if (response.response.data.status !== undefined)
      NotificationManager.error(response.response.data.message);
    else NotificationManager.error("Something went wrong");
  }
  return response;
};

export const unauthenticatedAxios = axios.create();
export const authenticatedAxios = axios.create();

unauthenticatedAxios.interceptors.request.use((config) => {
  store.dispatch(setLoading(true));
  return config;
});

authenticatedAxios.interceptors.request.use((config) => {
  store.dispatch(setLoading(true));
  config.headers.Authorization = `Bearer ${store.getState().user?.token}`;
  return config;
});

unauthenticatedAxios.interceptors.response.use(onResponseSuccess, onResponseError);
authenticatedAxios.interceptors.response.use(onResponseSuccess, onResponseError);
