import { BASE_BACKEND_URL } from "./config";
import axios from "axios";

export const saveOutgoingPayment = async (paymentData) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      return { errorDescription: "Authentication required. Please login again." };
    }
    const response = await axios.post(`${BASE_BACKEND_URL}/outgoingPayment/save`, paymentData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error saving outgoing payment:', error);
    return { errorDescription: error.response?.data?.message || error.response?.data?.errorDescription || "An error occurred while saving the outgoing payment." };
  }
};

export const updateOutgoingPayment = async (paymentData) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      return { errorDescription: "Authentication required. Please login again." };
    }
    const response = await axios.put(`${BASE_BACKEND_URL}/outgoingPayment/update`, paymentData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating outgoing payment:', error);
    return { errorDescription: error.response?.data?.message || error.response?.data?.errorDescription || "An error occurred while updating the outgoing payment." };
  }
};

export const getAllOutgoingPaymentsPaginated = async (pageNumber = 1, pageSize = 10) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      return { payload: [], totalRecords: 0, errorDescription: "Authentication required." };
    }
    const response = await axios.get(`${BASE_BACKEND_URL}/outgoingPayment/getAllPage?pageNumber=${pageNumber}&pageSize=${pageSize}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.responseDto || { payload: [], totalRecords: 0 };
  } catch (error) {
    console.error('Error fetching paginated outgoing payments:', error);
    return { payload: [], totalRecords: 0, errorDescription: error.response?.data?.message || "An error occurred while fetching outgoing payments." };
  }
};

export const getAllOutgoingPaymentsByCategoryIdPaginated = async (pageNumber = 1, pageSize = 10, outgoingPaymentCategoryId) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      return { payload: [], totalRecords: 0, errorDescription: "Authentication required." };
    }
    const response = await axios.get(`${BASE_BACKEND_URL}/outgoingPayment/getAllPageByOutgoingPaymentCategoryId?pageNumber=${pageNumber}&pageSize=${pageSize}&outgoingPaymentCategoryId=${outgoingPaymentCategoryId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.responseDto || { payload: [], totalRecords: 0 };
  } catch (error) {
    console.error('Error fetching paginated outgoing payments by category ID:', error);
    return { payload: [], totalRecords: 0, errorDescription: error.response?.data?.message || "An error occurred while fetching outgoing payments by category ID." };
  }
}; 