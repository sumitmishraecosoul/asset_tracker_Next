import api from "./api";

// Asset
export const getAllAssets = () => api.get("/asset/getAllAssets");
export const getAssetsById = (id) => api.get(`/asset/getAssetsById`, { params: { id } });
export const createAssets = (data) => api.post("/asset/createAssets", data);
export const checkOutAsset = (data) => api.post("/asset/checkOut", data);
export const deleteAssets = (id) => api.delete(`/asset/deleteAssets`, { params: { id } });
export const getAssetsByStatus = () => api.get("/asset/getAssetsByStatus");
export const getAssetsCountByCategory = () => api.get("/asset/getAssetsCountByCategory");

export default {
  getAllAssets,
  getAssetsById,
  createAssets,
  checkOutAsset,
  deleteAssets,
  getAssetsByStatus,
  getAssetsCountByCategory,
};


