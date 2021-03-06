import React from "react";
import axios from "axios";
import { Redirect, Route, Switch, Link } from "react-router-dom";

import UserProfile from "./UserProfile";
import Followers from "./Followers";
import Following from "./Following";
import Feed from "./Feed";

class User extends React.Component {
  constructor() {
    super();
    this.state = {
      userInfo: [],
      userData: [],
      searchInput: "",
      userWorldWide: [],
      ///added class for modal
      modalClassNames: "display",
      modalData: [],
      followURL: "",
      inputURL: "",
      profilePicChanged: false,
      profilePicClassName: "display",
      userFollowers: [],
      userFollowing: [],
    };
  }

  /**
        @function retrieveUserInfo
        * This Will Retrieve The Logged In User's Information Such as ID, Username and Hashed Password
        @var userInfo
        * Will hold all User's Info in an Array
    */

  retrieveUserInfo = () => {
    axios
      .get("/users/getUserInfo")
      .then(res => {
        console.log("UserInfo:", res.data.data[0]);
        this.setState({
          userInfo: res.data.data[0]
        });
      })
      .catch(err => {
        console.log("Error:", err);
      });
  };

  /**
   * @func retrieveUserPhotos
   * This Will Retrieve Targeted User Photos
   * @var userData
   * Will hold all User's Data such as Photos in an Array
   *Kelvin Rodriguez
   */
  retrieveUserPhotos = () => {
    const { userInfo } = this.state;
    console.log("User Who's Page is Showing:", userInfo.username);
    axios
      .get(`/users/userData`)
      .then(res => {
        console.log("Photos:", res.data.data);
        this.setState({
          userData: [...res.data.data].reverse()
        });
      })
      .catch(err => {
        console.log("Error:", err);
      });
  };

  /**
   * @func retrieveFollowers
   * This Will Retrieve All of User's Followers
   * @var userFollowers
   * Will hold all User's Followers From DB
   *Kelvin Rodriguez
   */

  retrieveFollowers = () => {
    axios
      .get(`/users/followers/`)
      .then(res => {
        this.setState({
          userFollowers: res.data.data.map(user => user.username)
        });
      })
      .catch(err => {
        console.log("Error:", err);
      });
  };

  /**
   * @func retrieveFollowers
   * This Will Retrieve All of User's Followers
   * @var userFollowers
   * Will hold all User's Followers From DB
   *Kelvin Rodriguez
   */

  retrieveFollowing = () => {
    axios
      .get(`/users/following/`)
      .then(res => {
        this.setState({
          userFollowing: res.data.data.map(user => user.username)
        });
      })
      .catch(err => {
        console.log("Error:", err);
      });
  };

  /**
   * @func renderSearchEngine
   * This Will Retrieve All User's In the DB To Use For Search
   * @var userWorldWide
   * Will hold all User's Data From DB
   *Kelvin Rodriguez
   */
  renderSearchEngine = () => {
    axios
      .get("/users/all")
      .then(res => {
        this.setState({
          userWorldWide: [...res.data.data]
        });
      })
      .catch(err => {
        console.log("Error:", err);
      });
  };

  renderSearchInput = e => {
    this.setState({
      searchInput: e.target.value
    });
  };

  setFollowURL = e => {
    let followName = e.target.value;
    this.setState({
      followURL: `u/${followName.toLowerCase()}`
    });
  };

  // profile pic functions

  renderUploadInput = () => {
    this.setState({ profilePicClassName: "" });
  };

  handleUploadUrl = e => {
    this.setState({
      inputURL: e.target.value
    });
  };

  removeProfilePic = () => {
    console.log("Remove");
    axios
      .patch("/users/removeProfilePic")
      .then(res => {
        this.setState({
          profilePicChanged: true
        });
        this.modalDown("cancel");
      })
      .catch(err => {});
  };

  changeProfilePic = () => {
    axios
      .patch("/users/changeProfilePic", {
        newProfilePic: this.state.inputURL
      })
      .then(res => {
        this.setState({
          inputURL: "",
          profilePicChanged: true
        });
        this.modalDown("cancel");
      })
      .catch(err => {
        this.setState({
          inputURL: "",
          message: "Error"
        });
      });
  };

