import { BASE_BACKEND_URL } from "./config";
import axios from "axios";

export const saveCustomer = async (customerData) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      return { errorDescription: "Authentication required. Please login again." };
    }
    const response = await axios.post(`${BASE_BACKEND_URL}/customer/save`, customerData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error saving customer:', error);
    return { errorDescription: error.response?.data?.message || error.response?.data?.errorDescription || "An error occurred while saving the customer." };
  }
};

export const updateCustomer = async (customerData) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      return { errorDescription: "Authentication required. Please login again." };
    }
    const response = await axios.post(`${BASE_BACKEND_URL}/customer/update`, customerData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating customer:', error);
    return { errorDescription: error.response?.data?.message || error.response?.data?.errorDescription || "An error occurred while updating the customer." };
  }
};

export const getAllCustomersPaginated = async (pageNumber = 1, pageSize = 7, status = true) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      return { payload: [], totalRecords: 0, errorDescription: "Authentication required." };
    }
    const response = await axios.get(`${BASE_BACKEND_URL}/customer/getAllPage?pageNumber=${pageNumber}&pageSize=${pageSize}&status=${status}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.responseDto || { payload: [], totalRecords: 0 };
  } catch (error) {
    console.error('Error fetching paginated customers:', error);
    return { payload: [], totalRecords: 0, errorDescription: error.response?.data?.message || "An error occurred while fetching customers." };
  }
};

export const getCustomersByMobileNumber = async (mobileNumber) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      return { payload: [], totalRecords: 0, errorDescription: "Authentication required." };
    }
    const response = await axios.get(`${BASE_BACKEND_URL}/customer/getAllByMobileNumber?mobileNumber=${mobileNumber}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.responseDto || { payload: [], totalRecords: 0 };
  } catch (error) {
    console.error('Error fetching customers by mobile number:', error);
    return { payload: [], totalRecords: 0, errorDescription: error.response?.data?.message || "An error occurred while fetching customers by mobile number." };
  }
};

export const getCustomersByVehicleNumber = async (vehicleNumber) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      return { payload: [], totalRecords: 0, errorDescription: "Authentication required." };
    }
    const response = await axios.get(`${BASE_BACKEND_URL}/customer/getAllByVehicleNumber?vehicleNumber=${vehicleNumber}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.responseDto || { payload: [], totalRecords: 0 };
  } catch (error) {
    console.error('Error fetching customers by vehicle number:', error);
    return { payload: [], totalRecords: 0, errorDescription: error.response?.data?.message || "An error occurred while fetching customers by vehicle number." };
  }
};

export const getCustomersByName = async (name) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      return { payload: [], totalRecords: 0, errorDescription: "Authentication required." };
    }
    const response = await axios.get(`${BASE_BACKEND_URL}/customer/getAllByName?name=${name}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.responseDto || { payload: [], totalRecords: 0 };
  } catch (error) {
    console.error('Error fetching customers by name:', error);
    return { payload: [], totalRecords: 0, errorDescription: error.response?.data?.message || "An error occurred while fetching customers by name." };
  }
};

export const updateCustomerStatus = async (customerId, status) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      return { errorDescription: "Authentication required. Please login again." };
    }
    const response = await axios.put(`${BASE_BACKEND_URL}/customer/updateStatus?customerId=${customerId}&status=${status}`, {}, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating customer status:', error);
    return { errorDescription: error.response?.data?.message || error.response?.data?.errorDescription || "An error occurred while updating customer status." };
  }
}; 