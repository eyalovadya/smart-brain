import React from "react";
import { ClipLoader } from "react-spinners";

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      name: "",
      isLoading: false,
      isError: false,
    };
  }

  onNameChange = (event) => {
    this.setState({ name: event.target.value });
  };

  onEmailChange = (event) => {
    this.setState({ email: event.target.value });
  };

  setIsLoading = (isLoading) => {
    this.setState({ isLoading });
  };

  setIsError = (isError) => {
    this.setState({ isError });
  };

  onPasswordChange = (event) => {
    this.setState({ password: event.target.value });
  };

  saveAuthTokenInSession = async (token) => {
    await window.localStorage.setItem("token", token);
  };

  onSubmitSignIn = async () => {
    try {
      this.setIsLoading(true);
      this.setIsError(false);
      const registerUrl = `${process.env.REACT_APP_API_BASE_URL}/register`;
      const registerOptions = {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: this.state.email,
          password: this.state.password,
          name: this.state.name,
        }),
      };
      const registerResponse = await fetch(registerUrl, registerOptions);
      if (!registerResponse.ok) throw new Error(registerResponse.statusText);

      const registerData = await registerResponse.json();

      if (registerData.userId && registerData.token) {
        await this.saveAuthTokenInSession(registerData.token);

        const profileUrl = `${process.env.REACT_APP_API_BASE_URL}/profile/${registerData.userId}`;
        const profileOprions = {
          method: "get",
          headers: {
            "Content-Type": "application/json",
            Authorization: registerData.token,
          },
        };
        const profileResponse = await fetch(profileUrl, profileOprions);
        if (!profileResponse.ok) throw new Error(profileResponse.statusText);

        const user = await profileResponse.json();

        if (user && user.email) {
          this.props.loadUser(user);
          this.props.onRouteChange("home");
        }
      }
    } catch (error) {
      this.setIsError(true);
    }
    this.setIsLoading(false);
  };

  render() {
    const { isLoading, isError } = this.state;

    return (
      <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
        <main className="pa4 black-80" style={{ width: "100%" }}>
          <div className="measure">
            <fieldset
              id="sign_up"
              className="ba b--transparent ph0 mh0"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <legend className="f1 fw6 ph0 mh0">Register</legend>
              <div className="mt3" style={{ width: "250px" }}>
                <label className="db fw6 lh-copy f6" htmlFor="name">
                  Name
                </label>
                <input
                  className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100 hover-black"
                  type="text"
                  name="name"
                  id="name"
                  onChange={this.onNameChange}
                />
              </div>
              <div className="mt3" style={{ width: "250px" }}>
                <label className="db fw6 lh-copy f6" htmlFor="email-address">
                  Email
                </label>
                <input
                  className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100 hover-black"
                  type="email"
                  name="email-address"
                  id="email-address"
                  onChange={this.onEmailChange}
                />
              </div>
              <div className="mv3" style={{ width: "250px" }}>
                <label className="db fw6 lh-copy f6" htmlFor="password">
                  Password
                </label>
                <input
                  className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100 hover-black"
                  type="password"
                  name="password"
                  id="password"
                  onChange={this.onPasswordChange}
                />
              </div>
            </fieldset>
            <div className="">
              <button
                onClick={this.onSubmitSignIn}
                className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                type="submit"
                style={{ width: 100, height: 35 }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ClipLoader color={"black"} size={20} />
                ) : (
                  "Register"
                )}
              </button>
            </div>
            {isError && (
              <div className="lh-copy mt3">
                <p
                  className="f6 link dim red db b"
                  style={{
                    border: "1px solid",
                    borderRadius: "2px",
                    backgroundColor: "rgb(0 0 0 / 50%)",
                    width: "100%",
                  }}
                >
                  Something Went Wrong! try another email or change fields
                  length
                </p>
              </div>
            )}
          </div>
        </main>
      </article>
    );
  }
}

export default Register;
