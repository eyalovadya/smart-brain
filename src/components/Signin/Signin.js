import React from "react";
import "./Signin.css";
import ClipLoader from "react-spinners/ClipLoader";

class Signin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      signInEmail: "",
      signInPassword: "",
      isLoading: false,
      isError: false,
    };
  }

  onEmailChange = (event) => {
    this.setState({ signInEmail: event.target.value });
  };

  onPasswordChange = (event) => {
    this.setState({ signInPassword: event.target.value });
  };

  setIsLoading = (isLoading) => {
    this.setState({ isLoading });
  };

  setIsError = (isError) => {
    this.setState({ isError });
  };

  saveAuthTokenInSession = async (token) => {
    await window.localStorage.setItem("token", token);
  };

  onSubmitSignIn = async () => {
    try {
      this.setIsLoading(true);
      this.setIsError(false);
      const signinUrl = `${process.env.REACT_APP_API_BASE_URL}/signin`;
      const signinOptions = {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: this.state.signInEmail,
          password: this.state.signInPassword,
        }),
      };
      const signinResp = await fetch(signinUrl, signinOptions);

      if (!signinResp.ok) throw new Error(signinResp.statusText);

      const signinData = await signinResp.json();

      if (signinData.userId && signinData.token) {
        await this.saveAuthTokenInSession(signinData.token);

        const profileUrl = `${process.env.REACT_APP_API_BASE_URL}/profile/${signinData.userId}`;
        const profileOprions = {
          method: "get",
          headers: {
            "Content-Type": "application/json",
            Authorization: signinData.token,
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
    const { onRouteChange } = this.props;
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
              <legend className="f1 fw6 ph0 mh0">Sign In</legend>
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
                  "Sign in"
                )}
              </button>
            </div>
            <div className="lh-copy mt3">
              <p
                onClick={() => onRouteChange("register")}
                className="f6 link dim black db pointer"
              >
                Register
              </p>
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
                  Wrong email or password
                </p>
              </div>
            )}
          </div>
        </main>
      </article>
    );
  }
}

export default Signin;
