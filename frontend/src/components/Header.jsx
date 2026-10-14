import React from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

export default function Header({ title = "CareRent" }) {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("careRentLoggedIn");
    navigate("/login");
  };
  return <header className="topbar"><div className="brand" onClick={() => navigate("/home")}>Care<span>Rent</span></div><div className="top-title">{title}</div><button className="icon-btn" onClick={logout} title="Logout"><LogOut size={19}/></button></header>;
}