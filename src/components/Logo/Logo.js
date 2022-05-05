import React from "react";
import Tilt from "react-tilt";
import brain from "./brain.png";
import "./Logo.css";

const Logo = () => {
  return (
    <Tilt className="Tilt br2 shadow-2" style={{ height: 64, width: 64 }}>
      <div
        className="Tilt-inner"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
        }}
      >
        <img
          style={{
            paddingTop: "0px",
            width: 40,
            height: 40,
            marginBottom: "0 !important",
          }}
          alt="logo"
          src={brain}
        />
      </div>
    </Tilt>
  );
};

export default Logo;
