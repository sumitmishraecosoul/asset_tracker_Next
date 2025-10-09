import api from "./api";

// Category
export const getAllCategories = () => api.get("/category/getAllCategories");
export const getCategoryById = (id) => api.get(`/category/getById`, { params: { id } });
export const createCategory = (data) => api.post("/category/create", data);
export const updateCategory = (id, data) => api.put("/category/update", data, { params: { id } });
export const deleteCategory = (id) => api.delete("/category/delete", { params: { id } });

export default {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};


