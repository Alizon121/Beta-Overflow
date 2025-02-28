import { useState } from "react";
import { thunkLogin } from "../../redux/session";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Navigate, useNavigate } from "react-router-dom";
import "./LoginForm.css";

function LoginFormPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  if (sessionUser) return <Navigate to="/" replace={true} />;

  const handleDemoUser = async () => {
    const demoEmail = "demo@aa.io";
    const demoPassword = "password";

    setErrors({});
    return dispatch(thunkLogin({ email: demoEmail, password: demoPassword }))
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) setErrors(data.errors);
        else setErrors({ general: "The demo login failed. Please try again later" });
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const serverResponse = await dispatch(
      thunkLogin({
        email,
        password,
      })
    );

    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="login_page_container">
      {errors.length > 0 &&
        errors.map((message) => <p key={message}>{message}</p>)}
      <form onSubmit={handleSubmit}>
        <div className="login_email_password_container">
          <div className="login_email_container">
            <label>Email</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            {errors.email && <p>{errors.email}</p>}
          </div>
          <div className="login_password_container">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            {errors.password && <p>{errors.password}</p>}
          </div>

        </div>
       <div className="login_button_container">
          <button id="login_form_login_button" type="submit">Log In</button>
          <button id="login_demo" type="button" onClick={handleDemoUser}>Demo</button>
       </div >
       <p id="login_signup_message">Dont have an account? <NavLink to={"/signup"}>Sign up</NavLink> </p>
      </form>
    </div>
  );
}

export default LoginFormPage;
