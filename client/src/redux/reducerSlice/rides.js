import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  pickUpAddr: '',
  destAddr: ''
};

const ridesSlice = createSlice({
    name: 'rides',
    initialState,
    reducers: {
      setAddress(state, actions) {
        state[actions.payload.flag] = actions.payload.inputField
      }
    },
  })

export const { setAddress } = ridesSlice.actions;
export default ridesSlice.reducer;
