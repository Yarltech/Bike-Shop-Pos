import axios from "axios";
import { BASE_BACKEND_URL } from "./config";

// Transaction Totals
export const getTransactionTotals = async () => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const response = await axios.get(
      `${BASE_BACKEND_URL}/transaction/getTransactionTotals`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response.data.status) {
      localStorage.setItem("transactionTotals", JSON.stringify(response.data.responseDto));
      return response.data.responseDto;
    }
    return null;
  } catch (error) {
    console.error("Error fetching transaction totals:", error);
    return null;
  }
};

// Today's Transactions
export const getTodayTransactions = async () => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const response = await axios.get(
      `${BASE_BACKEND_URL}/transaction/getAllToday`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response.data.status) {
      localStorage.setItem("todayTransactions", JSON.stringify(response.data.responseDto));
      return response.data.responseDto;
    }
    return null;
  } catch (error) {
    console.error("Error fetching today's transactions:", error);
    return null;
  }
};

// Today's Outgoing Payments
export const getTodayOutgoingPayments = async () => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const response = await axios.get(
      `${BASE_BACKEND_URL}/outgoingPayment/getAllToday`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response.data.status) {
      localStorage.setItem("todayOutgoingPayments", JSON.stringify(response.data.responseDto));
      return response.data.responseDto;
    }
    return null;
  } catch (error) {
    console.error("Error fetching today's outgoing payments:", error);
    return null;
  }
};

// Outgoing Payment Totals
export const getOutgoingPaymentTotals = async () => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const response = await axios.get(
      `${BASE_BACKEND_URL}/outgoingPayment/getTransactionTotals`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response.data.status) {
      localStorage.setItem("outgoingPaymentTotals", JSON.stringify(response.data.responseDto));
      return response.data.responseDto;
    }
    return null;
  } catch (error) {
    console.error("Error fetching outgoing payment totals:", error);
    return null;
  }
};

// Get Last 30 Days Transaction Data for Chart
export const getLast30DaysTransactionData = async () => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const response = await axios.get(
      `${BASE_BACKEND_URL}/transaction/getLast30DaysData`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response.data.status) {
      return response.data.responseDto;
    }
    return null;
  } catch (error) {
    console.error("Error fetching last 30 days transaction data:", error);
    return null;
  }
};
