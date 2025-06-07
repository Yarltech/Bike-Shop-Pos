import { BASE_BACKEND_URL } from "./config";
import axios from "axios";

export const getAllPaymentMethods = async () => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      return { responseDto: { payload: [], totalRecords: 0 }, errorDescription: "Authentication required." };
    }
    const response = await axios.get(`${BASE_BACKEND_URL}/paymentMethod/getAll`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data || { responseDto: { payload: [], totalRecords: 0 } };
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    return { responseDto: { payload: [], totalRecords: 0 }, errorDescription: error.response?.data?.message || "An error occurred while fetching payment methods." };
  }
}; 