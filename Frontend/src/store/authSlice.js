// import { createSlice } from '@reduxjs/toolkit';
// import { jwtDecode } from 'jwt-decode';

// const getInitialState = () => {
//     const token = localStorage.getItem('token');
//     const user = localStorage.getItem('user');
//     let isAuthenticated = false;
//     let userData = null;
//     let isLoading = true; // Set to true to show loading screen initially

//     if (token && user) {
//         try {
//             const decodedToken = jwtDecode(token);
//             const expirationTime = decodedToken.exp * 1000;

//             if (Date.now() < expirationTime) {
//                 isAuthenticated = true;
//                 userData = JSON.parse(user);
//             } else {
//                 localStorage.removeItem('token');
//                 localStorage.removeItem('user');
//             }
//         } catch (error) {
//             console.error('Failed to decode or parse token/user from localStorage:', error);
//             localStorage.removeItem('token');
//             localStorage.removeItem('user');
//         }
//     }

//     isLoading = false; // Set to false after the synchronous check is done

//     return {
//         isAuthenticated,
//         user: userData,
//         token: token,
//         isLoading,
//     };
// };

// const authSlice = createSlice({
//     name: 'auth',
//     initialState: getInitialState(),
//     reducers: {
//         loginSuccess: (state, action) => {
//             const { token, user } = action.payload;
//             state.isAuthenticated = true;
//             state.token = token;
//             state.user = user;
//             state.isLoading = false;
//         },
//         logout: (state) => {
//             state.isAuthenticated = false;
//             state.token = null;
//             state.user = null;
//             state.isLoading = false;
//         },
//         setLoading: (state, action) => {
//             state.isLoading = action.payload;
//         },
//         // To update user profile
//         updateUserProfile: (state, action) => {
//             state.user = { ...state.user, ...action.payload };
//             localStorage.setItem('user', JSON.stringify(state.user));
//             console.log('User profile updated in Redux and localStorage.');
//         },
//     },
// });

// export const { loginSuccess, logout, setLoading, updateUserProfile } = authSlice.actions;

// export default authSlice.reducer;   

// Frontend/src/store/authSlice.js
// Frontend/src/store/authSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode'; // Ensure jwt-decode is installed: npm install jwt-decode

const getInitialState = () => {
  const token = localStorage.getItem('token');
  const userJson = localStorage.getItem('user');
  let user = null;
  let isAuthenticated = false;
  let isLoading = true;

  if (token && userJson) {
    try {
      const decodedToken = jwtDecode(token);
      // Check if token is expired (assuming 'exp' is expiration time in seconds)
      if (decodedToken.exp * 1000 > Date.now()) {
        user = JSON.parse(userJson);
        isAuthenticated = true;
      } else {
        // Token expired, clear localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    } catch (error) {
      console.error('Failed to decode or parse token/user from localStorage:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }

  return {
    token: token,
    isAuthenticated: isAuthenticated,
    user: user,
    isLoading: false, // Added isLoading state
  };
};


const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {
    setLogin: (state, action) => { // Renamed from loginSuccess
      const { token, user } = action.payload;
      state.isAuthenticated = true;
      state.token = token;
      state.user = user;
      state.isLoading = false;
      localStorage.setItem('token', token); // Persist token
      localStorage.setItem('user', JSON.stringify(user)); // Persist user
    },
    setLogout: (state) => { // Renamed from logout
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