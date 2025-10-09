import api from "./api";

// ExternalAsset
export const getAllExternalAssets = () => api.get("/externalAsset/getAll");
export const getExternalAssetById = (id) => api.get("/externalAsset/getById", { params: { id } });
export const createExternalAsset = (data) => api.post("/externalAsset/create", data);
export const updateExternalAsset = (id, data) => api.put("/externalAsset/update", data, { params: { id } });
export const deleteExternalAsset = (id) => api.delete("/externalAsset/delete", { params: { id } });

export default {
  getAllExternalAssets,
  getExternalAssetById,
  createExternalAsset,
  updateExternalAsset,
  deleteExternalAsset,
};


