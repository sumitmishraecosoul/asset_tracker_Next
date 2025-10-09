import api from "./api";

// Location
export const getAllLocations = () => api.get("/location/getAlllocations");
export const getAllSites = () => api.get("/location/getAllSites");
export const getLocationById = (id) => api.get(`/location/getById`, { params: { id } });
export const createLocation = (data) => api.post("/location/create", data);
export const updateLocation = (id, data) => api.put("/location/update", data, { params: { id } });
export const deleteLocation = (id) => api.delete("/location/delete", { params: { id } });

export default {
  getAllLocations,
  getAllSites,
  getLocationById,
  createLocation,
  updateLocation,
  deleteLocation
};


