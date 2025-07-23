import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sidebarMinimized: false,
};

const MainReduxSlice = createSlice({
  name: "mainReduxSlicer",
  initialState,
  reducers: {
    toggleAdminSidebar: (state) => {
      state.sidebarMinimized = !state.sidebarMinimized;
    },
  },
});

export const { toggleAdminSidebar } = MainReduxSlice.actions;

export default MainReduxSlice.reducer;
