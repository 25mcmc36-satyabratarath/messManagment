import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import HomePage from "./pages/HomePage/HomePage";
import LoginPage from "./pages/LoginPage/LoginPage";

import Dashboard from "./pages/Dashboard/Dashboard";
import FeedbackPage from "./pages/FeedbackPage/Feedback";
import MessSecretaryDashboard from "./pages/MessSecretaryDashboard/MessSecretaryDashboard";
import CareTakerDashboard from "./pages/CareTakerDashboard/CareTakerDashboard";
import MessSupervisorDashboard from "./pages/MessSupervisorDashboard/MessSupervisorDashboard";
import WardenDashboard from "./pages/WardenDashboard/WardenDashboard";

import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

const AppContent = () => {
  const location = useLocation();

  const hideLayoutRoutes = ["/admin", "/chief-warden", "/dashboard", "/warden", "/mess-secretary", "/care-taker", "/mess-supervisor"];

  const isDashboardPage = hideLayoutRoutes.some(path =>
    location.pathname.startsWith(path)
  );

  return (
    <>
      {!isDashboardPage && <Navbar />}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/warden"
          element={
            <ProtectedRoute allowedRoles={["WARDEN"]}>
              <WardenDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/mess-secretary"
          element={
            <ProtectedRoute allowedRoles={["MESS_SECRETARY"]}>
              <MessSecretaryDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/care-taker"
          element={
            <ProtectedRoute allowedRoles={["CARE_TAKER"]}>
              <CareTakerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/mess-supervisor"
          element={
            <ProtectedRoute allowedRoles={["MESS_SUPERVISOR"]}>
              <MessSupervisorDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/feedback"
          element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <FeedbackPage />
            </ProtectedRoute>
          }
        />
      </Routes>

      {!isDashboardPage && <Footer />}
    </>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
