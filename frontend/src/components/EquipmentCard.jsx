import React from "react";
import { useNavigate } from "react-router-dom";

export default function EquipmentCard({ item }) {
  const navigate = useNavigate();
  return <div className="equipment-card" onClick={() => navigate(`/equipment/${item.id}`)}>
    <div className="equip-icon">{item.icon}</div>
    <div className="equip-info"><h3>{item.name}</h3><p>{item.category}</p><strong>₹{item.price}<small>/day</small></strong></div>
  </div>;
}