  renderUserProfile = () => {
    const {
      userData,
      userInfo,
      modalData,
      modalClassNames,
      userFollowers,
      userFollowing,
    } = this.state;
    const {
      modalUp,
      modalDown,
      renderFollowers,
      handleUploadUrl,
      renderUploadInput,
      removeProfilePic,
      changeProfilePic
    } = this;
    return (
      <UserProfile
        userData={userData}
        userInfo={userInfo}
        modalUp={modalUp}
        modalDown={modalDown}
        modalData={modalData}
        modalClassNames={modalClassNames}
        renderFollowers={renderFollowers}
        retrieveUserPhotos={this.retrieveUserPhotos}
        handleUploadUrl={this.handleUploadUrl}
        renderUploadInput={renderUploadInput}
        removeProfilePic={removeProfilePic}
        changeProfilePic={changeProfilePic}
        profilePicClassName={this.state.profilePicClassName}
        followers={userFollowers}
        following={userFollowing}
      />
    );
  };

  ///modal to show the modal
  modalUp = e => {
    let buttonName = e.target.id;
    console.log("buttonName", buttonName);
    if (this.state.modalClassNames === "display") {
      this.setState({ modalClassNames: "followModal" });

      if (e.target.id === "profile-icon") {
        this.setState({ modalData: false });
        console.log("This Will Show If It Works");
        return;
      }

      axios.get(`users/${buttonName}`).then(res => {
        this.setState({ modalData: res.data.data });
      });
    }
  };

  modalDown = e => {
    if (
      e === "cancel" ||
      e.target.className === "followModal" ||
      e.target.id === "cancel"
    ) {
      this.setState({
        modalClassNames: "display",
        modalData: [],
        profilePicClassName: "display"
      });
    }
  };

  componentWillMount() {
    this.retrieveUserInfo();
    this.renderSearchEngine();
    this.retrieveUserPhotos();
    this.retrieveFollowers();
    this.retrieveFollowing();
  }

  render() {
    const {
      userInfo,
      searchInput,
      userWorldWide,
      modalData,
      modalClassNames,
      followURL
    } = this.state;

    const { modalUp, modalDown, routeFollowPage } = this;

    if (followURL) {
      return <Redirect to={followURL} />;
    }
    console.log(
      "User Who Page Is Showing:",
      userInfo.username,
      "All User:",
      userWorldWide,
      this.state
    );

    if (this.state.profilePicChanged) {
      this.retrieveUserInfo();
      this.setState({ profilePicChanged: false });
    }
    //modal div added
    return (
      <div>
        {/* <div className={modalClassNames} onClick={modalDown}>
                  <div className="followsDiv">
                    {modalData.map(v => (
                      <div>
                        <Link to={`/u/${v.username}`}><img class="follow-img" src={v.profile_pic}/>
                        <p>{v.username}</p></Link>
                        <p>{v.full_name}</p>
                      </div>
                    ))}
                  </div>
                </div> */}

        <div id="header-bar">
          <div id="info-bar">
            <div class="icon-ig">
              <h1>
                {" "}
                <a id="ig-icon-link" href={"/feed"}>
                  {" "}
                  {
                    <img
                      src="https://png.icons8.com/ios/1600/instagram-new.png"
                      width="30px"
                      height="30px"
                    />
                  }{" "}
                </a>{" "}
                Instagram{" "}
              </h1>
            </div>
            <div class="searchbar">
              <input
                class="searchbar"
                type="text"
                value={this.state.searchInput}
                onChange={this.renderSearchInput}
                placeholder={"Search"}
              />
            </div>
            <div class="icon-profile">
              <a id="ig-icon-link" href={"/user"}>
                {<i class="fa fa-user-o" />}
              </a>
              {"  .    "}
              {"   .   "} <i class="fa fa-heart-o" />{" "}
            </div>
          </div>
          <div className="searchResultBox">
            {userWorldWide.map(user => {
              if (
                user.username
                  .toLowerCase()
                  .includes(searchInput.toLowerCase()) &&
                searchInput
              ) {
                return (
                  <a
                    className="search_links"
                    href={`/u/${user.username.toLowerCase()}`}
                  >
                    {" "}
                    {
                      <div className="search_user_div">
                        <span className="search_profilepic">
                          <img className='user_thumbnail' src={user.profile_pic} width={"50px"}  height={"50px"}/>
                        </span>
                        <span className="username_header">{user.username}</span>
                        <span className="fullname">{user.full_name}</span>
                      </div>
                    }
                  </a>
                );
              }
            })}
          </div>
        </div>

        <Switch>
          <Route path="/feed" component={Feed} />
          <Route exact path="/user" render={this.renderUserProfile} />
          <Route exact path="/user/followers" render={this.renderFollowers} />
          <Route exact path="/user/following" render={this.renderFollowing} />
        </Switch>
      </div>
    );
  }
}

export default User;
