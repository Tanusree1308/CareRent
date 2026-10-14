import React from "react";
import { useNavigate } from "react-router-dom";
import { HeartPulse, Truck, ShieldCheck } from "lucide-react";

export default function Welcome() {
  const navigate = useNavigate();
  return <div className="welcome">
    <div className="welcome-card">
      <div className="logo-mark"><HeartPulse size={34}/></div>
      <h1>Care<span>Rent</span></h1>
      <p className="tagline">Medical equipment, delivered with care.</p>
      <div className="feature-row"><div><Truck size={20}/><span>Home Delivery</span></div><div><ShieldCheck size={20}/><span>Trusted Care</span></div></div>
      <button className="primary-btn" onClick={() => navigate("/login")}>Get Started</button>
      <button className="link-btn" onClick={() => navigate("/register")}>Create an account</button>
    </div>
  </div>;
}