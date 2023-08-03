import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  token:'',
  userDetails: {},
  isLoggedIn: false
};

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
      setUserDetails(state, actions) {
      const {token, userDetails} =  actions.payload
      return {
        ...state,
        token,
        userDetails,
        isLoggedIn: true
      }
      },
      handleLogout(state, actions) {
          state= initialState
          return state
        },
    },
  })

export const { setUserDetails,handleLogout } = usersSlice.actions;
export default usersSlice.reducer;
