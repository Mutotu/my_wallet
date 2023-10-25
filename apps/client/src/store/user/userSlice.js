import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  id: null,
  username: "",
  fullName: "",
  accountNumber: "",
  transactions: []
};

export const userSlice = createSlice({
  name: "userInfo",
  initialState,
  reducers: {
    updateState: (state, action) => {
      const { user, transactions } = action.payload
      const { id, username, fullName, accountNumber, } = user
      state.id = id
      state.username = username
      state.fullName = fullName
      state.accountNumber = accountNumber
      state.transactions = transactions
    },
    refreshState: (state) => { Object.assign(state, initialState); }
  },
});

export const { updateState, refreshState } = userSlice.actions;
export const selectData = (state) => state.userInput;
export default userSlice.reducer;