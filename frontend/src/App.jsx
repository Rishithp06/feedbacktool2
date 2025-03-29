  // src/App.jsx
  import React from 'react';
  import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
  import Home from './pages/Home';
  import Login from './pages/Login';
  import RegisterUser from './pages/RegisterUser';
  import RegisterAdmin from './pages/RegisterAdmin';
  import RegisterSuperAdmin from './pages/RegisterSuperAdmin';
  import ForgotPassword from './pages/ForgotPassword';
  import ResetPassword from './pages/ResetPassword';
  import Protected from './pages/Protected';
  import Header from './components/common/Header';
  import Footer from './components/common/Footer';
  import PrivateRoute from './components/common/PrivateRoute';
  import AdminProtectedRoute from './components/common/AdminProtectedRoute';
  import ProfilePage from './pages/user/ProfilePage';
  import UserEditPage from './pages/user/UserEditPage';
  import UserListPage from './pages/user/UserListPage';
import UserManagement from './pages/user/UserManagement';
import CreateTeamPage from './pages/team/CreateTeamPage';
import TeamListPage from './pages/team/TeamListPage';

import TeamManagement from './pages/team/TeamManagement';
  function App() {
    return (
      <Router>
        <Header />
        <main>
          <Routes>
            {/* Protect Home route */}
            <Route
              path="/"
              element={
                
                  <Home />
                
              }
            />
            <Route
              path="/protected"
              element={
                <PrivateRoute>
                  <Protected />
                </PrivateRoute>
              }
            />
          
          <Route
  path="/users"
  element={
    <AdminProtectedRoute>
      <UserListPage />
    </AdminProtectedRoute>
  }
/>

<Route
  path="/edit/:id"
  element={
    <AdminProtectedRoute>
      <UserEditPage />
    </AdminProtectedRoute>
  }
/>

<Route
  path="/profile"
  element={
    <AdminProtectedRoute>
      <ProfilePage/>
    </AdminProtectedRoute>
  }
/>
<Route
  path="/usermanagement"
  element={
    <AdminProtectedRoute>
      <UserManagement/>
    </AdminProtectedRoute>
  }
/>

<Route
  path="/team/create"
  element={
    <AdminProtectedRoute>
      <CreateTeamPage />
    </AdminProtectedRoute>
  }
/>
<Route
  path="/teams"
  element={
    <AdminProtectedRoute>
      <TeamListPage />
    </AdminProtectedRoute>
  }
/>

<Route
  path="/team-management"
  element={
    <AdminProtectedRoute>
      <TeamManagement />
    </AdminProtectedRoute>
  }
/>



            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register/user" element={<RegisterUser />} />
            <Route path="/register/admin" element={<RegisterAdmin />} />
            <Route path="/register/super-admin" element={<RegisterSuperAdmin />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    );
  }

  export default App;
