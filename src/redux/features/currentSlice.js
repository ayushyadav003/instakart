import { createSlice } from "@reduxjs/toolkit";

export const currentSlice = createSlice({
  name: "current",
  initialState: {
    currentProduct: null,
    heading: "",
  },
  reducers: {
    handleCrrentProduct: (state, action) => {
      state.currentProduct = action.payload;
    },
    handleCrrentHeading: (state, action) => {
      state.heading = action.payload;
    },
  },
});

export const { handleCrrentProduct, handleCrrentHeading } =
  currentSlice.actions;

export default currentSlice.reducer;
