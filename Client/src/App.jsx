import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./hooks/useAuth";
import Layout from "./components/Layout/Layout";
import ProtectedRoute from "./components/Auth/ProtectedRoute";

// Pages
import Home from "./pages/Home";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import VerifyEmail from "./components/Auth/VerifyEmail";
import Dashboard from "./pages/Dashboard";
import Pets from "./pages/Pets";
import PetDetail from "./pages/PetDetail";
import AddPet from "./pages/AddPet";
import Services from "./pages/Services";
import Training from "./pages/Training";
import Donations from "./pages/Donations";
import Profile from "./pages/Profile";

import Notifications from "./pages/Notifications";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminPets from "./pages/admin/AdminPets";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminDonations from "./pages/admin/AdminDonations";
import AdminNotifications from "./pages/admin/AdminNotifications";
import VeterinaryService from "./pages/services/VeterinaryService";
import GroomingService from "./pages/services/GroomingService";
import DaycareService from "./pages/services/DaycareService";


function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            {/* Public Routes */}
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/verify-email' element={<VerifyEmail />} />
            <Route path='/pets' element={<Pets />} />
            <Route path='/pets/:id' element={<PetDetail />} />
            <Route path='/services' element={<Services />} />
            <Route path='/services/veterinary' element={<VeterinaryService />} />
            <Route path='/services/grooming' element={<GroomingService />} />
            <Route path='/services/daycare' element={<DaycareService />} />
            <Route path='/training' element={<Training />} />
            <Route path='/donate' element={<Donations />} />

            {/* Protected Routes */}
            <Route
              path='/dashboard'
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path='/pets/add'
              element={
                <ProtectedRoute>
                  <AddPet />
                </ProtectedRoute>
              }
            />
            <Route
              path='/profile'
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path='/notifications'
              element={
                <ProtectedRoute>
                  <Notifications />
                </ProtectedRoute>
              }
            />


            {/* Admin Routes */}
            <Route
              path='/admin'
              element={
                <ProtectedRoute adminOnly>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path='/admin/users'
              element={
                <ProtectedRoute adminOnly>
                  <AdminUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path='/admin/pets'
              element={
                <ProtectedRoute adminOnly>
                  <AdminPets />
                </ProtectedRoute>
              }
            />
            <Route
              path='/admin/bookings'
              element={
                <ProtectedRoute adminOnly>
                  <AdminBookings />
                </ProtectedRoute>
              }
            />
            <Route
              path='/admin/donations'
              element={
                <ProtectedRoute adminOnly>
                  <AdminDonations />
                </ProtectedRoute>
              }
            />
            <Route
              path='/admin/notifications'
              element={
                <ProtectedRoute adminOnly>
                  <AdminNotifications />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Layout>
        <Toaster position='top-right' />
       
      </Router>
    </AuthProvider>
  );
}

export default App;
