/* eslint-disable react-hooks/exhaustive-deps */
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";

import useAuthStore from "./store/authStore";
import ProtectedRoute from "./routes/ProtectedRoute";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import ServiceDetailsPage from "./pages/ServiceDetailsPage";
import ProfilePage from "./pages/dashboard/ProfilePage";
import PublicProfilePage from "./pages/PublicProfilePage";

import DashboardPage from "./pages/dashboard/DashboardPage";
import MyServicesPage from "./pages/dashboard/MyServicesPage";
import CreateServicePage from "./pages/dashboard/CreateServicePage";

import Navbar from "./components/Navbar";

const App = () => {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/services/:id" element={<ServiceDetailsPage />} />

        <Route path="/users/:username" element={<PublicProfilePage />} />

        <Route path="/login" element={<LoginPage />} />

        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/services"
          element={
            <ProtectedRoute>
              <MyServicesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/services/create"
          element={
            <ProtectedRoute>
              <CreateServicePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;