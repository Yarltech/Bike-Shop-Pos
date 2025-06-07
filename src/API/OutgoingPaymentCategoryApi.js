import { BASE_BACKEND_URL } from "./config";
import axios from "axios";

export const saveOutgoingPaymentCategory = async (categoryData) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      return { errorDescription: "Authentication required. Please login again." };
    }
    const response = await axios.post(`${BASE_BACKEND_URL}/outgoingPaymentCategory/save`, categoryData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error saving outgoing payment category:', error);
    return { errorDescription: error.response?.data?.message || error.response?.data?.errorDescription || "An error occurred while saving the outgoing payment category." };
  }
};

export const updateOutgoingPaymentCategory = async (categoryData) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      return { errorDescription: "Authentication required. Please login again." };
    }
    const response = await axios.post(`${BASE_BACKEND_URL}/outgoingPaymentCategory/update`, categoryData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating outgoing payment category:', error);
    return { errorDescription: error.response?.data?.message || error.response?.data?.errorDescription || "An error occurred while updating the outgoing payment category." };
  }
};

export const getAllOutgoingPaymentCategories = async () => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      return { responseDto: { payload: [], totalRecords: 0 }, errorDescription: "Authentication required." };
    }
    const response = await axios.get(`${BASE_BACKEND_URL}/outgoingPaymentCategory/getAll`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data || { responseDto: { payload: [], totalRecords: 0 } };
  } catch (error) {
    console.error('Error fetching outgoing payment categories:', error);
    return { responseDto: { payload: [], totalRecords: 0 }, errorDescription: error.response?.data?.message || "An error occurred while fetching outgoing payment categories." };
  }
};

export const updateOutgoingPaymentCategoryStatus = async (outgoingPaymentCategoryId, status) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      return { errorDescription: "Authentication required. Please login again." };
    }
    const response = await axios.put(`${BASE_BACKEND_URL}/outgoingPaymentCategory/updateStatus?outgoingPaymentCategoryId=${outgoingPaymentCategoryId}&status=${status}`, {}, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating outgoing payment category status:', error);
    return { errorDescription: error.response?.data?.message || error.response?.data?.errorDescription || "An error occurred while updating outgoing payment category status." };
  }
}; 