import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchDashboardData } from "../redux/dashboardSlice.js";

export function useDashboardData() {
  const dispatch = useDispatch();
  const dashboard = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  return dashboard;
}
