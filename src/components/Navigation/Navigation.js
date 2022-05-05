import React from "react";
import Logo from "../Logo/Logo";
import ProfileIcon from "../Profile/ProfileIcon";
import Rank from "../Rank/Rank";

const Navigation = ({
  onRouteChange,
  isSignedIn,
  toggleModal,
  isLoadingPage,
  user,
}) => {
  if (isLoadingPage) return null;
  if (isSignedIn) {
    return (
      <nav
        className="ma4"
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <div style={{ display: "flex", height: "100%" }}>
          <Logo />
          <Rank name={user.name} entries={user.entries} />
        </div>
        <ProfileIcon onRouteChange={onRouteChange} toggleModal={toggleModal} />
      </nav>
    );
  } else {
    return (
      <nav style={{ display: "flex", justifyContent: "flex-end" }}>
        <p
          onClick={() => onRouteChange("signin")}
          className="f3 link dim black underline pa3 pointer"
        >
          Sign In
        </p>
        <p
          onClick={() => onRouteChange("register")}
          className="f3 link dim black underline pa3 pointer"
        >
          Register
        </p>
      </nav>
    );
  }
};

export default Navigation;
