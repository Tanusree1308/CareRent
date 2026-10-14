import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Equipment from "./pages/Equipment";
import EquipmentDetails from "./pages/EquipmentDetails";
import RentalDuration from "./pages/RentalDuration";
import Checkout from "./pages/Checkout";
import Success from "./pages/Success";
import MyRentals from "./pages/MyRentals";
import OwnerDashboard from "./pages/OwnerDashboard";
import Profile from "./pages/Profile";
import ProtectedLayout from "./components/ProtectedLayout";

function Protected({ children }) {
  return localStorage.getItem("careRentLoggedIn") === "true"
    ? children
    : <Navigate to="/login" replace />;
}

function OwnerGuard({ children }) {
  const user = JSON.parse(localStorage.getItem("careRentUser") || "null");
  return localStorage.getItem("careRentLoggedIn") === "true" && user?.role === "owner"
    ? children
    : <Navigate to="/home" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<Protected><ProtectedLayout /></Protected>}>
        <Route path="/home" element={<Home />} />
        <Route path="/equipment" element={<Equipment />} />
        <Route path="/equipment/:id" element={<EquipmentDetails />} />
        <Route path="/rent/:id" element={<RentalDuration />} />
        <Route path="/checkout/:id" element={<Checkout />} />
        <Route path="/success" element={<Success />} />
        <Route path="/rentals" element={<MyRentals />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      <Route path="/owner" element={<OwnerGuard><OwnerDashboard /></OwnerGuard>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}