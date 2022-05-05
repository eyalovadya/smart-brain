import React, { Component } from "react";
import Particles from "react-particles-js";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import Navigation from "./components/Navigation/Navigation";
import Signin from "./components/Signin/Signin";
import Register from "./components/Register/Register";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from "./components/Rank/Rank";
import Modal from "./components/Modal/Modal";
import "./App.css";
import Profile from "./components/Profile/Profile";
import BarLoader from "react-spinners/BarLoader";

const particlesOptions = {
  //customize this to your liking
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area: 800,
      },
    },
  },
};

const initialState = {
  input: "",
  imageUrl: "",
  boxes: [],
  route: "signin",
  isSignedIn: false,
  isProfileOpen: false,
  isDetecting: false,
  user: {
    id: "",
    name: "",
    email: "",
    entries: 0,
    joined: "",
    pet: "",
    age: "",
  },
};

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  async componentDidMount() {
    const token = window.localStorage.getItem("token");
    this.onRouteChange("loading");

    if (token) {
      try {
        const url = `${process.env.REACT_APP_API_BASE_URL}/signin`;
        const options = {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        };

        const resp = await fetch(url, options);
        const data = await resp.json();

        if (data?.id) {
          const profileUrl = `${process.env.REACT_APP_API_BASE_URL}/profile/${data.id}`;
          const profileOptions = {
            method: "get",
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
          };

          const profileResp = await fetch(profileUrl, profileOptions);
          const user = await profileResp.json();

          if (user?.email) {
            this.loadUser(user);
            return this.onRouteChange("home");
          }
        }
      } catch (error) {
        console.log(error);
      }
    }

    this.onRouteChange("signin");
  }

  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        age: data.age,
        pet: data.pet,
        email: data.email,
        entries: data.entries,
        joined: data.joined,
      },
    });
  };

  calculateFaceLocation = (data) => {
    if (!data.outputs) return;
    const clarifaiFaces = data.outputs[0].data.regions;
    const image = document.getElementById("inputimage");
    const width = Number(image.width);
    const height = Number(image.height);

    return clarifaiFaces.map((region) => {
      const boundingBox = region.region_info.bounding_box;
      return {
        leftCol: boundingBox.left_col * width,
        topRow: boundingBox.top_row * height,
        rightCol: width - boundingBox.right_col * width,
        bottomRow: height - boundingBox.bottom_row * height,
      };
    });
  };

  displayFaceBox = (boxes) => {
    if (!boxes) return;
    this.setState({ boxes: boxes });
  };

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  };

  setIsDetecting = (isDetecting) => {
    this.setState({ isDetecting });
  };

  onButtonSubmit = async () => {
    this.setState({ imageUrl: this.state.input });
    const token = window.localStorage.getItem("token");

    try {
      this.displayFaceBox([]);
      this.setIsDetecting(true);
      const url = `${process.env.REACT_APP_API_BASE_URL}/imageurl`;
      const options = {
        method: "post",
        headers: { "Content-Type": "application/json", Authorization: token },
        body: JSON.stringify({
          input: this.state.input,
        }),
      };
      const resp = await fetch(url, options);
      const data = await resp.json();

      if (!data) return;

      const imageUrl = `${process.env.REACT_APP_API_BASE_URL}/image`;
      const imageOptions = {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          id: this.state.user.id,
        }),
      };

      const imageResp = await fetch(imageUrl, imageOptions);
      const count = await imageResp.json();

      this.setState(Object.assign(this.state.user, { entries: count }));
      this.displayFaceBox(this.calculateFaceLocation(data));
    } catch (error) {
      console.log(error);
    }
    this.setIsDetecting(false);
  };

  onRouteChange = (route) => {
    if (route === "signout") {
      return this.setState(initialState);
    } else if (route === "home") {
      this.setState({ isSignedIn: true });
    }
    this.setState({ route: route });
  };

  toggleModal = () => {
    this.setState((prevState) => ({
      ...prevState,
      isProfileOpen: !prevState.isProfileOpen,
    }));
  };

  render() {
    const {
      isSignedIn,
      imageUrl,
      route,
      boxes,
      isProfileOpen,
      user,
      isDetecting,
      input,
    } = this.state;
    return (
      <div className="App">
        <Particles className="particles" params={particlesOptions} />
        <Navigation
          isLoadingPage={route === "loading"}
          isSignedIn={isSignedIn}
          onRouteChange={this.onRouteChange}
          toggleModal={this.toggleModal}
          user={this.state.user}
        />
        {isProfileOpen && (
          <Modal>
            <Profile
              user={user}
              isProfileOpen={isProfileOpen}
              toggleModal={this.toggleModal}
              loadUser={this.loadUser}
            />
          </Modal>
        )}
        {route === "home" ? (
          <div>
            <ImageLinkForm
              input={input}
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}
            />
            <FaceRecognition
              boxes={boxes}
              imageUrl={imageUrl}
              isDetecting={isDetecting}
            />
          </div>
        ) : route === "loading" ? (
          <div id="loading-page">
            <div>Loading...</div>
            <BarLoader color={"black"} size={70} width={150} />
          </div>
        ) : route === "signin" ? (
          <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
        ) : (
          <Register
            loadUser={this.loadUser}
            onRouteChange={this.onRouteChange}
          />
        )}
      </div>
    );
  }
}

export default App;
