import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { getDashboardData } from "../services/dashboardService.js";

export const fetchDashboardData = createAsyncThunk(
  "dashboard/fetchDashboardData",
  async () => getDashboardData(),
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    owners: [],
    pets: [],
    vaccinationRecords: [],
    scanLogs: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.owners = action.payload.owners;
        state.pets = action.payload.pets;
        state.vaccinationRecords = action.payload.vaccinationRecords;
        state.scanLogs = action.payload.scanLogs;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default dashboardSlice.reducer;
