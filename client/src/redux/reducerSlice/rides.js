import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  pickUpAddr: '',
  pickUpCords: {},
  dropAddr: '',
  dropCords: {}
};

const ridesSlice = createSlice({
    name: 'rides',
    initialState,
    reducers: {
      setAddress(state, actions) {
        state.pickUpAddr= actions.payload.inputField
        // debugger;
        // console.log(actions.payload.)
        // state[actions.payload.flag] = actions.payload.inputField
      },
      setPickUpCords(state, actions) {
        return {
          ...state,
          pickUpCords: actions.payload
        }
      },
      setDropCords(state, actions) {
        return {
          ...state,
          dropCords: actions.payload
        }
      },
    },
  })

export const { setAddress,setPickUpCords,setDropCords } = ridesSlice.actions;
export default ridesSlice.reducer;
