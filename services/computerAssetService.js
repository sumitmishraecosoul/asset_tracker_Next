import api from "./api";

// ComputerAsset
export const getAllComputerAssets = () => api.get("/computerAsset/getAll");
export const getComputerAssetById = (id) => api.get("/computerAsset/getById", { params: { id } });
export const createComputerAsset = (data) => api.post("/computerAsset/create", data);
export const updateComputerAsset = (id, data) => api.put("/computerAsset/update", data, { params: { id } });
export const deleteComputerAsset = (id) => api.delete("/computerAsset/delete", { params: { id } });

export default {
  getAllComputerAssets,
  getComputerAssetById,
  createComputerAsset,
  updateComputerAsset,
  deleteComputerAsset,
};


