import React from "react";
import "./ImageLinkForm.css";
import Typist from "react-typist";
import "react-typist/dist/Typist.css";

const ImageLinkForm = ({ onInputChange, onButtonSubmit, input }) => {
  const isImageUrlValid = (url) => {
    const regex = /^https?:\/\/.*\/.*\.(png|gif|webp|jpeg|jpg)\??.*$/gim;
    const matches = url.match(regex);
    return matches && Array.isArray(matches) && matches.length === 1;
  };

  return (
    <div>
      <p
        className="f6 f4-m f3-l bg-white b bg-opacity-50"
        style={{ whiteSpace: "pre-line" }}
      >
        <Typist
          cursor={{
            show: true,
            blink: true,
            element: "|",
            hideWhenDone: true,
            hideWhenDoneDelay: 1000,
          }}
        >
          {"This Magic Brain will detect faces in your pictures. \n"}
          {" Give it a try!"}
        </Typist>
      </p>
      <div className="center">
        <div className="form center pa4 br3 shadow-5">
          <input
            className="f4 pa2 w-70 center"
            type="tex"
            onChange={onInputChange}
            placeholder="Enter image URL"
          />
          <button
            style={{
              margin: 0,
              padding: 0,
            }}
            className={`w-30 f4 link ph3 pv2 dib white bg-light-silver ${
              isImageUrlValid(input) ? `grow pointer bg-light-purple` : ""
            }`}
            onClick={onButtonSubmit}
            disabled={!isImageUrlValid(input)}
          >
            Detect
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageLinkForm;
