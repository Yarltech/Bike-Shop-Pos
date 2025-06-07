import { BASE_BACKEND_URL } from "./config";
import axios from "axios";

export const saveService = async (serviceData) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      return { errorDescription: "Authentication required. Please login again." };
    }
    const response = await axios.post(`${BASE_BACKEND_URL}/service/save`, serviceData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error saving service:', error);
    return { errorDescription: error.response?.data?.message || error.response?.data?.errorDescription || "An error occurred while saving the service." };
  }
};

export const updateService = async (serviceData) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      return { errorDescription: "Authentication required. Please login again." };
    }
    const response = await axios.post(`${BASE_BACKEND_URL}/service/update`, serviceData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating service:', error);
    return { errorDescription: error.response?.data?.message || error.response?.data?.errorDescription || "An error occurred while updating the service." };
  }
};

export const getAllServicesPaginated = async (pageNumber = 1, pageSize = 10, status = true) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      return { payload: [], totalRecords: 0, errorDescription: "Authentication required." };
    }
    const response = await axios.get(`${BASE_BACKEND_URL}/service/getAllPage?pageNumber=${pageNumber}&pageSize=${pageSize}&status=${status}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.responseDto || { payload: [], totalRecords: 0 };
  } catch (error) {
    console.error('Error fetching paginated services:', error);
    return { payload: [], totalRecords: 0, errorDescription: error.response?.data?.message || "An error occurred while fetching services." };
  }
};

export const updateServiceStatus = async (serviceId, status) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      return { errorDescription: "Authentication required. Please login again." };
    }
    const response = await axios.put(`${BASE_BACKEND_URL}/service/updateStatus?serviceId=${serviceId}&status=${status}`, {}, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating service status:', error);
    return { errorDescription: error.response?.data?.message || error.response?.data?.errorDescription || "An error occurred while updating service status." };
  }
};

export const getServicesByName = async (name) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      return { payload: [], totalRecords: 0, errorDescription: "Authentication required." };
    }
    const response = await axios.get(`${BASE_BACKEND_URL}/service/getAllByName?name=${name}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.responseDto || { payload: [], totalRecords: 0 };
  } catch (error) {
    console.error('Error fetching services by name:', error);
    return { payload: [], totalRecords: 0, errorDescription: error.response?.data?.message || "An error occurred while fetching services by name." };
  }
}; 