// src/routes/AppRouter.jsx
import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import MainLayout from '../layouts/MainLayout/MainLayout';
import AdminLayout from '../layouts/AdminLayout/AdminLayout';
import Loader from '../components/Loader/Loader';

const Home           = lazy(() => import('../pages/Home/Home'));
const Movies         = lazy(() => import('../pages/Movies/Movies'));
const TVShows        = lazy(() => import('../pages/TVShows/TVShows'));
const MovieDetails   = lazy(() => import('../pages/MovieDetails/MovieDetails'));
const SearchResults  = lazy(() => import('../pages/SearchResults/SearchResults'));
const Favorites      = lazy(() => import('../pages/Favorites/Favorites'));
const WatchHistory   = lazy(() => import('../pages/WatchHistory/WatchHistory'));
const Login          = lazy(() => import('../pages/Login/Login'));
const Register       = lazy(() => import('../pages/Register/Register'));
const AdminDashboard = lazy(() => import('../pages/AdminDashboard/AdminDashboard'));

function PrivateRoute({ children }) {
  const user = useSelector((s) => s.auth.user);
  return user ? children : <Navigate to="/login" replace />;
}

function AdminRoute({ children }) {
  const user = useSelector((s) => s.auth.user);
  if (!user)          return <Navigate to="/login"  replace />;
  if (!user.isAdmin)  return <Navigate to="/"       replace />;
  return children;
}

export default function AppRouter() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {/* Public auth pages */}
        <Route path="/login"    element={<Login />}    />
        <Route path="/register" element={<Register />} />

        {/* Admin panel */}
        <Route path="/admin/*" element={
          <AdminRoute>
            <AdminLayout><AdminDashboard /></AdminLayout>
          </AdminRoute>
        } />

        {/* Main app (with Navbar / Footer) */}
        <Route element={<MainLayout />}>
          <Route path="/"                   element={<Home />}           />
          <Route path="/movies"             element={<Movies />}         />
          <Route path="/tv"                 element={<TVShows />}        />
          <Route path="/details/:type/:id"  element={<MovieDetails />}   />
          <Route path="/search"             element={<SearchResults />}  />
          <Route path="/favorites" element={<PrivateRoute><Favorites /></PrivateRoute>}   />
          <Route path="/history"   element={<PrivateRoute><WatchHistory /></PrivateRoute>} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
