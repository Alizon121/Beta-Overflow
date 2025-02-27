import { NavLink } from "react-router-dom";
import "./NavigationSignup.css"

function NavigationSignup() {
   return (
   <div>
        <div className="navigation_signup">
            <li id="navigation_signup_home">
                        <NavLink to="/">Home</NavLink>
            </li>
            <li id="navigation_signup_login">
                <NavLink to={"/login"}>Login</NavLink>
            </li>
        </div>
    </div>

   )
   
}

export default NavigationSignup