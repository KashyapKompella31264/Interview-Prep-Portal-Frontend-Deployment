import {jwtDecode} from 'jwt-decode';

// Function to check if the token is expired
export const isTokenExpired = (token) => {
  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000; // Convert to seconds
    return decodedToken.exp < currentTime; // True if expired
  } catch (err) {
    return true; // If token is invalid, treat it as expired
  }
};
