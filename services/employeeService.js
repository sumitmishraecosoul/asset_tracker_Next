import api from "./api";

// Employee
export const getAllEmployees = () => api.get("/employee/getAllEmployees");
export const createEmployee = (data) => api.post("/employee/createEmployee", data);
export const getEmployeeById = (id) => api.get("/employee/getEmployeeById", { params: { id } });
// Note: update route not shown in swagger screenshot; keeping a conventional one if backend adds it later
export const updateEmployee = (id, data) => api.put("/employee/updateEmployee", data, { params: { id } });
export const deleteEmployee = (id) => api.delete("/employee/deleteEmployee", { params: { id } });

export default {
  getAllEmployees,
  createEmployee,
  getEmployeeById,
  updateEmployee,
  deleteEmployee
};


