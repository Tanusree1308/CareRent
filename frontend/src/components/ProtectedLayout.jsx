import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import BottomNav from "./BottomNav";

export default function ProtectedLayout() {
  const location = useLocation();
  const titles = { "/home": "Dashboard", "/equipment": "Medical Equipment", "/rentals": "My Rentals", "/profile": "My Profile" };
  return <div className="app-shell"><Header title={titles[location.pathname] || "CareRent"} /><main className="page"><Outlet /></main><BottomNav /></div>;
}