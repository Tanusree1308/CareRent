import React from "react";
import { NavLink } from "react-router-dom";
import { Home, Search, ClipboardList, User } from "lucide-react";

export default function BottomNav() {
  return <nav className="bottom-nav">
    <NavLink to="/home"><Home size={20}/><span>Home</span></NavLink>
    <NavLink to="/equipment"><Search size={20}/><span>Equipment</span></NavLink>
    <NavLink to="/rentals"><ClipboardList size={20}/><span>Rentals</span></NavLink>
    <NavLink to="/profile"><User size={20}/><span>Profile</span></NavLink>
  </nav>;
}