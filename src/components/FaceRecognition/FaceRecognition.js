import React from "react";
import "./FaceRecognition.css";
import BarLoader from "react-spinners/BarLoader";

const FaceRecognition = ({ imageUrl, boxes, isDetecting }) => {
  return (
    <div className="center ma">
      <div className="absolute mt2" style={{ position: "relative" }}>
        {isDetecting && (
          <div
            style={{
              width: "100%",
              height: "100%",
              flexDirection: "column",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "absolute",
              backgroundColor: "rgba(255,255,255,0.9)",
            }}
          >
            <div>Detecting...</div>
            <BarLoader color={"black"} size={70} width={150} />
          </div>
        )}
        <img id="inputimage" alt="" src={imageUrl} width="500px" heigh="auto" />
        {boxes.map((box, idx) => (
          <div
            key={idx}
            className="bounding-box"
            style={{
              top: box.topRow,
              right: box.rightCol,
              bottom: box.bottomRow,
              left: box.leftCol,
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default FaceRecognition;
