import { NavLink } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import { useSelector } from "react-redux";
import SearchBar from "./SearchBar";
import { LiaMountainSolid } from "react-icons/lia";
import "./Navigation.css";

function Navigation() {
  const user = useSelector(state => state.session.user)

  return (
    <div className="navigation_container">

      {
        user?
        <div className="navigation_headers_user">
            <div class="mountain_home_button">
            <NavLink to={"/?page=1"} class="home_link">
              <LiaMountainSolid/>
              <div>BetaOverflow</div>
            </NavLink>
            </div>
          <li id="navigation_user_home">
            <SearchBar/>
          </li>
          <li>
            <ProfileButton />
          </li>
        </div>
        :
      <div className="navigation_headers_no_user">
             <div class="mountain_home_button">
            <NavLink to={"/?page=1"} class="home_link">
              <LiaMountainSolid/>
              <div>BetaOverflow</div>
            </NavLink>
            </div>
        <li id="navigation_no_user_home">
          {/* <NavLink to="/">Home</NavLink> */}
          <SearchBar/>
        </li>
        <div className="navigation_login_signup_container">
          <NavLink to={"/login"}>Login</NavLink>
          <NavLink to={"/signup"}>Signup</NavLink>
          {/* MAYBE ADD A USERS TAB TO SEARCH FOR USERS? */}
          {/* WILL REQUIRE USE OF A THUNK ACTION TO FETCH ALL USERS */}
        </div>
      </div>
      }
    </div>
  );
}

export default Navigation;
