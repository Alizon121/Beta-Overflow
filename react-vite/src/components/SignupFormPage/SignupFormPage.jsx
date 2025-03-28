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
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  if (sessionUser) return <Navigate to="/" replace={true} />;

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors({})

    const newErrors = {}

    if (password !== confirmPassword) newErrors.confirmPassword = "Passwords must match"
    if (username.length < 4) newErrors.username = "Username must be at least 4 characters."
    if (password.length < 6) newErrors.password = "Password must be greater than 6 characters."
    if (!validateEmail(email)) newErrors.email = "Email is invalid"

    if (Object.values(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const serverResponse = await dispatch(
      thunkSignup({
        email,
        first_name: firstName,
        last_name: lastName,
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
      {errors.server && <p className="error">{errors.server}</p>}
      <form onSubmit={handleSubmit}>
        <div className="signup_content_container">
          <div className="signup_inputs">
            <div className="signup_email_container">
              <label>Email</label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              {errors.email && <p className="error">{errors.email}</p>}
            </div>

            <div className="signup_first_name_container">
              <label>First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              {errors.firstName && <p className="error">{errors.firstName}</p>}
            </div>

            <div className="signup_last_name_container">
              <label>Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              {errors.lastName && <p className="error">{errors.lastName}</p>}
            </div>

            <div className="signup_username_container">
              <label>Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              {errors.username && <p className="error">{errors.username}</p>}
            </div>

            <div className="signup_password_container">
              <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              {errors.password && <p className="error">{errors.password}</p>}
            </div>
              
            <div className="signup_confirm_password_container">
              <label>Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
            </div>
          </div>
          <div className="signup_button_container">
            <button type="submit">Sign Up</button>
          </div>

        </div>

      </form>
    </div>
  );
}

export default SignupFormPage;
