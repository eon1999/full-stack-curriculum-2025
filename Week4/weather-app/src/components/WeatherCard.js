import React from "react";
// Import icons
import d01 from "../icons/01d.svg";
import n01 from "../icons/01n.svg";
import d02 from "../icons/02d.svg";
import n02 from "../icons/02n.svg";
import d03 from "../icons/03d.svg";
import n03 from "../icons/03n.svg";
import d04 from "../icons/04d.svg";
import n04 from "../icons/04n.svg";
import d09 from "../icons/09d.svg";
import n09 from "../icons/09n.svg";
import d10 from "../icons/10d.svg";
import n10 from "../icons/10n.svg";
import d11 from "../icons/11d.svg";
import n11 from "../icons/11n.svg";
import d13 from "../icons/13d.svg";
import n13 from "../icons/13n.svg";
import d50 from "../icons/50d.svg";
import n50 from "../icons/50n.svg";

const iconMap = {
  "01d": d01,
  "01n": n01,
  "02d": d02,
  "02n": n02,
  "03d": d03,
  "03n": n03,
  "04d": d04,
  "04n": n04,
  "09d": d09,
  "09n": n09,
  "10d": d10,
  "10n": n10,
  "11d": d11,
  "11n": n11,
  "13d": d13,
  "13n": n13,
  "50d": d50,
  "50n": n50,
};

function WeatherCard({ date, temp, description, icon }) {
  // Simple styling inline or we could use a CSS file
  const cardStyle = {
    backgroundColor: "white",
    borderRadius: "8px",
    padding: "10px",
    margin: "5px",
    textAlign: "center",
    width: "120px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  };

  return (
    <div style={cardStyle}>
      <p style={{ fontWeight: "bold" }}>{date}</p>
      <img
        src={iconMap[icon] || d01}
        alt={description}
        style={{ width: "50px", height: "50px" }}
      />
      <p>{Math.round(temp)}°F</p>
      <p style={{ fontSize: "0.8em", color: "#555" }}>{description}</p>
    </div>
  );
}

export default WeatherCard;
