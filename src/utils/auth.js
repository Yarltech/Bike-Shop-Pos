// Get the authentication token from localStorage
export const getAuthToken = () => {
    return localStorage.getItem('accessToken');
};

// Set the authentication token in localStorage
export const setAuthToken = (token) => {
    localStorage.setItem('accessToken', token);
};

// Remove the authentication token from localStorage
export const removeAuthToken = () => {
    localStorage.removeItem('accessToken');
};

// Check if user is authenticated
export const isAuthenticated = () => {
    return !!getAuthToken();
}; 