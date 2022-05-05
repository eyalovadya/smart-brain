import React, { useState } from "react";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

const ProfileIcon = ({ onRouteChange, toggleModal }) => {
  const [dropDownOpen, setDropDownOpen] = useState(false);

  const toggle = () => {
    setDropDownOpen(!dropDownOpen);
  };

  const onSignOut = async () => {
    const token = window.localStorage.getItem("token");
    try {
      const signoutUrl = `${process.env.REACT_APP_API_BASE_URL}/signout`;
      const signoutOprions = {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      };
      const signoutResponse = await fetch(signoutUrl, signoutOprions);

      if (!signoutResponse.ok) throw new Error(signoutResponse.statusText);

      await signoutResponse.json();
    } catch (error) {
      console.log(error);
    }

    window.localStorage.removeItem("token");
    onRouteChange("signout");
  };

  return (
    <div className="">
      <Dropdown isOpen={dropDownOpen} toggle={toggle}>
        <DropdownToggle
          tag="span"
          data-toggle="dropdown"
          aria-expanded={dropDownOpen}
        >
          <img
            src="http://tachyons.io/img/logo.jpg"
            className="br-100 h3 w3 dib"
            style={{ marginBottom: "0 !important" }}
            alt="avatar"
          />
        </DropdownToggle>
        <DropdownMenu
          className="b--transparent shadow-5"
          style={{ marginTop: 20, backgroundColor: "rgba(255,255,255,0.5)" }}
        >
          <DropdownItem onClick={toggleModal}>View Profile</DropdownItem>
          <DropdownItem onClick={onSignOut}>Sign Out</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

export default ProfileIcon;
