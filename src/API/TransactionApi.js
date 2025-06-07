import axios from 'axios';
import { getAuthToken } from '../utils/auth';
import { BASE_BACKEND_URL } from './config';


// Save a new transaction
export const saveTransaction = async (transactionData) => {
    try {
        const response = await axios.post(`${BASE_BACKEND_URL}/transaction/save`, transactionData, {
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error saving transaction:', error);
        return {
            errorDescription: error.response?.data?.message || 'Failed to save transaction'
        };
    }
};

// Update an existing transaction
export const updateTransaction = async (transactionData) => {
    try {
        const response = await axios.put(`${BASE_BACKEND_URL}/transaction/update`, transactionData, {
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating transaction:', error);
        return {
            errorDescription: error.response?.data?.message || 'Failed to update transaction'
        };
    }
};

// Get all transactions with pagination
export const getAllTransactionsPaginated = async (pageNumber, pageSize) => {
    try {
        const response = await axios.get(`${BASE_BACKEND_URL}/transaction/getAllPage`, {
            params: {
                pageNumber,
                pageSize
            },
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching transactions:', error);
        return {
            errorDescription: error.response?.data?.message || 'Failed to fetch transactions'
        };
    }
};

// Get transactions by customer ID with pagination
export const getTransactionsByCustomer = async (pageNumber, pageSize, customerId) => {
    try {
        const response = await axios.get(`${BASE_BACKEND_URL}/transaction/getAllPageByCustomer`, {
            params: {
                pageNumber,
                pageSize,
                customerId
            },
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching customer transactions:', error);
        return {
            errorDescription: error.response?.data?.message || 'Failed to fetch customer transactions'
        };
    }
};

// Get transactions by status with pagination
export const getTransactionsByStatus = async (pageNumber, pageSize, status) => {
    try {
        const response = await axios.get(`${BASE_BACKEND_URL}/transaction/getAllPageByStatus`, {
            params: {
                pageNumber,
                pageSize,
                status
            },
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching transactions by status:', error);
        return {
            errorDescription: error.response?.data?.message || 'Failed to fetch transactions by status'
        };
    }
};

// Get transactions by transaction number with pagination
export const getTransactionsByTransactionNo = async (pageNumber, pageSize, transactionNo) => {
    try {
        const response = await axios.get(`${BASE_BACKEND_URL}/transaction/getAllPageByTransactionNo`, {
            params: {
                pageNumber,
                pageSize,
                transactionNo
            },
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching transactions by transaction number:', error);
        return {
            errorDescription: error.response?.data?.message || 'Failed to fetch transactions by transaction number'
        };
    }
};

// Update transaction details status
export const updateTransactionDetailsStatus = async (transactionDetailsId, status) => {
    try {
        const response = await axios.put(`${BASE_BACKEND_URL}/transaction/updateTransactionDetailsStatus`, null, {
            params: {
                transactionDetailsId,
                status
            },
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating transaction details status:', error);
        return {
            errorDescription: error.response?.data?.message || 'Failed to update transaction details status'
        };
    }
}; 