import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./features/userSlice";
import currentSlice from "./features/currentSlice";

export default configureStore({
  reducer: {
    currentUser: userSlice,
    current: currentSlice,
  },
});
