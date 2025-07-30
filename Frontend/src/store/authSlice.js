import { createSlice } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode'; // Ensure jwt-decode is installed: npm install jwt-decode

const getInitialState = () => {
  const token = localStorage.getItem('token');
  let user = localStorage.getItem('user');
  let isAuthenticated = false;
  let isLoading = true;

  // if (token && userJson) {
  //   try {
  //     const decodedToken = jwtDecode(token);
  //     // Check if token is expired (assuming 'exp' is expiration time in seconds)
  //     if (decodedToken.exp * 1000 > Date.now()) {
  //       user = JSON.parse(userJson);
  //       isAuthenticated = true;
  //     } else {
  //       // Token expired, clear localStorage
  //       localStorage.removeItem('token');
  //       localStorage.removeItem('user');
  //     }
  //   } catch (error) {
  //     console.error('Failed to decode or parse token/user from localStorage:', error);
  //     localStorage.removeItem('token');
  //     localStorage.removeItem('user');
  //   }
  // }
  if (token && user) {
    try {
      const decodedToken = jwtDecode(token);
      const expirationTime = decodedToken.exp * 1000;

      if (Date.now() < expirationTime) {
        isAuthenticated = true;
        user = JSON.parse(user);
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    } catch (error) {
      console.error('Failed to decode or parse token/user from localStorage:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }
  isLoading = false; // Set to false after the synchronous check is done

  return {
    token: token,
    isAuthenticated: isAuthenticated,
    user: user,
    isLoading: isLoading, // Added isLoading state
  };
};


const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {
    setLogin: (state, action) => { 
      const { token, user } = action.payload;
      state.isAuthenticated = true;
      state.token = token;
      state.user = user;
      state.isLoading = false;
      localStorage.setItem('token', token); // Persist token
      localStorage.setItem('user', JSON.stringify(user)); // Persist user
    },
    setLogout: (state) => { 
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      state.isLoading = false;
      localStorage.removeItem('token'); // Clear token
      localStorage.removeItem('user'); // Clear user
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    updateUserProfile: (state, action) => {
      // This action will update the user object in Redux with details like fullName and mobile
      // It will NOT store these sensitive details in localStorage persistently from here.
      state.user = { ...state.user, ...action.payload };
      // Note: localStorage is NOT updated here with fullName/mobile for security.
      // If you absolutely need to update it in localStorage (e.g., for display in Navbar),
      // you'd need to explicitly set *only the non-sensitive parts* of the user object to localStorage.
      // For now, we rely on the minimal user object in localStorage.
      console.log('User profile updated in Redux state (volatile).');
    },
  },
});

// Ensure updateUserProfile is exported here
export const { setLogin, setLogout, setLoading, updateUserProfile } = authSlice.actions;

export default authSlice.reducer;