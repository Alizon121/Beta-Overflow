import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { thunkSignup } from "../../redux/session";
import "./SignupForm.css"

function SignupFormPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  if (sessionUser) return <Navigate to="/" replace={true} />;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setErrors({
        confirmPassword:
          "Confirm Password field must be the same as the Password field",
      });
    }

    const serverResponse = await dispatch(
      thunkSignup({
        email,
        username,
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
    <div className="signup_container">
      <h2>Sign Up</h2>
      {errors.server && <p>{errors.server}</p>}
      <form onSubmit={handleSubmit}>
        <div className="signup_inputs">
          <div className="signup_email_container">
            <label>Email</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            {errors.email && <p>{errors.email}</p>}
          </div>

          <div className="signup_username_container">
            <label>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            {errors.username && <p>{errors.username}</p>}
          </div>

          <div className="signup_password_container">
            <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            {errors.password && <p>{errors.password}</p>}
          </div>
            
          <div className="signup_confirm_password_container">
            <label>Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
          </div>
        </div>
        <div className="signup_button_container">
          <button type="submit">Sign Up</button>
        </div>
      </form>
    </div>
  );
}

export default SignupFormPage;
