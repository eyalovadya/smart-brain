import React, { useState, useRef, useEffect } from "react";
import "./FaceRecognition.css";
import BarLoader from "react-spinners/BarLoader";

const FaceRecognition = ({ imageUrl, boxes, isDetecting }) => {
  const [clickedBox, setClickedBox] = useState(null);

  const imgRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (isDetecting) {
      setClickedBox(null);
    }
  }, [isDetecting]);

  useEffect(() => {
    const canvas = canvasRef?.current;
    const imgEl = imgRef?.current;
    if (canvas && clickedBox && imageUrl && imgEl) {
      const context = canvas.getContext("2d");

      const originalImgObj = new Image();

      originalImgObj.onload = function () {
        const {
          topRow: top,
          rightCol: right,
          bottomRow: bottom,
          leftCol: left,
        } = clickedBox;
        const { width, height } = imgEl;
        const { width: originalWidth, height: originalHeight } = originalImgObj;
        const horizontalRatio = originalWidth / width;
        const vertialRatio = originalHeight / height;

        const sourceX = left * horizontalRatio;
        const sourceY = top * vertialRatio;

        const sourceWidth = (width - left - right) * horizontalRatio;
        const sourceHeight = (height - top - bottom) * vertialRatio;

        const factor = 200 / (width - left - right);
        const destWidth = 200;
        const destHeight = (height - top - bottom) * factor;

        const destX = (width - destWidth) / 2;
        const destY = (height - destHeight) / 2;

        context.drawImage(
          originalImgObj,
          sourceX,
          sourceY,
          sourceWidth,
          sourceHeight,
          destX,
          destY,
          destWidth,
          destHeight
        );
      };
      originalImgObj.src = imageUrl;
    }
  }, [canvasRef?.current, imageUrl, clickedBox, imgRef?.current]);

  return (
    <div
      className="center ma"
      style={{
        display: "flex",
        flexDirection: "column-reverse",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {!!boxes?.length && (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            color: "black",
            padding: 10,
            marginTop: 10,
            marginBottom: 10,
            width: 500,
            maxWidth: "100%",
          }}
          className="f6 f5-m bg-white b bg-opacity-50"
        >
          <div
            style={{
              whiteSpace: "pre-line",
            }}
          >
            Faces Detected:
            <span className="bg-white pa1 b red">{boxes.length}</span>
            {"\n"}Try clicking one of them :)
          </div>
        </div>
      )}
      <div className="absolute mt2" style={{ position: "relative" }}>
        {isDetecting && (
          <div className="over-img">
            <div>Detecting...</div>
            <BarLoader color={"black"} size={70} width={150} />
          </div>
        )}

        {clickedBox && (
          <div className="over-img">
            <div className="close" onClick={() => setClickedBox(null)}>
              &times;
            </div>
            <canvas
              ref={canvasRef}
              width={imgRef.current.width}
              height={imgRef.current.height}
            />
          </div>
        )}

        <img
          ref={imgRef}
          id="inputimage"
          alt=""
          src={imageUrl}
          width="500px"
          height="auto"
        />

        {!clickedBox &&
          boxes.map((box, idx) => (
            <div
              key={idx}
              className="bounding-box"
              style={{
                top: box.topRow,
                right: box.rightCol,
                bottom: box.bottomRow,
                left: box.leftCol,
              }}
              onClick={() => setClickedBox(box)}
            ></div>
          ))}
      </div>
    </div>
  );
};

export default React.memo(FaceRecognition);
