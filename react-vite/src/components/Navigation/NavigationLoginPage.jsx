import { NavLink } from "react-router-dom"
import "./NavigationLogin.css"

function NavigationLoginPage () {

    return (
        <div>
             <div className="navigation_login">
                <li id="navigation_login_home">
                    <NavLink to="/">Home</NavLink>
                </li>
                <div className="navigation_login_signup">
                    <NavLink to={"/signup"}>Signup</NavLink>
                </div>
            </div>
        </div>
    )   
}

export default NavigationLoginPage;