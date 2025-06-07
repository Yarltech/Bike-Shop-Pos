import { BASE_BACKEND_URL } from "./config";
import axios from "axios";

export const saveShopDetails = async (shopDetailsData) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      return { errorDescription: "Authentication required. Please login again." };
    }
    const response = await axios.post(`${BASE_BACKEND_URL}/shopDetails/save`, shopDetailsData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error saving shop details:', error);
    return { errorDescription: error.response?.data?.message || error.response?.data?.errorDescription || "An error occurred while saving the shop details." };
  }
};

export const updateShopDetails = async (shopDetailsData) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      return { errorDescription: "Authentication required. Please login again." };
    }
    const response = await axios.post(`${BASE_BACKEND_URL}/shopDetails/update`, shopDetailsData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating shop details:', error);
    return { errorDescription: error.response?.data?.message || error.response?.data?.errorDescription || "An error occurred while updating the shop details." };
  }
};

export const updateShopDetailsStatus = async (shopDetailsId, status) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      return { errorDescription: "Authentication required. Please login again." };
    }
    const response = await axios.put(`${BASE_BACKEND_URL}/shopDetails/updateStatus?shopDetailsId=${shopDetailsId}&status=${status}`, {}, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating shop details status:', error);
    return { errorDescription: error.response?.data?.message || error.response?.data?.errorDescription || "An error occurred while updating shop details status." };
  }
};

export const getAllShopDetails = async () => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      return { responseDto: { payload: [], totalRecords: 0 }, errorDescription: "Authentication required." };
    }
    const response = await axios.get(`${BASE_BACKEND_URL}/shopDetails/getAll`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data || { responseDto: { payload: [], totalRecords: 0 } };
  } catch (error) {
    console.error('Error fetching shop details:', error);
    return { responseDto: { payload: [], totalRecords: 0 }, errorDescription: error.response?.data?.message || "An error occurred while fetching shop details." };
  }
}; 