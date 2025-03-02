import { authenticatedAxios } from "./axios";

export const getUsers = async () => {
  const response = await authenticatedAxios.get("/users/");
  if (response.data?.status) return response.data.data;
  return false;
};

export const getInstitutions = async () => {
  const response = await authenticatedAxios.get("/institutions/");
  if (response.data?.status) return response.data.data;
  return false;
};

export const getQuestions = async () => {
  const response = await authenticatedAxios.get("/questions/");
  if (response.data?.status) return response.data.data;
  return false;
};

export const getGames = async () => {
  const response = await authenticatedAxios.get("/games/");
  if (response.data?.status) return response.data.data;
  return false;
};

export const getRoles = async () => {
  const response = await authenticatedAxios.get("/roles/");
  if (response.data?.status) return response.data.data;
  return false;
};

export const getPermissions = async () => {
  const response = await authenticatedAxios.get("/roles/permissions");
  if (response.data?.status) return response.data.data;
  return false;
};

export const getInstitutionTypes = async () => {
  const response = await authenticatedAxios.get("/institutions/types");
  if (response.data?.status) return response.data.data;
  return false;
};

