import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  token:'',
  userDetails: {}
};

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
      setUserDetails(state, actions) {
        const {token, userDetails} = actions.payload
            return{
                ...state,
                token,
                userDetails
            }
      },
    },
  })

export const { setUserDetails } = usersSlice.actions;
export default usersSlice.reducer;
