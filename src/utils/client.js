import { authenticatedAxios } from "./axios";

export const getUsers = async (search) => {
  const response = await authenticatedAxios.get("/admin/users/", { params: { search } });
  if (response.data?.status) return response.data.data;
  return false;
};

export const getInstitutions = async (search) => {
  const response = await authenticatedAxios.get("/institutions/", { params: { search } });
  if (response.data?.status) return response.data.data;
  return false;
};

export const getQuestions = async () => {
  const response = await authenticatedAxios.get("/questions/");
  if (response.data?.status) return response.data.data;
  return false;
};

export const getGames = async (search) => {
  const response = await authenticatedAxios.get("/games/", { params: { search } });
  if (response.data?.status) return response.data.data;
  return false;
};

export const getRoles = async (search) => {
  const response = await authenticatedAxios.get("/roles/", { params: { search } });
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
export const getPlayers = async (search) => {
  const response = await authenticatedAxios.get("/players/", { params: { search } });
  if (response.data?.status) return response.data.data;
  return false;
}
export const getPlayerById = async (id) => {
  const response = await authenticatedAxios.post("/players/${id}");
  if (response.data?.status) return response.data.data;
  return false;
}

