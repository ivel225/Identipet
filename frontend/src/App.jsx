import { Navigate, Route, Routes } from "react-router-dom";

import AdminLayout from "./layout/AdminLayout.jsx";
import ProtectedRoute from "./layout/ProtectedRoute.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import NfcTagsPage from "./pages/NfcTagsPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import OwnersPage from "./pages/OwnersPage.jsx";
import PetsPage from "./pages/PetsPage.jsx";
import UsersPage from "./pages/UsersPage.jsx";
import VaccinationsPage from "./pages/VaccinationsPage.jsx";
import { ADMIN_DASHBOARD_ROLES, ADMIN_ONLY_ROLES } from "./utils/roles.js";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={ADMIN_DASHBOARD_ROLES}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route
          path="users"
          element={
            <ProtectedRoute allowedRoles={ADMIN_ONLY_ROLES}>
              <UsersPage />
            </ProtectedRoute>
          }
        />
        <Route path="owners" element={<OwnersPage />} />
        <Route path="pets" element={<PetsPage />} />
        <Route path="vaccinations" element={<VaccinationsPage />} />
        <Route path="nfc-tags" element={<NfcTagsPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
