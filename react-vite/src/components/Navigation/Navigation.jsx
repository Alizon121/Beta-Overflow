import { NavLink } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import { useSelector } from "react-redux";
import "./Navigation.css";

function Navigation() {
  const user = useSelector(state => state.session.user)

  return (
    <div>

      {
        user?
        <div>
          <li>
            <NavLink to="/">Home</NavLink>
          </li>
          <li>
            <ProfileButton />
          </li>
        </div>
        :
      <div>
        <li>
          <NavLink to="/">Home</NavLink>
        </li>
        <div className="navigation_login_signup_container">
          <button><NavLink to={"/login"}/>Login</button>
          <button><NavLink to={"/signup"}/>Signup</button>
          {/* MAYBE ADD A USERS TAB TO SEARCH FOR USERS? */}
          {/* WILL REQUIRE USE OF A THUNK ACTION TO FETCH ALL USERS */}
        </div>
      </div>
      }
    </div>
  );
}

export default Navigation;
