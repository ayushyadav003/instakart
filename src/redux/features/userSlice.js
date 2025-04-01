import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    isLoading: false,
    logout: false,
    
  },
  reducers: {
    startLoading: (state) => {
      state.isLoading = true;
    },
    stopLoading: (state) => {
      state.isLoading = false;
    },
    setCurrentWarehouse: (state, action) => {
      state.currentWarehouse = action.payload;
    },
    openVerifyPopup: (state) => {
      state.verifyPopUp = true;
    },
    closeVerifyPopup: (state) => {
      state.verifyPopUp = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  startLoading,
  stopLoading,
  setCurrentWarehouse,
  openVerifyPopup,
  closeVerifyPopup,
} = userSlice.actions;

export default userSlice.reducer;
