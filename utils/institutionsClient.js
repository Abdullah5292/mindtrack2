// ... existing code ...

export const getInstitutions = async (search) => {
  const response = await institutionsClient.get("/institutions/", { params: { search } });
  if (response.data?.status) return response.data.data;
  return false;
};

export const getInstitutionById = async (id) => {
  const response = await institutionsClient.get(`/institutions/${id}`);
  if (response.data?.status) return response.data.data;
  return false;
};

export const createInstitution = async (institutionData) => {
  const response = await institutionsClient.post("/institutions/", institutionData);
  if (response.data?.status) return response.data.data;
  return false;
};

export const updateInstitution = async (id, institutionData) => {
  const response = await institutionsClient.put(`/institutions/${id}`, institutionData);
  if (response.data?.status) return response.data.data;
  return false;
};

export const deleteInstitution = async (id) => {
  const response = await institutionsClient.delete(`/institutions/${id}`);
  if (response.data?.status) return response.data.data;
  return false;
};