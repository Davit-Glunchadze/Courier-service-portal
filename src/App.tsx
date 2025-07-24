import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import CourierDashboard from "./pages/CourierDashboard";
import CourierRegisterPage from "./pages/CourierRegisterPage";
import CourierConfirmedPage from "./pages/CourierConfirmedPage";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import RegisterRoleChooserPage from "./pages/RegisterRoleChooserPage";
import { AuthProvider } from "./context/AuthProvider";
import CourierEmailSend from "./pages/CourierEmailSend";
import CourierEditPage from "./pages/CourierEditPage";
import CourierEditSchedulePage from "./pages/CourierEditSchedulePage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* საერთო როუტები */}
          <Route path="/" element={<RegisterRoleChooserPage />} />

          <Route path="/courier/register" element={<CourierRegisterPage />} />
          <Route path="/courier/confirmed" element={<CourierConfirmedPage />} />
          <Route path="/courier/email-sent" element={<CourierEmailSend />} />
          <Route path="/courier/edit" element={<CourierEditPage />} />
          <Route path="/courier/edit-schedule" element={<CourierEditSchedulePage />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute role="admin" />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Route>

          <Route element={<ProtectedRoute role="user" />}>
            <Route path="/user/dashboard" element={<UserDashboard />} />
          </Route>

          <Route element={<ProtectedRoute role="courier" />}>
            <Route path="/courier/dashboard" element={<CourierDashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
