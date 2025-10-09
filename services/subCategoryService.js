import api from "./api";

// SubCategory
export const getAllSubcategories = () => api.get("/subCategory/getAllSubcategories");
export const getSubcategoryById = (id) => api.get(`/subCategory/getById`, { params: { id } });
export const createSubcategory = (data) => api.post("/subCategory/create", data);
export const updateSubcategory = (id, data) => api.put("/subCategory/update", data, { params: { id } });
export const deleteSubcategory = (id) => api.delete("/subCategory/delete", { params: { id } });

export default {
  getAllSubcategories,
  getSubcategoryById,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory
};


