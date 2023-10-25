import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";

const store = configureStore({
  reducer: {
    userInput: userReducer,
  },
});

export default store;